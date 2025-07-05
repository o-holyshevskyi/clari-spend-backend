// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '../../../lib/db';
import { PaymentMethods, SpendSchema } from "@/types/spends";
import { AuthenticatedUser, withAuth } from "@/lib/auth-utils";

type SpendsResponse = {
  spends: SpendSchema[];
  totalCount: number;
  error?: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SpendsResponse>,
  user: AuthenticatedUser
) {
  if (req.method === 'GET') {
    try {
      const spends = await prisma.spend.findMany({
        where: {
          createdById: user.id,
        },
        include: { category: true },
        orderBy: { date: 'desc' },
      });

      const formattedSpends: SpendSchema[] = spends.map((spend) => ({
        ...spend,
        paymentMethod: spend.paymentMethod as PaymentMethods,
      }));

      return res.status(200).json({ spends: formattedSpends, totalCount: formattedSpends.length });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load expenses', spends: [], totalCount: 0 });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed', spends: [], totalCount: 0 });
  }
}

export default withAuth(handler);
