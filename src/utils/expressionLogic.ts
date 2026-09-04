import type {
  ExpressionFilter,
  LessonSentence,
  SavedExpression,
  SelectedTerm,
} from "../types/lesson"

type ExpressionFilters = {
  type: ExpressionFilter
}

const punctuationPattern = /^[^\w']+|[^\w']+$/g

export function normalizeTerm(text: string) {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(punctuationPattern, "")
    .toLowerCase()
}

export function getSentenceTokens(sentence: LessonSentence) {
  return sentence.english.split(/\s+/).map((rawText, index) => ({
    index,
    rawText,
    text: rawText.replace(punctuationPattern, ""),
  }))
}

export function buildSelectedTerm(
  sentence: LessonSentence,
  tokenIndexes: number[],
): SelectedTerm {
  const orderedIndexes = [...new Set(tokenIndexes)].sort((a, b) => a - b)
  const tokens = getSentenceTokens(sentence).filter((token) =>
    orderedIndexes.includes(token.index),
  )
  const text = tokens.map((token) => token.text).join(" ")
  const normalizedText = normalizeTerm(text)

  return {
    id: `${sentence.id}:${normalizedText.replace(/\s+/g, "-")}`,
    sentenceId: sentence.id,
    text,
    normalizedText,
    type: tokens.length > 1 ? "expression" : "word",
    tokenIndexes: tokens.map((token) => token.index),
    sentenceText: sentence.english,
    sentenceTranslation: sentence.chinese,
    startTime: sentence.startTime,
    endTime: sentence.endTime,
  }
}

export function buildSelectedTermFromText(
  sentence: LessonSentence,
  selectedText: string,
): SelectedTerm | null {
  const text = selectedText.trim().replace(/\s+/g, " ")

  if (!text) return null

  const normalizedText = normalizeTerm(text)
  const selectedWords = normalizedText.split(" ")
  const tokens = getSentenceTokens(sentence)
  const normalizedTokens = tokens.map((token) => normalizeTerm(token.text))
  const startIndex = normalizedTokens.findIndex((_, index) =>
    selectedWords.every(
      (word, wordIndex) => normalizedTokens[index + wordIndex] === word,
    ),
  )
  const tokenIndexes =
    startIndex >= 0 ? selectedWords.map((_, index) => startIndex + index) : []

  return {
    id: `${sentence.id}:${normalizedText.replace(/\s+/g, "-")}`,
    sentenceId: sentence.id,
    text,
    normalizedText,
    type: text.includes(" ") ? "expression" : "word",
    tokenIndexes,
    sentenceText: sentence.english,
    sentenceTranslation: sentence.chinese,
    startTime: sentence.startTime,
    endTime: sentence.endTime,
  }
}

export function saveExpression(
  savedExpressions: SavedExpression[],
  selectedTerm: SelectedTerm,
  definition = "Meaning saved from this lesson context.",
  sentenceNote = "Review how this expression is used in the original sentence.",
  savedAt = new Date().toISOString(),
) {
  if (
    savedExpressions.some(
      (expression) =>
        expression.normalizedText === selectedTerm.normalizedText &&
        expression.sentenceId === selectedTerm.sentenceId,
    )
  )
    return savedExpressions

  return [
    ...savedExpressions,
    {
      ...selectedTerm,
      savedAt,
      definition,
      sentenceNote,
    },
  ]
}

export function hasSavedExpression(
  savedExpressions: SavedExpression[],
  selectedTerm: SelectedTerm,
) {
  return savedExpressions.some((expression) =>
    isSameSavedExpression(expression, selectedTerm),
  )
}

export function toggleSavedExpression(
  savedExpressions: SavedExpression[],
  selectedTerm: SelectedTerm,
  definition = "Meaning saved from this lesson context.",
  sentenceNote = "Review how this expression is used in the original sentence.",
  savedAt = new Date().toISOString(),
) {
  if (hasSavedExpression(savedExpressions, selectedTerm)) {
    return savedExpressions.filter(
      (expression) => !isSameSavedExpression(expression, selectedTerm),
    )
  }

  return saveExpression(
    savedExpressions,
    selectedTerm,
    definition,
    sentenceNote,
    savedAt,
  )
}

function isSameSavedExpression(
  savedExpression: SavedExpression,
  selectedTerm: SelectedTerm,
) {
  return (
    savedExpression.sentenceId === selectedTerm.sentenceId &&
    savedExpression.normalizedText === selectedTerm.normalizedText
  )
}

export function filterSavedExpressions(
  savedExpressions: SavedExpression[],
  filters: ExpressionFilters,
) {
  return savedExpressions.filter((expression) => {
    const matchesType =
      filters.type === "all" || expression.type === filters.type

    return matchesType
  })
}
