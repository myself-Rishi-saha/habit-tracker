"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Dashboard } from "@/components/dashboard"
import { SettingsModal } from "@/components/settings-modal"
import { ReminderModal } from "@/components/reminder-modal"
import { AddHabitModal } from "@/components/add-habit-modal"
import { useToast } from "@/hooks/use-toast"
import { type Habit, defaultHabits } from "@/lib/habits"
import { AnimatePresence } from "framer-motion"

export function HabitTrackerApp() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false)
  const [isReminderOpen, setIsReminderOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null)
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
    checkMissedHabits()
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

  const deleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId)
    setHabits(updatedHabits)
    localStorage.setItem("habits", JSON.stringify(updatedHabits))

    toast({
      title: "Habit deleted",
      description: "The habit has been removed from your tracker.",
    })
  }

  const editHabit = (updatedHabit: Habit) => {
    const updatedHabits = habits.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit))
    setHabits(updatedHabits)
    localStorage.setItem("habits", JSON.stringify(updatedHabits))

    toast({
      title: "Habit updated",
      description: `${updatedHabit.name} has been updated.`,
    })

    setSelectedHabit(null)
    setIsAddHabitOpen(false)
  }

  const checkMissedHabits = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdayStr = yesterday.toISOString().split("T")[0]

    const missedHabits = habits.filter((habit) => {
      return !habit.logs[yesterdayStr] || habit.logs[yesterdayStr] < habit.target
    })

    if (missedHabits.length > 0) {
      setIsReminderOpen(true)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading habits...</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAddHabitClick={() => {
          setSelectedHabit(null)
          setIsAddHabitOpen(true)
        }}
      />

      <main className="flex-grow">
        <Dashboard
          habits={habits}
          onUpdateHabit={updateHabitLog}
          onDeleteHabit={deleteHabit}
          onEditHabit={(habit) => {
            setSelectedHabit(habit)
            setIsAddHabitOpen(true)
          }}
        />
      </main>

      <Footer />

      <AnimatePresence>{isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}</AnimatePresence>

      <AnimatePresence>
        {isAddHabitOpen && (
          <AddHabitModal
            onClose={() => {
              setIsAddHabitOpen(false)
              setSelectedHabit(null)
            }}
            onAddHabit={addNewHabit}
            onEditHabit={editHabit}
            habit={selectedHabit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReminderOpen && (
          <ReminderModal
            onClose={() => setIsReminderOpen(false)}
            missedHabits={habits.filter((habit) => {
              const yesterday = new Date()
              yesterday.setDate(yesterday.getDate() - 1)
              const yesterdayStr = yesterday.toISOString().split("T")[0]
              return !habit.logs[yesterdayStr] || habit.logs[yesterdayStr] < habit.target
            })}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
