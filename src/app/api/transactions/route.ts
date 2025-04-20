import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

// Tipos para os query params
interface Params {
    skip?: string;
    take?: string;
  }

// BUSCAR TODAS AS TRNASAÇÕES - Paginada

// Explicando a paginação
// A paginação usa dois paramêtros principais:
// skip: Quantos registros pular (offset)
// take: Quantos registros retornar (limit)
// exemplo  /api/transactions?skip=10&take=5
// pula 10 linnhas e pega 5 registros
// Calculo do hasMore
// se skip é 10 e take é 5 e total é 20 então hasMore é true

// Fluxo Completo da Paginação
// Frontend:
// Solicita a página 1: skip=0, take=10
// Solicita a página 2: skip=10, take=10
// E assim por diante...
// Backend:
// Recebe skip e take
// Executa a query no banco com esses valores
// Retorna os registros + metadados (total, hasMore)
// Frontend:
// Usa hasMore para habilitar/desabilitar o botão "Próxima"

// Explicando o Promise.All
// Executa as duas queries em paralelo (otimização e performance)
// Evita terminar a lista carregar para só depois contar o total
export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);

    // Parâmetros de paginação
    const skip = Number(searchParams.get('skip')) || 0;
    const take =  Math.min(Number(searchParams.get('take')) || 10, 50);

    // Parâmetros de ordenação
    const orderBy = searchParams.get('orderBy') || 'date';
    const orderDir = searchParams.get('orderDir') || 'desc';

    // Valida campos permitidos para ordenação
    const validOrderFields = ['date', 'amount', 'title'];
    const sortField = validOrderFields.includes(orderBy) ? orderBy : 'date';

    // Paremotros de data
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

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

    const [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          skip,
          take,
          include: { type: true, category: true },
          where: {
            ...dateFilter,   // Filtro de data se houver
            ...categoryFilter,
          },
          orderBy: { 
            [sortField]: orderDir // Ordenação dinâmica
          }
        }),
        prisma.transaction.count({
            where: {
              ...dateFilter,
              ...categoryFilter, 
            }
        })
    ]);

    return NextResponse.json({
        data: transactions,
        pagination: {
            total,
            hasMore: skip + take < total
        }
    });
}

// ADICIONAR TRANSAÇÃO
export async function POST(request:NextRequest) {
    const {title, amount, typeId, categoryId, date } = await request.json();

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
          categoryId: Number(categoryId),
          date: date ? new Date(date) : new Date()
        }
    });

    return NextResponse.json(transaction);
}