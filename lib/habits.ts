export interface Habit {
  id: string
  name: string
  description: string
  target: number
  unit: string
  step: number
  color: string
  logs: Record<string, number> // date string -> value
}

export const defaultHabits: Habit[] = [
  {
    id: "sleep",
    name: "Sleep",
    description: "Track your sleep duration",
    target: 8,
    unit: "hours",
    step: 0.5,
    color: "emerald",
    logs: {
      "2023-05-01": 7.5,
      "2023-05-02": 8,
      "2023-05-03": 6.5,
      "2023-05-04": 7,
      "2023-05-05": 8.5,
      "2023-05-06": 9,
      "2023-05-07": 7.5,
    },
  },
  {
    id: "water",
    name: "Water Intake",
    description: "Track glasses of water",
    target: 8,
    unit: "glasses",
    step: 1,
    color: "sky",
    logs: {
      "2023-05-01": 6,
      "2023-05-02": 8,
      "2023-05-03": 7,
      "2023-05-04": 8,
      "2023-05-05": 9,
      "2023-05-06": 6,
      "2023-05-07": 8,
    },
  },
  {
    id: "screen",
    name: "Screen Time",
    description: "Track daily screen time",
    target: 2,
    unit: "hours",
    step: 0.5,
    color: "rose",
    logs: {
      "2023-05-01": 3,
      "2023-05-02": 2.5,
      "2023-05-03": 1.5,
      "2023-05-04": 2,
      "2023-05-05": 1,
      "2023-05-06": 4,
      "2023-05-07": 2.5,
    },
  },
]
