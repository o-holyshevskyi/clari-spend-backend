import { prisma } from "@/lib/db";
import { PaymentMethods, SpendSchema } from "@/types/spends";
import { NextApiRequest, NextApiResponse } from "next";

type SpendsResponse = {
    spend: SpendSchema | null;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<SpendsResponse>
) {
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
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

            const deletedSpend = await prisma.spend.delete({
                where: { id },
                include: { category: true }
            });

            const formattedSpend: SpendSchema = {
                ...deletedSpend,
                paymentMethod: deletedSpend.paymentMethod as PaymentMethods,
            };

            return res.status(200).json({ spend: formattedSpend });
        } catch (error) {
            if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
                return res.status(404).json({ 
                    error: 'Spend not found', 
                    spend: null 
                });
            }

            return res.status(500).json({ 
                error: 'Failed to delete spend', 
                spend: null 
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', spend: null });
    }
}