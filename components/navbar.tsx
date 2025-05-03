"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, Menu, X } from "lucide-react"
import { motion } from "framer-motion"

interface NavbarProps {
  onSettingsClick: () => void
  onAddHabitClick: () => void
}

export function Navbar({ onSettingsClick, onAddHabitClick }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mr-2 rounded-full bg-primary p-1"
            >
              <div className="h-6 w-6 rounded-full bg-background flex items-center justify-center">
                <span className="text-primary font-bold text-sm">HT</span>
              </div>
            </motion.div>
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="font-bold text-xl"
            >
              HabitTracker
            </motion.span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" onClick={onAddHabitClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Habit
          </Button>
          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <Settings className="h-5 w-5" />
          </Button>
        </nav>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 bg-background border-b p-4 flex flex-col gap-2 md:hidden"
          >
            <Button
              variant="ghost"
              onClick={() => {
                onAddHabitClick()
                setIsMenuOpen(false)
              }}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Habit
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onSettingsClick()
                setIsMenuOpen(false)
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </motion.div>
        )}
      </div>
    </header>
  )
}
