"use client";
import { createContext, useState, useContext, ReactNode } from "react";

interface ItemType {
  _id: string;
  item: string;
  boughtAt: Date;
  boughtBy: string;
  cost: number;
  pinnedBy: string[];
  isUpdating: string;
}

interface ItemsContextType {
  user: string | null;
  setUser: (user: string | null) => void;
  items: ItemType[];
  setItems: (items: ItemType[]) => void;
  fetchItems: () => Promise<void>;
}

const ItemsContext = createContext<ItemsContextType | null>(null);

export const ItemsContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [items, setItems] = useState<ItemType[]>([]);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items", { cache: "no-cache" });
      if (!response.ok) {
        console.log("Failed to fetch items");
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ItemsContext.Provider
      value={{ user, setUser, items: items ?? [], setItems, fetchItems }}
    >
      {children}
    </ItemsContext.Provider>
  );
};

export const useItemsContext = () => {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error(
      "useItemsContext must be used within an ItemsContextProvider"
    );
  }
  return context;
};
