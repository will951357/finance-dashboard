"use client";

import { useAnalyticsTransactions } from "@/app/contexts/AnalyticalTransactionsContext";
import { useEffect } from "react";

import {
    Card as ShadCard,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription
} from "@/components/ui/card";

import {
    ArrowDownCircle,
    ArrowUpCircle,
    DollarSign,
    } from "lucide-react";

const iconMap = {
green: <ArrowUpCircle className="w-6 h-6 text-green-600" />,
red: <ArrowDownCircle className="w-6 h-6 text-red-600" />,
blue: <DollarSign className="w-6 h-6 text-blue-600" />,
};

type CardProps ={
    title: string;
    value: number;
    color: "green" | "red" | "blue";
}

const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600",
    };

export default function BalanceCards() {
    const {analyticsTransactions, fetchAnalyticsTransactions} = useAnalyticsTransactions();

    // Por enquanto, usamos um intervalo fixo
    useEffect(() => {
        fetchAnalyticsTransactions();
    }, []);

    const totalIncome = analyticsTransactions
        .filter((t) => t.type.name === "income")
        .reduce((acc, t) => acc + t.amount, 0)

    const totalExpense = analyticsTransactions
        .filter((t) => t.type.name === 'expense')
        .reduce((acc, t) => acc + t.amount, 0)

    const total = totalIncome - totalExpense;

    return (
        <div className="grid grid-cols-1 gap-4">
            <Card title="Recebidos" value={totalIncome} color="green" />
            <Card title="Saídas" value={totalExpense} color="red" />
            <Card title="Total Geral" value={total} color="blue" />
        </div>
    );
}


export function Card({ title, value, color }: CardProps) {
    return (
        <ShadCard className="min-w-[250px] w-full h-full shadow-sm rounded-xl p-3">
            <CardHeader className="flex flex-row items-center justify-between p-2 min-h-[60px]">
                <CardTitle className="text-sm font-semibold text-muted-foreground">{title}</CardTitle>
                <CardDescription className="ml-auto">{iconMap[color]}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className={`text-2xl font-bold ${colorMap[color]}`}>
                R$ {value.toLocaleString("pt-BR")}
                </p>
            </CardContent>
        </ShadCard>
    );
}