"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExiting(true);

    setTimeout(() => {
      router.push("/login_page");
    }, 500);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="main_container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleClick}
        >
          <div className="logo_container">
            WG
            <span>App</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
