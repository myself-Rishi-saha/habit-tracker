"use client"

import type React from "react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Habit } from "@/lib/habits"

interface AddHabitFormProps {
  onAddHabit: (habit: Habit) => void
}

export function AddHabitForm({ onAddHabit }: AddHabitFormProps) {
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

    onAddHabit(newHabit)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit">Create Habit</Button>
      </div>
    </form>
  )
}
