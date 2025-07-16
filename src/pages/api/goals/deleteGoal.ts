import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { GoalSchema } from "@/types/goal";
import { NextApiRequest, NextApiResponse } from "next";

type GoalResponse = {
    goal: GoalSchema | null;
    error?: string;
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GoalResponse>,
    user: AuthenticatedUser
) {
    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({ 
                    error: 'Goal ID is required', 
                    goal: null 
                });
            }

            // First, find and verify ownership
            const existingGoal = await prisma.goal.findUnique({
                where: { id }
            });

            if (!existingGoal) {
                return res.status(404).json({ 
                    error: 'Goal not found', 
                    goal: null 
                });
            }

            if (existingGoal.createdById !== user.id) {
                return res.status(403).json({
                    error: 'You are not authorized to delete this goal.',
                    goal: null
                });
            }

            // Then delete using just the ID
            const deletedGoal = await prisma.goal.delete({
                where: { id }
            });

            return res.status(200).json({ 
                goal: deletedGoal
            });
        } catch (error) {
            console.error('Delete error:', error);
            return res.status(500).json({ 
                error: 'Failed to delete goal', 
                goal: null 
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', goal: null });
    }
}

export default withAuth(handler);