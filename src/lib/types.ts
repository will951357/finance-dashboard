export type TransactionInput = {
    title: string;
    amount: number;
    typeId: number;
    categoryId: number;
    date?: string;
}

export type TransactionWithRelations = {
    id: number;
    title: string;
    amount: number;
    date: string;
    type: {
      id: number;
      name: string;
    };
    category: {
      id: number;
      name: string;
    };
  };

export type PaginatedTransactions = {
  data: TransactionWithRelations[];
  pagination: {
    total: number;
    hasMore: boolean;
  };
};

export type getTransactionsParams ={
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  categoryId?: string | null;
}

export type Category = {
    id: number;
    name: string;
}

export type TransactionType = {
    id: number;
    name: string
}

export type SortingConfig = {
  field: string;
  direction: 'asc' | 'desc'
}

export type BalanceCard = {
  total: number;
  income: number;
  expense: number;
}

export type PeriodFilterProps = {
  selectedMonths: number;
  onMonthsChange: (months: number) => void;
};


export type MonthlySummerize = {
  year: string;
  month: string;       // Ex: "Jan/2023"
  category: string;
  type: string;
  total: number;     // income - expense
};

export type ChartDataset = {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
};

export type ChartData = {
  labels: string[]; // ["Abr/2025", "Mai/2025", ...]
  incomeData: ChartDataset;
  expenseData: ChartDataset;
};