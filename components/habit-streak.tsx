"use client"

import { FlameIcon } from "lucide-react"
import { motion } from "framer-motion"

interface HabitStreakProps {
  streak: number
}

export function HabitStreak({ streak }: HabitStreakProps) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 3,
        }}
      >
        <FlameIcon className="h-4 w-4 text-orange-500" />
      </motion.div>
      <span className="text-sm font-medium">
        {streak} day{streak !== 1 ? "s" : ""} streak
      </span>
    </div>
  )
}
