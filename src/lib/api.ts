
import { TransactionInput, Category, TransactionType,
    PaginatedTransactions, getTransactionsParams,
    MonthlySummerize, ChartData  } from "./types";

export async function createTransaction(trnsaction:TransactionInput) {
    const res = await fetch('/api/transactions',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trnsaction),
        }
    );

    if (!res.ok) {
        throw new Error("Falha ao criar transação")
    }

    return res.json()
    
}

// Função para listar transações 
export async function getTransactions(
    params: getTransactionsParams = {}
): Promise<PaginatedTransactions> {

    const { page = 1, pageSize = 10, orderBy, orderDir, startDate, endDate, categoryId } = params;
    const skip = (page - 1) * pageSize

    const query = new URLSearchParams(
        {
            skip: String(skip),
            take: String(pageSize),
            ...(orderBy && { orderBy }),
            ...(orderDir && { orderDir }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
            ...(categoryId && { categoryId }),
        }
    );

    console.log(`A query que chega em getTransactions é: ${query.toString()}`)

    const res = await fetch(`/api/transactions?${query.toString()}`);
    if (!res.ok) throw new Error("Falha ao buscar transações")
    return res.json();
}

export async function getTransactionGlobals(params: {startDate: string, endDate: string, categoryId:string|null}) {

    const  {startDate, endDate, categoryId} = params;
    const query = new URLSearchParams(
        {
            startDate,
            endDate,
            ...(categoryId && {categoryId} )
        }
    );

    const res = await fetch(`/api/transactions/globals?${query.toString()}`);

    if (!res.ok) throw new Error("Erro ao buscar transações analíticas");
    return res.json();
}

// Buscar todas as categorias
export async function getCategories(): Promise<Category[]> {
    const res = await fetch("api/categories")
    if (!res.ok) throw new Error("Falha ao buscar categoria")
    return res.json()
}

// Busca todos os tipos de transação
export async function getTransactionTypes(): Promise<TransactionType[]> {
    const res = await fetch("api/transactionTypes")
    if (!res.ok) throw new Error("Falha ao buscar tipos de transações")
    return res.json()
}


// Busca a informação do grafico mensal
export async function getTransactionChart(
    params: { months?: number } = {}
): Promise<ChartData>  {
    const query = new URLSearchParams();
    query.append('months', params.months?.toString() || '12');

    const res = await fetch(`/api/transactions/charts?${query.toString()}`)

    if (!res.ok) throw new Error("Erro ao buscar dados do gráfico")

    const rawData: MonthlySummerize[] = await res.json();

    // 1. Agrupa meses únicos (labels)
    const monthsSet = new Set(
        rawData.map(item => {
          const month = item.month.padStart(2, '0');
          return `${month}/${item.year}`;
        })
      );
    const labels = Array.from(monthsSet).sort();

    // 2. Processa para o formato do Chart.js
    const incomeData: number[] = labels.map(label => {
        const [month, year] = label.split('/');
        return rawData
          .filter(item => 
            item.month === month || // Compara com padding
            item.month === month.replace(/^0/, '') // Compara sem padding
            && item.year === year 
            && item.type === 'income'
          )
          .reduce((sum, item) => sum + item.total, 0);
    });

    const expenseData: number[] = labels.map(label => {
        const [month, year] = label.split('/');
        return rawData
          .filter(item => 
            (item.month === month || item.month === month.replace(/^0/, ''))
            && item.year === year 
            && item.type === 'expense'
          )
          .reduce((sum, item) => sum + item.total, 0);
    });

    console.log('Labels...', labels)
    console.log('Raw...', rawData)
    console.log('Income...',incomeData)
    console.log('Expand...', expenseData)
    
    return {
        labels,
        incomeData: {
          label: 'Receitas',
          data: incomeData,
          borderColor: '#10B981', // Verde
          backgroundColor: '#A7F3D0',
        },
        expenseData: {
          label: 'Despesas',
          data: expenseData,
          borderColor: '#EF4444', // Vermelho
          backgroundColor: '#FECACA',
        }
    };
}
    