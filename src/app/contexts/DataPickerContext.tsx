"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DateRange {
    startDate: Date| null;
    endDate: Date | null;
}

interface DateFilterContextType extends DateRange {
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    setDateRange: (range: DateRange) => void;
}

const DateFilterContext = createContext<DateFilterContextType | undefined>(undefined);

export const DateFilterProvider = ({children}: {children: ReactNode}) => {

    const today = new Date();
    const sixMonthsAgo = new Date();

    sixMonthsAgo.setMonth(today.getMonth() - 6)


    const [startDate, setStartDate] = useState<Date | null>(sixMonthsAgo);
    const [endDate, setEndDate] = useState<Date | null>(today);

    const setDateRange = ({ startDate, endDate}: DateRange) => {
        setStartDate(startDate);
        setEndDate(endDate);
    }

    return (
        <DateFilterContext.Provider
            value={{startDate, endDate, setStartDate, setEndDate, setDateRange}}
        >
            {children}
        </DateFilterContext.Provider>
    )
}

export const useDateFilter = (): DateFilterContextType => {
    const context = useContext(DateFilterContext)
    if (!context) {
        throw new Error("useDateFilter deve ser usado dentro de DateFilterProvider");
    }

    return context
}