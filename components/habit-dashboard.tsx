"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HabitCard } from "@/components/habit-card"
import { HabitSummary } from "@/components/habit-summary"
import { useToast } from "@/hooks/use-toast"
import { type Habit, defaultHabits } from "@/lib/habits"

export function HabitDashboard() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load habits from localStorage or use defaults
    const loadHabits = () => {
      try {
        const savedHabits = localStorage.getItem("habits")
        if (savedHabits) {
          setHabits(JSON.parse(savedHabits))
        } else {
          setHabits(defaultHabits)
          localStorage.setItem("habits", JSON.stringify(defaultHabits))
        }
      } catch (error) {
        console.error("Error loading habits:", error)
        toast({
          title: "Error loading habits",
          description: "Your habits couldn't be loaded. Default habits will be used.",
          variant: "destructive",
        })
        setHabits(defaultHabits)
      } finally {
        setIsLoading(false)
      }
    }

    loadHabits()
  }, [toast])

  const updateHabitLog = (habitId: string, date: string, value: number) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const updatedLogs = { ...habit.logs }
        updatedLogs[date] = value
        return { ...habit, logs: updatedLogs }
      }
      return habit
    })

    setHabits(updatedHabits)
    localStorage.setItem("habits", JSON.stringify(updatedHabits))
  }

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading habits...</div>
  }

  return (
    <div>
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <HabitSummary habits={habits} period="today" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onUpdate={updateHabitLog} view="today" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <HabitSummary habits={habits} period="week" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onUpdate={updateHabitLog} view="week" />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <HabitSummary habits={habits} period="month" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onUpdate={updateHabitLog} view="month" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
