"use client"

import { useState } from "react"
import { format, subDays, startOfWeek, startOfMonth, eachDayOfInterval } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { HabitGraph } from "@/components/habit-graph"
import { HabitStreak } from "@/components/habit-streak"
import type { Habit } from "@/lib/habits"
import { getStreakCount } from "@/lib/streak-utils"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, Edit, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface HabitCardProps {
  habit: Habit
  onUpdate: (habitId: string, date: string, value: number) => void
  onDelete: (habitId: string) => void
  onEdit: (habit: Habit) => void
  view: "today" | "week" | "month"
}

export function HabitCard({ habit, onUpdate, onDelete, onEdit, view }: HabitCardProps) {
  const today = new Date()
  const todayStr = format(today, "yyyy-MM-dd")
  const [value, setValue] = useState<number>(habit.logs[todayStr] || 0)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const getDaysForView = () => {
    switch (view) {
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

  const days = getDaysForView()
  const streak = getStreakCount(habit)

  const handleSliderChange = (newValue: number[]) => {
    const updatedValue = newValue[0]
    setValue(updatedValue)
    onUpdate(habit.id, todayStr, updatedValue)
  }

  const getTrendIcon = () => {
    if (days.length <= 1) return null

    const yesterday = format(subDays(today, 1), "yyyy-MM-dd")
    const todayValue = habit.logs[todayStr] || 0
    const yesterdayValue = habit.logs[yesterday] || 0

    if (todayValue > yesterdayValue) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />
    } else if (todayValue < yesterdayValue) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />
    } else {
      return <MinusIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getProgressPercentage = () => {
    return Math.round((value / habit.target) * 100)
  }

  return (
    <>
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
        <Card className="overflow-hidden">
          <CardHeader className={`bg-${habit.color}-50 dark:bg-${habit.color}-900/20`}>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  {habit.name}
                  {getTrendIcon()}
                </CardTitle>
                <CardDescription>{habit.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getProgressPercentage() >= 100 ? "default" : "outline"}>
                  {getProgressPercentage()}%
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <span className="sr-only">Open menu</span>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(habit)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowDeleteAlert(true)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {view !== "today" ? (
              <HabitGraph habit={habit} days={days} />
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">0</span>
                  <span className="text-sm font-medium">
                    {value} / {habit.target} {habit.unit}
                  </span>
                  <span className="text-sm text-muted-foreground">{habit.target}+</span>
                </div>
                <Slider value={[value]} max={habit.target * 1.5} step={habit.step} onValueChange={handleSliderChange} />
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/50 px-6 py-3">
            <HabitStreak streak={streak} />
          </CardFooter>
        </Card>
      </motion.div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the habit "{habit.name}" and all of its tracking data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(habit.id)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
