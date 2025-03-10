"use client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent, user: string) => {
    e.preventDefault();

    if (typeof window !== "undefined") {
      localStorage.setItem("userName", user);
    }
    // for vercel nextjs server, used above instead directly
    // localStorage.setItem("userName", user);
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
