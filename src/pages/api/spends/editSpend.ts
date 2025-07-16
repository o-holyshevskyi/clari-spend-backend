import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { PaymentMethods, SpendSchema } from "@/types/spends";
import { NextApiRequest, NextApiResponse } from "next";

type SpendsResponse = {
    spend: SpendSchema | null;
    error?: string;
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SpendsResponse>,
    user: AuthenticatedUser
) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { 
                description, 
                categoryId, 
                amount, 
                paymentMethod,
                date,
                notes,
            } = req.body;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ 
                    error: 'Spend ID is required', 
                    spend: null 
                });
            }

            const existingSpend = await prisma.spend.findUnique({
                where: { id },
                include: { category: true }
            });

            if (!existingSpend) {
                return res.status(404).json({
                    error: 'Spend not found',
                    spend: null
                });
            }

            if (existingSpend.createdById !== user.id) {
                return res.status(403).json({
                    error: 'You are not authorized to update this spend.',
                    spend: null
                });
            }

            const updateData: any = {
                updatedById: user.id,
                updatedAt: new Date()
            };

            if (description !== undefined) {
                if (typeof description !== 'string' || description.trim().length === 0) {
                    return res.status(400).json({
                        error: 'Description must be a non-empty string',
                        spend: null
                    });
                }
                updateData.description = description.trim();
            }

            if (amount !== undefined) {
                if (typeof amount !== 'number' || amount <= 0) {
                    return res.status(400).json({
                        error: 'Amount must be a positive number',
                        spend: null
                    });
                }
                updateData.amount = amount;
            }

            if (paymentMethod !== undefined) {
                const validPaymentMethods: PaymentMethods[] = ['card', 'cash', 'bank-transfer', 'digital-wallet'];
                if (!validPaymentMethods.includes(paymentMethod)) {
                    return res.status(400).json({
                        error: 'Invalid payment method. Must be one of: card, cash, bank-transfer, digital-wallet',
                        spend: null
                    });
                }
                updateData.paymentMethod = paymentMethod;
            }

            if (categoryId !== undefined) {
                if (typeof categoryId !== 'string' || categoryId.trim().length === 0) {
                    return res.status(400).json({
                        error: 'Category ID must be a non-empty string',
                        spend: null
                    });
                }
                
                const newCategory = await prisma.category.findFirst({
                    where: {
                        id: categoryId,
                        OR: [
                            { createdById: user.id },
                            { createdById: 'system' }
                        ]
                    }
                });

                if (!newCategory) {
                    return res.status(400).json({
                        error: 'Invalid new category ID or category not accessible to your account.',
                        spend: null
                    });
                }
                updateData.categoryId = categoryId;
            }

            if (date !== undefined) {
                if (typeof date !== 'string') {
                    return res.status(400).json({
                        error: 'Invalid date',
                        spend: null
                    });
                }
                updateData.date = date;
            }

            if (notes !== undefined) {
                if (typeof notes !== 'string') {
                    return res.status(400).json({
                        error: 'Notes must be a string',
                        spend: null
                    });
                }
                updateData.notes = notes.trim();
            }

            const updatedSpend = await prisma.spend.update({
                where: { id },
                data: updateData,
                include: { category: true }
            });

            const formattedSpend: SpendSchema = {
                ...updatedSpend,
                paymentMethod: updatedSpend.paymentMethod as PaymentMethods,
            };

            return res.status(200).json({ spend: formattedSpend });
        } catch (error: any) {
            if (error.code === 'P2003') { // Prisma error code for foreign key constraint violation
                return res.status(400).json({
                    error: 'Invalid category ID provided.',
                    spend: null
                });
            }

            if (error.code === 'P2025') { // Prisma error code for record not found (e.g., if ID was valid but record was deleted before update)
                return res.status(404).json({
                    error: 'Spend not found or already deleted',
                    spend: null
                });
            }

            return res.status(500).json({
                error: 'Failed to update spend due to an internal server error',
                spend: null
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', spend: null });
    }
}

export default withAuth(handler);