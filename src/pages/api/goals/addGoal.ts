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
    user: AuthenticatedUser) {
    if (req.method === 'POST') {
        try {
            const {
                name,
                targetAmount,
                color,
                icon,
                savedAmount,
                targetDate
            } = req.body;

            if (!name || !targetAmount) {
                return res.status(400).json({
                    error: "Missing required fields: name and targetAmount are required",
                    goal: null
                });
            }

            if (typeof name !== 'string' || name.trim().length === 0) {
                return res.status(400).json({
                    error: "Name must be a non-empty string",
                    goal: null
                });
            }

            if (typeof targetAmount !== 'number' || targetAmount <= 0) {
                return res.status(400).json({ 
                    error: 'Target amount must be a positive number', 
                    goal: null 
                });
            }

            const existingGoal = await prisma.goal.findFirst({
                where: {
                    name: {
                        equals: name.trim(),
                        mode: 'insensitive'
                    }
                }
            });

            if (existingGoal) {
                return res.status(409).json({
                    error: "Goal with this name already exists",
                    goal: null
                });
            }

            const newGoal = await prisma.goal.create({
                data: {
                    name: name.trim(),
                    color,
                    icon,
                    targetAmount,
                    savedAmount,
                    targetDate,
                    createdById: user.id,
                    updatedById: user.id,
                }
            });

            return res.status(201).json({ goal: newGoal });
        } catch (error: any) {
            console.error(error.message)

            if (error instanceof Error && error.message.includes('Foreign key constraint')) {
                return res.status(400).json({ 
                    error: 'Invalid user ID', 
                    goal: null 
                });
            }

            if (error instanceof Error && error.message.includes('Unique constraint')) {
                return res.status(409).json({ 
                    error: 'Goal with this name already exists', 
                    goal: null 
                });
            }

            return res.status(500).json({ 
                error: 'Failed to create category', 
                goal: null 
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed', goal: null });
    }
}

export default withAuth(handler);