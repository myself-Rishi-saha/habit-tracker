"use client"

import { format, startOfWeek, startOfMonth, eachDayOfInterval } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Habit } from "@/lib/habits"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface HabitSummaryProps {
  habits: Habit[]
  period: "today" | "week" | "month"
}

export function HabitSummary({ habits, period }: HabitSummaryProps) {
  const today = new Date()

  const getDaysForPeriod = () => {
    switch (period) {
      case "today":
        return [today]
      case "week":
        return eachDayOfInterval({
          start: startOfWeek(today),
          end: today,
        })
      case "month":
        return eachDayOfInterval({
          start: startOfMonth(today),
          end: today,
        })
    }
  }

  const days = getDaysForPeriod()

  const calculateCompletionRate = () => {
    let totalCompleted = 0
    let totalPossible = 0

    days.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      habits.forEach((habit) => {
        totalPossible++
        if ((habit.logs[dateStr] || 0) >= habit.target) {
          totalCompleted++
        }
      })
    })

    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
  }

  const completionRate = calculateCompletionRate()

  const periodTitle = () => {
    switch (period) {
      case "today":
        return "Today's Progress"
      case "week":
        return "This Week's Progress"
      case "month":
        return "This Month's Progress"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>{periodTitle()}</CardTitle>
          <CardDescription>
            {period === "today"
              ? format(today, "EEEE, MMMM d, yyyy")
              : `${format(days[0], "MMM d")} - ${format(days[days.length - 1], "MMM d, yyyy")}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Completion Rate</span>
              <span className="text-sm font-medium">{completionRate}%</span>
            </div>
            <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.2, duration: 0.8 }}>
              <Progress value={completionRate} className="h-2" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
