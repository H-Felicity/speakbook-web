export type LessonSentence = {
  id: string
  startTime: string
  endTime: string
  english: string
  chinese: string
}

export type LessonMode = "Watch" | "Shadow" | "Expressions"

export type ShadowState = "ready" | "recording" | "compare"

export type AbPlayback = "idle" | "original" | "you"
