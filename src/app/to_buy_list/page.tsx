"use client";

import { useState, FormEvent, useEffect } from "react";
import ItemToBuyWrapper from "@/components/ItemToBuyWrapper";
import Image from "next/image";
import { useItemsContext } from "../context/ItemsContext";

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
  // const [updateItems, setUpdateItems] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<string>("");
  const { items, setItems, fetchItems, user } = useItemsContext();

  // fetch items every 1 min
  useEffect(() => {
    const interval = setInterval(() => {
      fetchItems();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // update items when user inputs new item
  // useEffect(() => {
  //   fetchItems();
  // }, [updateItems]);

  // submit new item
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/items", {
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
      await fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  // pin item
  const handlePinItem = async (id: string) => {
    if (!user) return;
    setIsUpdating(id);
    const item = items?.find((i) => i._id === id);
    if (!item) return;
    let newPinnedByList = item.pinnedBy;

    if (newPinnedByList?.includes(user)) {
      newPinnedByList = newPinnedByList.filter((user) => user !== user);
    } else {
      newPinnedByList?.push(user);
    }
    // @ts-expect-error couldn't solve this stupid ts problem
    setItems((prevItems) =>
      prevItems.map((i: ItemType) =>
        i._id === id ? { ...i, pinnedBy: newPinnedByList } : i
      )
    );
    try {
      const response = await fetch("/api/items?type=pin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id, pinnedBy: newPinnedByList }),
      });
      if (!response.ok) {
        console.log("Failed to update item");
        await fetchItems();
        throw new Error("Failed to update item");
      }
      await fetchItems();
    } catch (error) {
      console.error(error);
      alert("Couldn't update the database");
    } finally {
      setIsUpdating("");
    }
  };

  //buy item
  const handleBuyItem = async (e: FormEvent, id: string, cost: number) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdating("buying");
    const item = items?.find((i) => i._id === id);
    if (!item) return;
    try {
      const response = await fetch("/api/items?type=buy", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id, boughtBy: user, cost }),
      });
      if (!response.ok) {
        console.log("Failed to update item");
        await fetchItems();
        throw new Error("Failed to update item");
      }
    } catch (error) {
      console.error(error);
      // here I need something better than alert
      alert("Couldn't update the database");
    } finally {
      setIsUpdating("");
      await fetchItems();
    }
  };

  if (user === null) {
    console.log(user);
    return (
      <div className="to_buy_list__main">
        <h2>You are not logged in</h2>
      </div>
    );
  }

  return (
    <div className="to_buy_list__main">
      <div className="to_buy_list__title">Shopping List:</div>
      <div className="current_items_div">
        <div className="current_items_div--pinned">
          {items?.map((i) => {
            if (i.pinnedBy && !i.cost && i.pinnedBy.includes(user)) {
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
                !i.pinnedBy.includes(user))
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
