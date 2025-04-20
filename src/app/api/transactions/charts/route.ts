import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Filtro de período (padrão: últimos 12 meses)
  const months = Number(searchParams.get('months')) || 12;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // Opção 1: Usando query raw do Prisma (mais performática)
  const monthlySummary = await prisma.$queryRaw`
    SELECT 
      EXTRACT(YEAR FROM t.date) as year,
      EXTRACT(MONTH FROM t.date) as month,
      c.name as category,
      ty.name as type,
      SUM(t.amount) as total
    FROM 
      "Transaction" t
    JOIN 
      "Category" c ON t."categoryId" = c.id
    JOIN 
      "TransactionType" ty ON t."typeId" = ty.id
    WHERE
      t.date >= ${startDate}
      AND t.date <= ${new Date()}
    GROUP BY
      EXTRACT(YEAR FROM t.date),
      EXTRACT(MONTH FROM t.date),
      c.name,
      ty.name
    ORDER BY
      year ASC,
      month ASC
  `;

  // Opção 2: Usando Prisma convencional (alternativa)
  /* const transactions = await prisma.transaction.groupBy({
    by: ['categoryId', 'typeId'],
    where: {
      date: { gte: startDate, lte: new Date() }
    },
    _sum: { amount: true },
    orderBy: { date: 'asc' }
  }); */

  return NextResponse.json(monthlySummary);
}