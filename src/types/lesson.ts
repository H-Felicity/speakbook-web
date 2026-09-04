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

export type SelectedTermType = "word" | "expression"

export type SelectedTerm = {
  id: string
  sentenceId: string
  text: string
  normalizedText: string
  type: SelectedTermType
  tokenIndexes: number[]
  sentenceText: string
  sentenceTranslation: string
  startTime: string
  endTime: string
}

export type VocabularyEntry = {
  normalizedText: string
  term: string
  pronunciation?: string
  partOfSpeech?: string
  definition: string
  sentenceNote: string
  usefulExpression?: {
    text: string
    translation: string
  }
}

export type SavedExpression = SelectedTerm & {
  savedAt: string
  definition: string
  sentenceNote: string
}

export type ExpressionFilter = "all" | SelectedTermType
