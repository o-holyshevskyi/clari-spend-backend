import { clerkClient, verifyToken } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface AuthResult {
  isValid: boolean;
  user?: AuthenticatedUser;
  userId?: string;
  error?: string;
  status?: number;
}

export async function validateAuth(req: NextApiRequest): Promise<AuthResult> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                isValid: false,
                error: 'Missing or invalid authorization header',
                status: 401
            };
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY
        });
    
        if (!payload || !payload.sub) {
            return {
                isValid: false,
                error: 'Invalid token',
                status: 401
            };
        }

        const client = await clerkClient();
        const user = await client.users.getUser(payload.sub);

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
    } catch (error) {
        return {
            isValid: false,
            error: 'Token verification failed',
            status: 401
        };
    }
}

export function withAuth<T = any>(
  handler: (req: NextApiRequest, res: NextApiResponse<T>, user: AuthenticatedUser) => Promise<void | NextApiResponse<T>>
) {
  return async (req: NextApiRequest, res: NextApiResponse<T>) => {
    const authResult = await validateAuth(req);

    if (!authResult.isValid) {
      return res.status(authResult.status || 401).json({
        error: authResult.error || 'Unauthorized'
      } as T);
    }

    return handler(req, res, authResult.user!);
  };
}
