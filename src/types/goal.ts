export type GoalSchema = {
    name: string;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    updatedById: string | null;
    icon: string;
    color: string;
    targetAmount: number;
    savedAmount: number;
    startDate: Date;
    targetDate: Date | null;
}