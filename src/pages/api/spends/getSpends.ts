// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../lib/db';
import { PaymentMethods, SpendSchema } from "@/types/spends";

type SpendsResponse = {
  spends: SpendSchema[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpendsResponse>,
) {
  if (req.method === 'GET') {
    try {
      const spends = await prisma.spend.findMany({
        include: { category: true },
        orderBy: { date: 'desc' },
      });

      const formattedSpends: SpendSchema[] = spends.map((spend) => ({
        ...spend,
        paymentMethod: spend.paymentMethod as PaymentMethods,
      }));

      return res.status(200).json({ spends: formattedSpends });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load expenses', spends: [] });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed', spends: [] });
  }
}
