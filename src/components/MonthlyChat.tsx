"use client";


import { useAnalyticsTransactions } from "@/app/contexts/AnalyticalTransactionsContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { useDateFilter } from "@/app/contexts/DataPickerContext"; 
import { useEffect } from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  
export default function MonthlyChart() {
  const { analyticsTransactions, fetchAnalyticsTransactions } = useAnalyticsTransactions();
  const {startDate, endDate} = useDateFilter();
  
  // Agrupando os dados por mês
  const groupedByMonth = analyticsTransactions.reduce((acc, transaction) => {
    const month = dayjs(transaction.date).format("YYYY-MM");

    if (!acc[month]) {
      acc[month] = {income: 0, expense: 0};
    }

    if (transaction.type.name ==="income") {
      acc[month].income += transaction.amount;
    } else if (transaction.type.name === "expense"){
      acc[month].expense += transaction.amount;
    }

    return acc;
  }, {} as Record<string, {income: number; expense: number}>);

  // Garantindo ordem cronológica
  const sortedMonths = Object.keys(groupedByMonth).sort()

  const data = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Recebidos",
        data: sortedMonths.map(month => groupedByMonth[month].income),
        borderColor: "green",
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        fill: true,
      },
      {
        label: "Saídas",
        data: sortedMonths.map(month => groupedByMonth[month].expense),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fill: true,
      }
    ]
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchAnalyticsTransactions();
    }
  }, [startDate, endDate]);

  if (analyticsTransactions.length === 0) return <div>Carregando gráfico...</div>;

  return (
    <Line 
      data={data}
      options={{
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                return `${label}: R$ ${value.toFixed(2)}`;
              }
            }
          }
        }
      }}
    />
  );

}