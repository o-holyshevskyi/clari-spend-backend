import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { PaymentMethods, SpendSchema } from "@/types/spends"
import { NextApiRequest, NextApiResponse } from "next";

type SpendsResponse = {
    spend: SpendSchema | null;
    error?: string;
};

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SpendsResponse>,
    user: AuthenticatedUser
) {
    if (req.method === 'POST') {
        try {
            const { 
                amount, 
                description, 
                categoryId, 
                paymentMethod, 
                date,
                notes,
            } = req.body;

            if (!amount || !description || !categoryId || !paymentMethod) {
                return res.status(400).json({ 
                    error: 'Missing required fields: amount, description, categoryId, and paymentMethod are required', 
                    spend: null 
                });
            }

            if (typeof amount !== 'number' || amount <= 0) {
                return res.status(400).json({ 
                    error: 'Amount must be a positive number', 
                    spend: null 
                });
            }

            const validPaymentMethods: PaymentMethods[] = ['card', 'cash', 'bank-transfer', 'digital-wallet'];
            if (!validPaymentMethods.includes(paymentMethod)) {
                return res.status(400).json({ 
                    error: 'Invalid payment method. Must be one of: card, cash, bank-transfer, digital-wallet', 
                    spend: null 
                });
            }

            if (typeof description !== 'string' || description.trim().length === 0) {
                return res.status(400).json({
                    error: 'Description must be a non-empty string',
                    spend: null
                });
            }

            const category = await prisma.category.findFirst({
                where: {
                    id: categoryId,
                    OR: [
                        { createdById: user.id },
                        { createdById: 'system' }
                    ]
                }
            });

            if (!category) {
                return res.status(400).json({
                    error: 'Invalid category ID or category not accessible to your account.',
                    spend: null
                });
            }

            const newSpend = await prisma.spend.create({
                data: {
                    amount,
                    description: description.trim(),
                    categoryId,
                    paymentMethod,
                    date: new Date(date),
                    notes: notes ? String(notes).trim() : '',
                    createdById: user.id,
                    updatedById: user.id,
                },
                include: { category: true },
            });

            const formattedSpend: SpendSchema = {
                ...newSpend,
                paymentMethod: newSpend.paymentMethod as PaymentMethods,
            };

            return res.status(201).json({ spend: formattedSpend });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Foreign key constraint')) {
                return res.status(400).json({ 
                    error: 'Invalid category ID or user ID', 
                    spend: null 
                });
            }

            return res.status(500).json({ 
                error: 'Failed to create spend', 
                spend: null 
            });
        }       
    } else {
        return res.status(405).json({ error: 'Method not allowed', spend: null })
    }
}

export default withAuth(handler);