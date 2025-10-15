import { motion } from "framer-motion";
import StackFiLogo from "./StackFiLogo";

export default function AnimatedIntro({ onEnter }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <motion.div
        initial={{ scale: 0.6, rotate: -8 }}
        animate={{ scale: [0.9, 1.05, 1], rotate: [0, -6, 0] }}
        transition={{ duration: 1.4 }}
      >
        <StackFiLogo size={120} />
      </motion.div>

      <motion.h1 className="mt-6 text-4xl font-extrabold" initial={{ y: 10 }} animate={{ y: 0 }}>
        StackFi
      </motion.h1>

      <motion.p className="mt-3 text-gray-300 max-w-xl text-center px-4">
        AI-powered DeFi tools on Stacks — a polished demo for Stacks hackathons.
      </motion.p>

      <motion.button
        onClick={onEnter}
        className="mt-10 px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-black font-semibold"
        whileHover={{ scale: 1.03 }}
      >
        Enter App
      </motion.button>
    </motion.div>
  );
}
