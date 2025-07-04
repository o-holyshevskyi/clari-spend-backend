import { prisma } from "@/lib/db";
import { CategorySchema } from "@/types/category";
import { NextApiRequest, NextApiResponse } from "next";

type CategoryResponse = {
    category: CategorySchema | null;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CategoryResponse>
) {
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ 
                    error: 'Category ID is required', 
                    category: null 
                });
            }

            const existingCategory = await prisma.category.findUnique({
                where: { id }
            });

            if (!existingCategory) {
                return res.status(404).json({ 
                    error: 'Category not found', 
                    category: null 
                });
            }

            const associatedSpends = await prisma.spend.findFirst({
                where: { categoryId: id }
            });

            if (associatedSpends) {
                return res.status(409).json({ 
                    error: 'Cannot delete category with existing expenses. Please reassign or delete associated expenses first.', 
                    category: null 
                });
            }

            const deletedCategory = await prisma.category.delete({
                where: { id }
            });

            return res.status(200).json({ 
                category: deletedCategory
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
                return res.status(404).json({ 
                    error: 'Category not found', 
                    category: null 
                });
            }

            return res.status(500).json({ 
                error: 'Failed to delete category', 
                category: null 
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', category: null });
    }
}