"use client";

import { createContext, useContext, useState, ReactNode, useEffect} from "react";




interface CategoryContextType {
    selectedCategory: string | null;
    setSelectCategory: (category: string | null) => void;
  }

  const CategoryContext = createContext<CategoryContextType | undefined>(undefined);
  
  export const CategoryProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCategory, setSelectCategory] = useState<string | null>(null);
    
    useEffect(() => {
      console.log("Contexto de categoria atualizado:", selectedCategory); // DEBUG
    }, [selectedCategory]);
    
    return (
      <CategoryContext.Provider value={{ selectedCategory, setSelectCategory }}>
        {children}
      </CategoryContext.Provider>
    );
  };
  
  export const useCategory = () => {
    const context = useContext(CategoryContext);
    if (!context)
      throw new Error("useCategory deve ser usado dentro de um CategoryProvider");
    return context;
  };
  