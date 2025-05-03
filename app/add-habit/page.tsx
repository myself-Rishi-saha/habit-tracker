"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import type { Habit } from "@/lib/habits"

export default function AddHabitPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [habitData, setHabitData] = useState({
    name: "",
    description: "",
    target: 8,
    unit: "hours",
    step: 0.5,
    color: "emerald",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Get existing habits
      const existingHabitsJson = localStorage.getItem("habits")
      const existingHabits: Habit[] = existingHabitsJson ? JSON.parse(existingHabitsJson) : []

      // Create new habit
      const newHabit: Habit = {
        id: uuidv4(),
        name: habitData.name,
        description: habitData.description,
        target: habitData.target,
        unit: habitData.unit,
        step: habitData.step,
        color: habitData.color,
        logs: {},
      }

      // Save updated habits
      const updatedHabits = [...existingHabits, newHabit]
      localStorage.setItem("habits", JSON.stringify(updatedHabits))

      toast({
        title: "Habit created",
        description: `${habitData.name} has been added to your habits.`,
      })

      router.push("/")
    } catch (error) {
      console.error("Error saving habit:", error)
      toast({
        title: "Error creating habit",
        description: "There was a problem creating your habit. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Add New Habit</h1>

      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Habit Details</CardTitle>
            <CardDescription>Create a new habit to track</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                placeholder="e.g., Sleep, Water Intake, Screen Time"
                value={habitData.name}
                onChange={(e) => setHabitData({ ...habitData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your habit and goals"
                value={habitData.description}
                onChange={(e) => setHabitData({ ...habitData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="target">Target Value</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    id="target"
                    min={1}
                    max={24}
                    step={0.5}
                    value={[habitData.target]}
                    onValueChange={(value) => setHabitData({ ...habitData, target: value[0] })}
                  />
                  <span className="w-12 text-center font-medium">{habitData.target}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  placeholder="e.g., hours, glasses, minutes"
                  value={habitData.unit}
                  onChange={(e) => setHabitData({ ...habitData, unit: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="step">Step Size</Label>
                <Select
                  value={habitData.step.toString()}
                  onValueChange={(value) => setHabitData({ ...habitData, step: Number.parseFloat(value) })}
                >
                  <SelectTrigger id="step">
                    <SelectValue placeholder="Select step size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.1">0.1</SelectItem>
                    <SelectItem value="0.5">0.5</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select value={habitData.color} onValueChange={(value) => setHabitData({ ...habitData, color: value })}>
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emerald">Green</SelectItem>
                    <SelectItem value="sky">Blue</SelectItem>
                    <SelectItem value="amber">Yellow</SelectItem>
                    <SelectItem value="rose">Red</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button type="submit">Create Habit</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
