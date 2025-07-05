// lib/auth-utils.ts
import { NextApiRequest, NextApiResponse } from 'next';
// Reverting to the recommended Clerk client for Next.js server-side operations
import { verifyToken, clerkClient } from '@clerk/nextjs/server';

export type AuthenticatedUser = {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
};

type AuthResult<T = any> = {
    isValid: boolean;
    error?: string;
    status?: number;
    user?: AuthenticatedUser;
    userId?: string;
};

/**
 * Higher-order function to wrap API handlers with authentication logic.
 * It validates the incoming request's authorization token and passes the authenticated user
 * object to the handler if successful.
 */
export function withAuth<T = any>(
    handler: (req: NextApiRequest, res: NextApiResponse<T>, user: AuthenticatedUser) => Promise<void | NextApiResponse<T>>
) {
    return async (req: NextApiRequest, res: NextApiResponse<T>) => {
        // Validate the authentication token from the request
        const authResult = await validateAuth(req);

        // If authentication fails, return an error response
        if (!authResult.isValid) {
            console.error(`[Auth Error] Status: ${authResult.status || 401}, Message: ${authResult.error}`);
            return res.status(authResult.status || 401).json({
                error: authResult.error || 'Unauthorized'
            } as T);
        }

        // If authentication is successful, proceed with the original handler, passing the user object
        return handler(req, res, authResult.user!);
    };
}

/**
 * Validates the authentication token from the incoming NextApiRequest.
 * It extracts the Bearer token, verifies it using Clerk's `verifyToken`,
 * and then fetches the user details from Clerk's API.
 */
export async function validateAuth(req: NextApiRequest): Promise<AuthResult> {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check for Authorization header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.warn('[Auth Warning] Missing or invalid authorization header.');
            return {
                isValid: false,
                error: 'Missing or invalid authorization header',
                status: 401
            };
        }

        // Extract the token by removing 'Bearer ' prefix
        const token = authHeader.substring(7);
        console.log('[Auth Debug] CLERK_SECRET_KEY status:', process.env.CLERK_SECRET_KEY ? 'Set' : 'Not Set');

        // Crucial: Ensure CLERK_SECRET_KEY is defined for clerkClient to work correctly
        if (!process.env.CLERK_SECRET_KEY) {
            console.error('[Auth Error] CLERK_SECRET_KEY is not defined. Clerk client cannot authorize API calls.');
            return {
                isValid: false,
                error: 'Server configuration error: Clerk secret key missing.',
                status: 500
            };
        }

        let payload;
        // 2. Verify the token using Clerk's verifyToken
        try {
            payload = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
            });
            console.log('[Auth Debug] Token Payload Subject (sub):', payload?.sub);
        } catch (verifyError: any) {
            console.error(`[Auth Error] Clerk Token Verification Failed: ${verifyError.message}`);
            // If the token is expired, `verifyToken` will throw an error with a message like "JWT is expired."
            return {
                isValid: false,
                error: 'Token verification failed',
                status: 401
            };
        }

        // 3. Check if payload or subject is missing after verification
        if (!payload || !payload.sub) {
            console.error('[Auth Error] Invalid token payload: missing subject (sub) claim.');
            return {
                isValid: false,
                error: 'Invalid token payload',
                status: 401
            };
        }

        let user;
        // 4. Fetch user details from Clerk using the subject (user ID) from the payload
        try {
            const client = await clerkClient(); 
            user = await client.users.getUser(payload.sub);
            console.log(`[Auth Debug] Successfully fetched user from Clerk: ${user.id}`);
        } catch (clerkUserError: any) {
            console.error(`[Auth Error] Failed to fetch user from Clerk API for sub "${payload.sub}": ${clerkUserError.message}`);
            return {
                isValid: false,
                error: 'Failed to retrieve user details from Clerk',
                status: 401
            };
        }

        // If all checks pass, return a successful authentication result
        return {
            isValid: true,
            user: {
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress || '',
                firstName: user.firstName,
                lastName: user.lastName,
            },
            userId: payload.sub
        };
    } catch (error: any) {
        // Catch any unexpected errors during the authentication process
        console.error(`[Auth Error] Unexpected error in validateAuth: ${error.message}`);
        return {
            isValid: false,
            error: 'Internal server error during authentication',
            status: 500
        };
    }
}
