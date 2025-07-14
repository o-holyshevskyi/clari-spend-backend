import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { GoalSchema } from "@/types/goal"
import { NextApiRequest, NextApiResponse } from "next";

type GoalResponse = {
    goals: GoalSchema[];
    totalCount: number;
    error?: string;
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GoalResponse>,
    user: AuthenticatedUser) {
    if (req.method === 'GET') {
        try {
            const goals = await prisma.goal.findMany({
                where: {
                    createdById: user.id
                },
                orderBy: [
                    { createdAt: 'desc' }
                ],
            });

            return res.status(200).json({
                goals,
                totalCount: goals.length,
            })
        } catch (error) {
            return res.status(500).json({ 
                error: 'Failed to load goals', 
                goals: [],
                totalCount: 0
            });
        }
    } else {
        return res.status(405).json({ 
            error: 'Method not allowed', 
            goals: [],
            totalCount: 0 
        });
    }
}

export default withAuth(handler);