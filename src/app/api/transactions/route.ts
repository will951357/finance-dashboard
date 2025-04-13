import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";


// BUSCAR TODAS AS TRNASAÇÕES
export async function GET() {
    const transactions = await prisma.transaction.findMany();
    return NextResponse.json(transactions);
}

// ADICIONAR TRANSAÇÃO
export async function POST(request:NextRequest) {
    const {title, amount, typeId, categoryId } = await request.json();

    if (!title || !amount || !typeId || !categoryId) {
        return NextResponse.json(
            { error: "Campos obrigatórios faltando!" },
            { status: 400 }
        )
    }

    const transaction = await prisma.transaction.create({
        data: {
          title,
          amount,
          typeId: Number(typeId),
          categoryId: Number(categoryId)
        }
    });

    return NextResponse.json(transaction);
}