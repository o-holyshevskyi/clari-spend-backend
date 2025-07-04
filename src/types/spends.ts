import { CategorySchema } from "./category";

export type PaymentMethods = 'card' | 'cash' | 'bank-transfer' | 'digital-wallet'

export type SpendSchema = {
    id: string;
    amount: number;
    description: string;
    categoryId: string;
    category: CategorySchema;
    paymentMethod: PaymentMethods;
    date: Date;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    updatedById: string;
};