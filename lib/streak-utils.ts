import { format, subDays } from "date-fns"
import type { Habit } from "./habits"

export function getStreakCount(habit: Habit): number {
  const today = new Date()
  let currentDate = today
  let streakCount = 0

  // Check if today's habit is completed
  const todayStr = format(today, "yyyy-MM-dd")
  const isTodayCompleted = (habit.logs[todayStr] || 0) >= habit.target

  // If today is not completed, start checking from yesterday
  if (!isTodayCompleted) {
    currentDate = subDays(today, 1)
  }

  // Count consecutive days where the habit was completed
  let keepCounting = true
  while (keepCounting) {
    const dateStr = format(currentDate, "yyyy-MM-dd")
    const value = habit.logs[dateStr] || 0

    if (value >= habit.target) {
      streakCount++
      currentDate = subDays(currentDate, 1)
    } else {
      keepCounting = false
    }
  }

  return streakCount
}
