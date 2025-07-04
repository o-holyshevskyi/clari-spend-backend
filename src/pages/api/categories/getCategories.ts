import { prisma } from "@/lib/db";
import { CategorySchema } from "@/types/category";
import { NextApiRequest, NextApiResponse } from "next";

type CategoryResponse = {
    categories: CategorySchema[];
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CategoryResponse>
) {
    if (req.method === 'GET') {
        try {
            const categories = await prisma.category.findMany({
                orderBy: [
                    { name: 'asc' }
                ],
            });

            return res.status(200).json({ 
                categories, 
            });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to load categories', categories: [] });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', categories: [] });
    }
}