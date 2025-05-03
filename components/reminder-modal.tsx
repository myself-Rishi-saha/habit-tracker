"use client"

import { Button } from "@/components/ui/button"
import { X, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import type { Habit } from "@/lib/habits"

interface ReminderModalProps {
  onClose: () => void
  missedHabits: Habit[]
}

export function ReminderModal({ onClose, missedHabits }: ReminderModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 50 }}
        transition={{ duration: 0.3 }}
        className="fixed left-[50%] bottom-8 z-50 w-full max-w-md translate-x-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-amber-100 p-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Missed Habits</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              You missed these habits yesterday. Don't break your streak!
            </p>
            <ul className="mt-3 space-y-2">
              {missedHabits.map((habit) => (
                <li key={habit.id} className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full bg-${habit.color}`} />
                  <span>{habit.name}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={onClose}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
