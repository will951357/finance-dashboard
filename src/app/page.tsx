"use client";

import Image from "next/image";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import BalanceCardComponent from "@/components/BalanceCards";
import MonthlyChart from "@/components/MonthlyChat";
import { DateRangePicker } from "@/components/DateRangePicker";
import { CategoryFilter } from "@/components/CategoryFilter";
import { useState } from "react";
import { AppProviders } from "./contexts/AppProvider";
import BalanceCards from "@/components/BalanceCards";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (

    <main className="w-full flex h-screen items-center sm:items-start">
        <AppProviders>
        <div className="w-full flex h-screen overflow-hidden">
         
          {/* SIDEBAR FIXO */}
          <div className={`w-[10%] min-w-[140px]  bg-gray-800 text-white p-4 ${isSidebarOpen ? "block" : "hidden"} sm:block`}>
            <h2 className="text-2xl font-bold">Menu</h2>
            <ul>
              <li className="py-2">Home</li>
              <li className="py-2">Transações</li>
              <li className="py-2">Relatórios</li>
              <li className="py-2">Configurações</li>
            </ul>
          </div>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="flex flex-col flex-1 h-full overflow-hidden bg-gray-100">
            
            {/* HEADER FIXO */}
            <div className="h-[100px] flex-shrink-0 w-full flex flex-row p-1 gap-3 bg-white shadow z-10">
              
              {/* Saudação */}
              <div className="h-full basis-1/5 flex items-center justify-start pl-2 pr-2">
                <h1 className="font-medium text-2xl">Boa Noite, William</h1>
              </div>

              {/* Espaço Vazio */}
              <div className="h-full basis-1/2"></div>

              {/* Filtro por Período */}
              <div className="h-full flex-1 flex flex-col justify-between items-center gap-2">
                <div className="h-[40%] pt-2">
                  <h3>Selecione o período de análise</h3>
                </div>
                <div className="h-[60%] justify-baseline">
                  <DateRangePicker />
                </div>
              </div>

              {/* Filtro por Categoria */}
              <div className="h-full basis-1/6 flex flex-col justify-between items-center gap-2">
                <div className="h-[50%] pt-2">
                  <h3>Selecione a categoria</h3>
                </div>
                <div className="h-[50%] justify-baseline">
                  <CategoryFilter />
                </div>
              </div>
            </div>

            {/* CONTEÚDO ROLÁVEL */}
            <div className="flex-1 overflow-y-auto p-4 space-y-10">

              {/* LINHA 2 - GRÁFICO E CARDS */}
              <div className="flex flex-row gap-4">
                {/* Gráfico */}
                <div className="flex-[3] bg-white p-4 rounded shadow">
                  <h3 className="text-lg font-semibold mb-2">Evolução mensal - Ganhos Vs Gastos</h3>
                  <MonthlyChart />
                </div>

                {/* Cards */}
                <div className="flex-[1] space-y-4">
                  <BalanceCards />
                </div>
              </div>

              {/* LINHA 3 - TABELA */}
              <h3 className="font-bold">Tabela de Transações </h3>
              <div className="flex flex-row gap-3">
                <div className="flex-[3] min-h-[300px] rounded shadow">
                  {/* Tabela aqui */}
                  <TransactionList />
                </div>
              </div>

            </div>
          </div>
        </div>
        </AppProviders>

    </main>
  );
}
