import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

type ContributionResponse = {
    contribution?: any;
    contributions?: any[];
    error?: string;
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ContributionResponse>,
    user: AuthenticatedUser
) {
    const { id } = req.query; // Goal ID

    if (!id || typeof id !== 'string') {
        return res.status(400).json({
            error: 'Goal ID is required'
        });
    }

    // Verify goal exists and belongs to user
    const goal = await prisma.goal.findUnique({
        where: { id }
    });

    if (!goal) {
        return res.status(404).json({
            error: 'Goal not found'
        });
    }

    if (goal.createdById !== user.id) {
        return res.status(403).json({
            error: 'You are not authorized to access this goal'
        });
    }

    if (req.method === 'POST') {
        // Add new contribution
        try {
            const { amount, description } = req.body;

            if (!amount || typeof amount !== 'number' || amount <= 0) {
                return res.status(400).json({
                    error: 'Amount must be a positive number'
                });
            }

            // Create contribution record
            const contribution = await prisma.contribution.create({
                data: {
                    amount,
                    description: description || null,
                    goalId: id,
                    createdById: user.id,
                    createdAt: new Date(),
                }
            });

            // Update goal's saved amount
            await prisma.goal.update({
                where: { id },
                data: {
                    savedAmount: {
                        increment: amount
                    },
                    updatedAt: new Date(),
                    updatedById: user.id,
                }
            });

            return res.status(201).json({ contribution });
        } catch (error: any) {
            return res.status(500).json({
                error: 'Failed to add contribution'
            });
        }
    } else if (req.method === 'GET') {
        // Get contribution history
        try {
            const contributions = await prisma.contribution.findMany({
                where: { goalId: id },
                orderBy: { createdAt: 'desc' },
            });

            return res.status(200).json({ contributions });
        } catch (error: any) {
            return res.status(500).json({
                error: 'Failed to fetch contributions'
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

export default withAuth(handler);