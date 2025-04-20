"use client";
import { createContext, useContext, useState, useEffect, ReactNode, Children } from "react";
import { getTransactionGlobals } from "@/lib/api";
import { TransactionWithRelations } from "@/lib/types";
import { useDateFilter } from "./DataPickerContext";
import { useCategory } from "./CategoryContext";

// Por que cirar uma context?
// Ele funciona como uma “caixa mágica” onde você guarda valores (como estados ou funções), 
// e qualquer componente filho pode abrir essa caixa e pegar o que precisar, sem depender de props.

// Nesse context precisamos guardar uma lista de transações não paginadas
// Uma funcção que busca essas transações filtradas por data
// Um estado de carregamento

// A interface vai definir o que o contexto vai oferecer para os seus filhos

interface AnalyticsTransactionsContextType {
    analyticsTransactions: TransactionWithRelations[];
    setAnalyticsTransactions: React.Dispatch<React.SetStateAction<TransactionWithRelations[]>>;
    fetchAnalyticsTransactions: () => Promise<void>;
    isLoading: boolean;
}

// Criamos um “contexto vazio” que só será preenchido quando usarmos o Provider.
const AnalyticsTransactionsContext = createContext<AnalyticsTransactionsContextType | undefined>(undefined);


// Criar o Provider (quem fornece os dados)
// Essa função é o "provedor". É quem vai guardar o estado e deixar os dados disponíveis para o app inteiro.
// Guardamos as transações e o status de carregamento aqui. Esses estados serão compartilhados com todos os 
// componentes que usarem o contexto.
export const AnalyticsTransactionsProvider = ({children}: {children: ReactNode}) => {
    const [analyticsTransactions, setAnalyticsTransactions] = useState<TransactionWithRelations[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {startDate, endDate} = useDateFilter();
    const {selectedCategory, setSelectCategory} = useCategory();

    const fetchAnalyticsTransactions = async () => {
        if (!startDate || !endDate) return;
        
        try {
            setIsLoading(true);
            const response = await getTransactionGlobals({
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString(),
                categoryId: selectedCategory,
            });
            setAnalyticsTransactions(response.data);
        } catch (error) {
            console.error("Erro ao buscar data", error);
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        console.log("📊 Buscando analytics com categoria:", selectedCategory);
        fetchAnalyticsTransactions();
      }, [startDate, endDate, selectedCategory]);

    return (
        <AnalyticsTransactionsContext.Provider
            value={{
                analyticsTransactions,
                setAnalyticsTransactions,
                fetchAnalyticsTransactions,
                isLoading
            }}
        >
        {children}
        </AnalyticsTransactionsContext.Provider>
    )
}

// Criar o hook para acessar o contexto com segurança
// Criamos esse hook para facilitar o acesso ao contexto. 
// Você pode chamar useAnalyticsTransactions() em qualquer componente para usar os dados.
export const useAnalyticsTransactions = (): AnalyticsTransactionsContextType => {
    const context = useContext(AnalyticsTransactionsContext);
    if (!context) {
      throw new Error("useAnalyticsTransactions deve ser usado dentro de um AnalyticsTransactionsProvider");
    }
    return context;
  };