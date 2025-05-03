"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function WelcomeHero() {
  const [greeting, setGreeting] = useState("")
  const [userName, setUserName] = useState("there")

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")

    // Get user name from localStorage if available
    const savedName = localStorage.getItem("userName")
    if (savedName) setUserName(savedName)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}, <span className="text-primary">{userName}</span>!
      </h1>
      <p className="text-muted-foreground mt-2">
        Track your habits and build a better routine. Here's your progress so far.
      </p>
    </motion.div>
  )
}
