export interface Contribution {
  id: string;
  amount: number;
  description?: string;
  goalId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}