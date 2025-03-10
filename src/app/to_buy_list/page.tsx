"use client";

import { useState, FormEvent, useEffect } from "react";
import ItemToBuyWrapper from "@/components/ItemToBuyWrapper";
import Image from "next/image";

interface ItemType {
  _id: string;
  item: string;
  boughtAt: Date;
  boughtBy: string;
  cost: number;
  pinnedBy: string[];
  isUpdating: string;
}

export default function ToBuyList() {
  const [userInput, setUserInput] = useState("");
  const [items, setItems] = useState<undefined | ItemType[]>([]);
  const [updateItems, setUpdateItems] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string | null>("");

  // replace with login logic

  // fetch items on initial render
  useEffect(() => {
    fetchItems();
  }, []);

  // set the current user
  // this is for the nextjs configuration
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userName");
      setCurrentUser(storedUser);
    }
  }, []);

  // fetch items every 1 min
  // change this logic later to websockets
  useEffect(() => {
    const interval = setInterval(() => {
      fetchItems();
    }, 1000);
    return () => clearInterval(interval);
  });

  // update items when user inputs new item
  useEffect(() => {
    fetchItems();
  }, [updateItems]);

  // fetch/update current items to buy
  const fetchItems = async () => {
    try {
      const response = await fetch("/to_buy_list/api", { cache: "no-cache" });
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

  // submit new item
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/to_buy_list/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: userInput }),
      });
      if (!response.ok) {
        console.log("Failed to save new item");
        throw new Error("Failed to save new item");
      }
      setUserInput("");
      setUpdateItems(!updateItems);
    } catch (error) {
      console.error(error);
    }
  };

  // pin item
  const handlePinItem = async (id: string) => {
    if (!currentUser) return;
    setIsUpdating(id);
    const item = items?.find((i) => i._id === id);
    if (!item) return;
    let newPinnedByList = item.pinnedBy;

    if (newPinnedByList?.includes(currentUser)) {
      newPinnedByList = newPinnedByList.filter((user) => user !== currentUser);
    } else {
      newPinnedByList?.push(currentUser);
    }
    setItems((prevItems) =>
      prevItems?.map((i) =>
        i._id === id ? { ...i, pinnedBy: newPinnedByList } : i
      )
    );
    try {
      const response = await fetch("/to_buy_list/api?type=pin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id, pinnedBy: newPinnedByList }),
      });
      if (!response.ok) {
        console.log("Failed to update item");
        setUpdateItems(!updateItems);
        throw new Error("Failed to update item");
      }
      setUpdateItems(!updateItems);
    } catch (error) {
      console.error(error);
      alert("Couldn't update the database");
    } finally {
      setIsUpdating("");
    }
  };

  //buy item
  const handleBuyItem = async (e: FormEvent, id: string, cost: number) => {
    if (!currentUser) return;
    setIsUpdating("buying");
    const item = items?.find((i) => i._id === id);
    if (!item) return;
    try {
      const response = await fetch("/to_buy_list/api?type=buy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id, boughtBy: currentUser, cost }),
      });
      if (!response.ok) {
        console.log("Failed to update item");
        setUpdateItems(!updateItems);
        throw new Error("Failed to update item");
      }
      // here timer to update
      // and animation to update
      setUpdateItems(!updateItems);
    } catch (error) {
      console.error(error);
      // here I need something better than alert
      alert("Couldn't update the database");
    } finally {
      setIsUpdating("");
    }
  };

  if (currentUser === null) {
    return (
      <div className="to_buy_list__main">
        <h2>You are not logged in</h2>
      </div>
    );
  }

  return (
    <div className="to_buy_list__main">
      <div className="current_items_div">
        <div className="current_items_div--pinned">
          {items?.map((i) => {
            if (i.pinnedBy && !i.cost && i.pinnedBy.includes(currentUser)) {
              return (
                <ItemToBuyWrapper
                  key={i.item}
                  item={i}
                  handlePinItem={handlePinItem}
                  isPinned={true}
                  pinnedByList={i.pinnedBy}
                  isUpdating={isUpdating}
                  handleBuyItem={handleBuyItem}
                />
              );
            }
          })}
        </div>
        <div className="current_items_div--unpinned">
          {items?.map((i) => {
            if (
              !i.cost &&
              (!i.pinnedBy ||
                i.pinnedBy.length === 0 ||
                !i.pinnedBy.includes(currentUser))
            ) {
              return (
                <ItemToBuyWrapper
                  key={i.item}
                  item={i}
                  handlePinItem={handlePinItem}
                  isPinned={false}
                  pinnedByList={i.pinnedBy}
                  isUpdating={isUpdating}
                  handleBuyItem={handleBuyItem}
                />
              );
            }
          })}
        </div>
      </div>

      <div className="add_new_item_div">
        <form
          className="new_item_to_buy_form"
          onSubmit={(e) => handleSubmit(e)}
        >
          <Image
            width={30}
            height={30}
            alt="add button plus icon"
            src="/add_circle.png"
          />
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            type="text"
            name="userInput"
            placeholder="What do we need?"
          />
          <button disabled={userInput.length === 0} type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
