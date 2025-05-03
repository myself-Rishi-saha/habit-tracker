"use client"

import { format } from "date-fns"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import type { Habit } from "@/lib/habits"

interface HabitGraphProps {
  habit: Habit
  days: Date[]
}

export function HabitGraph({ habit, days }: HabitGraphProps) {
  const data = days.map((day) => {
    const dateStr = format(day, "yyyy-MM-dd")
    const value = habit.logs[dateStr] || 0
    const target = habit.target
    const percentage = Math.min(Math.round((value / target) * 100), 100)

    return {
      date: format(day, "dd"),
      value,
      percentage,
      formattedDate: format(day, "MMM dd"),
      target,
    }
  })

  return (
    <Card className="p-1">
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
            domain={[0, "dataMax + 5"]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          {payload[0].payload.formattedDate}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value} {habit.unit}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {payload[0].payload.percentage}% of target
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="value" fill={`var(--${habit.color})`} radius={[4, 4, 0, 0]} animationDuration={1000} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
