"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HabitCard } from "@/components/habit-card"
import { HabitSummary } from "@/components/habit-summary"
import { WeeklyOverview } from "@/components/weekly-overview"
import { WelcomeHero } from "@/components/welcome-hero"
import type { Habit } from "@/lib/habits"
import { motion } from "framer-motion"

interface DashboardProps {
  habits: Habit[]
  onUpdateHabit: (habitId: string, date: string, value: number) => void
  onDeleteHabit: (habitId: string) => void
  onEditHabit: (habit: Habit) => void
}

export function Dashboard({ habits, onUpdateHabit, onDeleteHabit, onEditHabit }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("today")

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="container py-8">
      <WelcomeHero />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <WeeklyOverview habits={habits} />
      </motion.div>

      <Tabs defaultValue="today" className="w-full" onValueChange={setActiveTab}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="today" className="space-y-4">
          <HabitSummary habits={habits} period="today" />
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {habits.map((habit) => (
              <motion.div key={habit.id} variants={item}>
                <HabitCard
                  habit={habit}
                  onUpdate={onUpdateHabit}
                  view="today"
                  onDelete={onDeleteHabit}
                  onEdit={onEditHabit}
                />
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <HabitSummary habits={habits} period="week" />
          <motion.div
            variants={container}
            initial="hidden"
            animate={activeTab === "week" ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {habits.map((habit) => (
              <motion.div key={habit.id} variants={item}>
                <HabitCard
                  habit={habit}
                  onUpdate={onUpdateHabit}
                  view="week"
                  onDelete={onDeleteHabit}
                  onEdit={onEditHabit}
                />
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <HabitSummary habits={habits} period="month" />
          <motion.div
            variants={container}
            initial="hidden"
            animate={activeTab === "month" ? "show" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {habits.map((habit) => (
              <motion.div key={habit.id} variants={item}>
                <HabitCard
                  habit={habit}
                  onUpdate={onUpdateHabit}
                  view="month"
                  onDelete={onDeleteHabit}
                  onEdit={onEditHabit}
                />
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
