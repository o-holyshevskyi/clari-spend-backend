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

            if (existingSpend.createdById !== user.id) {
                return res.status(403).json({
                    error: 'You are not authorized to delete this spend.',
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
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    error: 'Spend not found or already deleted',
                    spend: null
                });
            }

            return res.status(500).json({
                error: 'Failed to delete spend due to an internal server error',
                spend: null
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', spend: null });
    }
}

export default withAuth(handler);
