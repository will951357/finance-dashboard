import { ReactNode } from "react";
import { AnalyticsTransactionsProvider } from "./AnalyticalTransactionsContext";
import { TransactionsProvider } from "./TransactionsContext";
import { DateFilterProvider } from "./DataPickerContext";
import { CategoryProvider } from "./CategoryContext";

interface Props {
    children: ReactNode;
}

export function AppProviders({children}: Props) {
    return (
        <DateFilterProvider>
          < CategoryProvider>
            <AnalyticsTransactionsProvider>
              <TransactionsProvider>
               {children}
            </TransactionsProvider>
          </AnalyticsTransactionsProvider>
        </CategoryProvider>
      </DateFilterProvider> 
    );
}