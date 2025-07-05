import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { CategorySchema } from "@/types/category";
import { NextApiRequest, NextApiResponse } from "next";

type CategoryResponse = {
    categories: CategorySchema[];
    totalCount: number;
    error?: string;
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CategoryResponse>,
    user: AuthenticatedUser
) {
    if (req.method === 'GET') {
        try {
            const categories = await prisma.category.findMany({
                where: {
                    OR: [
                        { createdById: user.id },
                        { createdById: 'system' }
                    ]
                },
                orderBy: [
                    { name: 'asc' },
                ],
            });

            return res.status(200).json({ 
                categories,
                totalCount: categories.length,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ 
                error: 'Failed to load categories', 
                categories: [],
                totalCount: 0
            });
        }
    } else {
        return res.status(405).json({ 
            error: 'Method not allowed', 
            categories: [],
            totalCount: 0 
        });
    }
}

export default withAuth(handler);