import { prisma } from "@/lib/db";
import { PaymentMethods, SpendSchema } from "@/types/spends";
import { NextApiRequest, NextApiResponse } from "next";

type SpendsResponse = {
    spend: SpendSchema | null;
    error?: string;
}

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse<SpendsResponse>
) {
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const { 
                description, 
                categoryId, 
                amount, 
                paymentMethod, 
                notes,
                updatedById 
            } = req.body;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ 
                    error: 'Spend ID is required', 
                    spend: null 
                });
            }

            if (!updatedById) {
                return res.status(400).json({ 
                    error: 'updatedById is required', 
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

            const updateData: any = {
                updatedById,
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
                updateData.categoryId = categoryId;
            }

            if (notes !== undefined) {
                if (typeof notes !== 'string') {
                    return res.status(400).json({ 
                        error: 'Notes must be a string', 
                        spend: null 
                    });
                }
                updateData.notes = notes;
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
        } catch (error) {
            if (error instanceof Error && error.message.includes('Foreign key constraint')) {
                return res.status(400).json({ 
                    error: 'Invalid category ID or user ID', 
                    spend: null 
                });
            }

            if (error instanceof Error && error.message.includes('Record to update not found')) {
                return res.status(404).json({ 
                    error: 'Spend not found', 
                    spend: null 
                });
            }

            return res.status(500).json({ 
                error: 'Failed to update spend', 
                spend: null 
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', spend: null });
    }
}