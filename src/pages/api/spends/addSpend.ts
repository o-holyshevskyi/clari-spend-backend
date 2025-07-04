import { prisma } from "@/lib/db";
import { PaymentMethods, SpendSchema } from "@/types/spends"
import { NextApiRequest, NextApiResponse } from "next";

type SpendsResponse = {
    spend: SpendSchema | null;
    error?: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SpendsResponse>,
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
                createdById,
                updatedById 
            } = req.body;

            if (!amount || !description || !categoryId || !paymentMethod || !createdById) {
                return res.status(400).json({ 
                    error: 'Missing required fields: amount, description, categoryId, paymentMethod, and createdById are required', 
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

            const newSpend = await prisma.spend.create({
                data: {
                    amount,
                    description,
                    categoryId,
                    paymentMethod,
                    date: date ? new Date(date) : new Date(),
                    notes: notes || '',
                    createdById,
                    updatedById: updatedById || createdById,
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