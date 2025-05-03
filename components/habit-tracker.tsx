"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HabitCard } from "@/components/habit-card"
import { HabitSummary } from "@/components/habit-summary"
import { AddHabitForm } from "@/components/add-habit-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { type Habit, defaultHabits } from "@/lib/habits"
import { PlusCircle } from "lucide-react"

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false)
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

  const addNewHabit = (newHabit: Habit) => {
    const updatedHabits = [...habits, newHabit]
    setHabits(updatedHabits)
    localStorage.setItem("habits", JSON.stringify(updatedHabits))

    toast({
      title: "Habit created",
      description: `${newHabit.name} has been added to your habits.`,
    })

    setIsAddHabitOpen(false)
  }

  if (isLoading) {
    return <div className="flex justify-center py-12">Loading habits...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <Button onClick={() => setIsAddHabitOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </div>

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

      <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>Create a new habit to track your progress</DialogDescription>
          </DialogHeader>
          <AddHabitForm onAddHabit={addNewHabit} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
