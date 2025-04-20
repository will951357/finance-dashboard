import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Adicionando o filtro de data
    const dateFilter = startDate && endDate
    ? {
        date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
        }
        }
    : {};

    // Adicionando o filtro de categoria
    const categoryFilter = searchParams.get('categoryId') ? { categoryId: Number(searchParams.get('categoryId')) } : {};

    const transactions  = await prisma.transaction.findMany({
        where: {
            ...dateFilter, 
            ...categoryFilter,
          },
        include: {type: true, category: true},
        orderBy: {date: "desc"},
    });

    return NextResponse.json({ data: transactions });
}

