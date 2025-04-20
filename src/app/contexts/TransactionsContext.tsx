"use client";
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { getTransactions } from "@/lib/api";
import { SortingConfig, TransactionWithRelations } from "@/lib/types";
import { useDateFilter } from "./DataPickerContext";
import { useCategory } from "./CategoryContext";

interface TransactionsContextType {
    transactions: TransactionWithRelations[];
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    sortConfig: SortingConfig;
    setSortConfig: React.Dispatch<React.SetStateAction<SortingConfig>>;
    setTransactions: React.Dispatch<React.SetStateAction<TransactionWithRelations[]>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    fetchTransactions: (page: number,  filters?: any) => void;
    setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  }

interface PaginatedResponse {
    data: TransactionWithRelations[];
    pagination: {
      total: number;
      hasMore: boolean;
    };
}

const TransactionContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({children}: {children: ReactNode}) {
    const [transactions, setTransactions] = useState<TransactionWithRelations[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [sortConfig, setSortConfig] = useState<SortingConfig>({
        field: 'date',
        direction: 'desc',
    })
    const { startDate, endDate } = useDateFilter();
    const { selectedCategory, setSelectCategory } = useCategory();
    
    const fetchTransactions =  async (page: number, filters?: any) => {
        try {
            const data: PaginatedResponse = await getTransactions({
                page,
                pageSize: 10, // Quantidade de itens por página
                orderBy: sortConfig.field,
                orderDir: sortConfig.direction,
                startDate: startDate ? startDate.toISOString() : undefined,
                endDate: endDate ? endDate.toISOString() : undefined,
                categoryId: selectedCategory,
                ...filters, // Inclui filtros como orderBy, orderDir, startDate, endDate

            });

            setTransactions(data.data);
            setTotalPages(data.pagination.total);
            setHasMore(data.pagination.hasMore);

        } catch (error) {
            console.error("Erro ao buscar transações:", error);
        }
    };

    useEffect( () => {
        fetchTransactions(currentPage); 
    },  [currentPage])

    // Resetar a página para 1 quando filtros mudarem
    useEffect(() => {
        console.log("🚀 Filtros mudaram. Resetando página.");
        setCurrentPage(1);
    }, [selectedCategory, startDate, endDate]);

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                currentPage,
                totalPages,
                hasMore,
                sortConfig,
                setSortConfig,
                setTransactions,
                setCurrentPage,
                fetchTransactions,
                setHasMore
            }}
        >
        {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = (): TransactionsContextType => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error("UseTransactions tem que ser usado dentro do TransactionProvider")
    }

    return context;
}