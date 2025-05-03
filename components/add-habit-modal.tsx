"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import type { Habit } from "@/lib/habits"

interface AddHabitModalProps {
  onClose: () => void
  onAddHabit: (habit: Habit) => void
  onEditHabit: (habit: Habit) => void
  habit: Habit | null
}

export function AddHabitModal({ onClose, onAddHabit, onEditHabit, habit }: AddHabitModalProps) {
  const [habitData, setHabitData] = useState({
    id: "",
    name: "",
    description: "",
    target: 8,
    unit: "hours",
    step: 0.5,
    color: "emerald",
    logs: {},
  })

  useEffect(() => {
    if (habit) {
      setHabitData(habit)
    }
  }, [habit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (habit) {
      // Edit existing habit
      onEditHabit(habitData)
    } else {
      // Create new habit
      const newHabit: Habit = {
        ...habitData,
        id: uuidv4(),
        logs: {},
      }
      onAddHabit(newHabit)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg md:w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{habit ? "Edit Habit" : "Add New Habit"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{habit ? "Save Changes" : "Create Habit"}</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
