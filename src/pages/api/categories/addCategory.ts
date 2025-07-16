import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { CategorySchema } from "@/types/category";
import { NextApiRequest, NextApiResponse } from "next";

type CategoryResponse = {
    category: CategorySchema | null;
    error?: string;
};

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CategoryResponse>,
    user: AuthenticatedUser
) {
    if (req.method === 'POST') {
        try {
            const {
                name,
                icon,
                color,
            } = req.body;

            if (!name || !icon || !color) {
                return res.status(400).json({ 
                    error: 'Missing required fields: name, icon, and color are required', 
                    category: null 
                });
            }

            if (typeof name !== 'string' || name.trim().length === 0) {
                return res.status(400).json({ 
                    error: 'Name must be a non-empty string', 
                    category: null 
                });
            }

            if (typeof icon !== 'string' || icon.trim().length === 0) {
                return res.status(400).json({ 
                    error: 'Icon must be a non-empty string', 
                    category: null 
                });
            }

            const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
            if (typeof color !== 'string' || !colorRegex.test(color)) {
                return res.status(400).json({ 
                    error: 'Color must be a valid hex color (e.g., #FF0000 or #F00)', 
                    category: null 
                });
            }

            const existingCategory = await prisma.category.findFirst({
                where: {
                    name: {
                        equals: name.trim(),
                        mode: 'insensitive'
                    },
                    OR: [
                        { createdById: user.id },
                        { createdById: 'system' }
                    ]
                }
            });

            if (existingCategory) {
                return res.status(409).json({ 
                    error: 'Category with this name already exists', 
                    category: null 
                });
            }

            const newCategory = await prisma.category.create({
                data: {
                    name: name.trim(),
                    icon: icon.trim(),
                    color: color.trim(),
                    createdById: user.id,
                    updatedById: user.id,
                }
            });

            return res.status(201).json({ category: newCategory });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Foreign key constraint')) {
                return res.status(400).json({ 
                    error: 'Invalid user ID', 
                    category: null 
                });
            }

            if (error instanceof Error && error.message.includes('Unique constraint')) {
                return res.status(409).json({ 
                    error: 'Category with this name already exists', 
                    category: null 
                });
            }

            return res.status(500).json({ 
                error: 'Failed to create category', 
                category: null 
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', category: null });
    }
}

export default withAuth(handler);