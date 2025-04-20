"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api";
import { useCategory } from "@/app/contexts/CategoryContext";
import { Category } from "@/lib/types";

export const CategoryFilter = () => {
    const { selectedCategory, setSelectCategory} = useCategory();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect( () => {
        async function fetchcategories() {
            const data = await getCategories();
            setCategories(data)
        }

    fetchcategories();
    }, [selectedCategory]);


    return (
        <select 
            value = {selectedCategory || ""}
            onChange={(e) => {
                const value = e.target.value;
                setSelectCategory(value === "" ? null: value)
                console.log("Categoria selecionada no select:", value); // DEBUG
            
            }}
        >
            <option value=""> Todas </option>
            {
                categories.map( (c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))
            }
        </select>
    );

}