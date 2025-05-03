"use client"

import { format, startOfWeek, addDays } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Habit } from "@/lib/habits"

interface WeeklyOverviewProps {
  habits: Habit[]
}

export function WeeklyOverview({ habits }: WeeklyOverviewProps) {
  // Generate data for the past 7 days
  const generateWeekData = () => {
    const startDate = startOfWeek(new Date())
    const weekData = []

    for (let i = 0; i < 7; i++) {
      const currentDate = addDays(startDate, i)
      const dateStr = format(currentDate, "yyyy-MM-dd")
      const dayName = format(currentDate, "EEE")

      const completionRate = calculateDailyCompletionRate(dateStr)

      weekData.push({
        date: dayName,
        completionRate,
        fullDate: dateStr,
      })
    }

    return weekData
  }

  const calculateDailyCompletionRate = (dateStr: string) => {
    let completed = 0
    const total = habits.length

    if (total === 0) return 0

    habits.forEach((habit) => {
      if ((habit.logs[dateStr] || 0) >= habit.target) {
        completed++
      }
    })

    return Math.round((completed / total) * 100)
  }

  const weekData = generateWeekData()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weekData}>
            <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {format(new Date(payload[0].payload.fullDate), "MMM dd")}
                          </span>
                          <span className="font-bold text-muted-foreground">{payload[0].value}% completed</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="completionRate"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
