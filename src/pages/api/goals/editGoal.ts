import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { GoalSchema } from "@/types/goal"
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
    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const {
                name,
                targetAmount,
                targetDate,
            } = req.body;

            if (!id || typeof id !== 'string') {
                return res.status(400).json({
                    error: 'Goal ID is required',
                    goal: null
                });
            }

            const existingGoal = await prisma.goal.findUnique({
                where: { id }
            });

            if (!existingGoal) {
                return res.status(404).json({
                    error: 'Goal not found',
                    goal: null,
                });
            }

            if (existingGoal.createdById !== user.id) {
                return res.status(403).json({
                    error: 'You are not authorized to update this spend.',
                    goal: null,
                });
            }

            const updateData: any = {
                updatedById: user.id,
                updatedAt: new Date(),
            }

            if (name !== undefined) {
                if (typeof name !== 'string' || name.trim().length === 0) {
                    return res.status(400).json({
                        error: "Name must be a non-empty string",
                        goal: null
                    });
                }
                updateData.name = name;
            }
            
            if (targetAmount !== undefined) {
                if (typeof targetAmount !== 'number' || targetAmount <= 0) {
                    return res.status(400).json({
                        error: 'Saved amount must be a positive number',
                        goal: null,
                    });
                }
                updateData.targetAmount = targetAmount;
            }

            if (targetDate !== undefined) {
                const parsedTargetDate = new Date(targetDate);

                if (isNaN(parsedTargetDate.getTime()) || parsedTargetDate < new Date()) {
                    return res.status(400).json({
                        error: "Target Date must be a valid date and in the future.",
                        goal: null
                    });
                }
                updateData.targetDate = targetDate;
            }

            const updatedGoal = await prisma.goal.update({
                where: { id },
                data: updateData,
            });

            return res.status(200).json({ goal: updatedGoal });
        } catch (error: any) {
            if (error.code === 'P2025') { // Prisma error code for record not found (e.g., if ID was valid but record was deleted before update)
                return res.status(404).json({
                    error: 'Goal not found or already deleted',
                    goal: null
                });
            }

            return res.status(500).json({
                error: 'Failed to update goal due to an internal server error',
                goal: null
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', goal: null });
    }
}

export default withAuth(handler);
