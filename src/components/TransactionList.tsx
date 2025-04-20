"use client"

import { useState, useEffect } from "react";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { SortingConfig } from "@/lib/types";
import TransactionSkeleton from "./TransactionSkeleton";
import { useDateFilter } from "@/app/contexts/DataPickerContext";
import { useCategory } from "@/app/contexts/CategoryContext";

// Explicando a logica da ordenação dos campos
// Ao carregar a pagina, já definimos um estado inicial para o campo e direção
// ao clicar no campo é feita a verificação:
// O campo clicado é o mesmo do estado atual?
// Se sim, apenas altera a ordem
// Se não, começa com asc
export default function TransactionList() {
    
    const {
        transactions,
        currentPage,
        hasMore,
        fetchTransactions,
        setCurrentPage,
        sortConfig,
        setSortConfig
      } = useTransactions();
    
    const {startDate, endDate} = useDateFilter();
    const {selectedCategory, setSelectCategory} = useCategory();
    const [isLoading, setLoading] = useState(false);


    const handleSort = (field: string) => {
        const newSort: SortingConfig = {
            field,
            direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        };
    
        setSortConfig(newSort); // Agora o useEffect cuida do resto
    };

    const goToPage = async (page: number) => {
        setLoading(true);
        await fetchTransactions(page);
        setCurrentPage(page);
        setLoading(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchTransactions(1);
            setCurrentPage(1);
            setLoading(false);
        };
    
        fetchData();
    }, [sortConfig, startDate, endDate, selectedCategory]);

    if (isLoading && transactions.length === 0) {
        return <TransactionSkeleton />;
    }

    return (
        <div className="w-[100%]">
            {/* Lista de Transações */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th 
                                onClick={() => handleSort('date')}
                                className="cursor-pointer hover:bg-gray-100 p-3 text-left"
                            >
                                Data {sortConfig.field === 'date' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th 
                                onClick={() => handleSort('title')}
                                className="cursor-pointer hover:bg-gray-100 p-3 text-left"
                            >
                                Descrição {sortConfig.field === 'title' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th className="p-3 text-left">Categoria</th>
                            <th 
                                onClick={() => handleSort('amount')}
                                className="cursor-pointer hover:bg-gray-100 p-3 text-right"
                            >
                                Valor {sortConfig.field === 'amount' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td className="p-3">
                                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                                </td>
                                <td className="p-3">{transaction.title}</td>
                                <td className="p-3">{transaction.category.name}</td>
                                <td className={`p-3 text-right ${
                                    transaction.type.name === 'income' 
                                        ? 'text-green-600' 
                                        : 'text-red-600'
                                }`}>
                                    {transaction.type.name === 'income' ? '+' : '-'}
                                    {transaction.amount.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Controles de paginação */}
            <div className="flex gap-4 mt-4">
                <button
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Anterior
                </button>
                <span> Página {currentPage} </span>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={!hasMore}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Próxima
                </button>
            </div>
        </div>
    )
}
