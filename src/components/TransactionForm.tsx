'use client'; // Indica que é um componente do lado do cliente (usa hooks como useState)

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTransaction, getCategories, getTransactionTypes } from "@/lib/api";
import { Category, TransactionType } from "@/lib/types";

export default function TransactionForm() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [typeId, setTypeId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const router = useRouter(); // Hook para att a pagina após submeter

    const [categories, setCategories] = useState<Category[]>([]);
    const [transactionTypes, settransactionTypes] = useState<TransactionType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Busca as categorias e tipos ao carregar o componete
    useEffect(() => {
        async function loadData() {
          try {
            const [categoriesData, typesData] = await Promise.all([
              getCategories(),
              getTransactionTypes()
            ]);
            setCategories(categoriesData);
            settransactionTypes(typesData);
          } catch (error) {
            console.error('Erro ao cargar dados:', error);
          } finally {
            setIsLoading(false);
          }
        }
        loadData();
    }, []);
    

    // Função chamada quando o Form é enviado
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault() // Evita que a pagina recarregue

        // envia os dados via api
        try {
            await createTransaction(
                {
                    title,
                    amount: parseFloat(amount),
                    typeId: Number(typeId),
                    categoryId: Number(categoryId),
                    date
                }
            );

            // Limpa o formulário e atualiza a página
            setTitle('');
            setAmount('');
            setTypeId('');
            setCategoryId('');
            router.refresh();
        } catch {
            alert('Erro ao salvar transação!');
        }
    }

    if (isLoading) {
        return <div>Carregando...</div>;
      }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">

            <h2 className="text-xl font-bold">Adicionar Nova Transação</h2>

            {/* Campo Título */}
            <div>
                <label className="block text-sm font-medium">Título</label>
                <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            {/* Campo: Valor */}
            <div>
                <label className="block text-sm font-medium">Valor (R$)</label>
                <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded"
                step="0.01"
                required
                />
            </div>

            {/* Campo: Tipo (entrada/saída) */}
            <div>
                <label className="block text-sm font-medium">Tipo</label>
                <select
                    value={typeId}
                    onChange={(e) => setTypeId(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                >
                <option value="">Selecione...</option>
                {
                    transactionTypes.map(
                        (type) =>(
                            <option key={type.id} value={type.id}>{type.name}</option>
                        )
                    )
                }
                </select>
            </div>

            {/* Campo: Categoria */}
            <div>
                <label className="block text-sm font-medium">Categoria</label>
                <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-2 border rounded"
                required
                >
                <option value="">Selecione...</option>
                {
                    categories.map(
                        (cat) =>(
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        )
                    )
                }
                </select>
            </div>

            {/* Campo: Data da Transação */}
            <div>
                <label className="block text-sm font-medium">Data</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            {/* Botão de enviar */}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Salvar
            </button>
        </form>
    )
}