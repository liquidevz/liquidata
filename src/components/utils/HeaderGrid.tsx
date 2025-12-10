import React from "react";
import { motion } from "framer-motion";

export const HeaderGrid = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="absolute inset-0 z-0"
    >
      <div className="absolute inset-0 bg-grid-blue-900/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/0 via-zinc-950/50 to-zinc-950" />
    </motion.div>
  );
};