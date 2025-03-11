"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useItemsContext } from "../context/ItemsContext";

export default function LoginPage() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();
  const { setItems, setUser } = useItemsContext();

  // initial fetching of items
  useEffect(() => {
    fetchItems();
  }, []);

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

  const handleClick = (e: React.MouseEvent, user: string) => {
    e.preventDefault();

    // special treatment for nextjs
    // window.localStorage.setItem("userName", user);
    setUser(user);
    setIsExiting(true);
    setTimeout(() => {
      router.push("/to_buy_list");
    }, 500);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="login_page_main_div"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            onClick={(e) => handleClick(e, "Diana")}
            className="login_option_btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Diané
          </motion.div>

          <motion.div
            onClick={(e) => handleClick(e, "Erik")}
            className="login_option_btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Erik
          </motion.div>

          <motion.div
            onClick={(e) => handleClick(e, "Kürsat")}
            className="login_option_btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Kürsat
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
