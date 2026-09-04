import type { SelectedTerm, VocabularyEntry } from "../types/lesson"

const vocabularyEntries: VocabularyEntry[] = [
  {
    normalizedText: "weather",
    term: "weather",
    pronunciation: "/weh-ther/",
    partOfSpeech: "noun",
    definition: "天气；气象",
    sentenceNote: "Here it describes the pleasant conditions in London.",
    usefulExpression: {
      text: "in any weather",
      translation: "no matter what the weather is like",
    },
  },
  {
    normalizedText: "take a walk",
    term: "take a walk",
    partOfSpeech: "expression",
    definition: "散步",
    sentenceNote: "The speaker suggests walking through the neighborhood.",
  },
  {
    normalizedText: "much nicer",
    term: "much nicer",
    partOfSpeech: "expression",
    definition: "A lot better or more pleasant than something else.",
    sentenceNote: "The speaker is comparing London with what she expected.",
  },
  {
    normalizedText: "explore",
    term: "explore",
    pronunciation: "/ik-splor/",
    partOfSpeech: "verb",
    definition: "To travel around a place to learn about it.",
    sentenceNote: "The speaker is excited to discover London.",
  },
  {
    normalizedText: "inspires",
    term: "inspires",
    pronunciation: "/in-spai-urz/",
    partOfSpeech: "verb",
    definition: "Makes someone feel creative, interested, or motivated.",
    sentenceNote: "The city gives the speaker energy and ideas.",
  },
  {
    normalizedText: "around the corner",
    term: "around the corner",
    partOfSpeech: "expression",
    definition: "Very close by, usually after turning onto another street.",
    sentenceNote: "The market is nearby in the neighborhood.",
  },
]

export function lookupVocabulary(selectedTerm: SelectedTerm): VocabularyEntry {
  const entry = vocabularyEntries.find(
    (item) => item.normalizedText === selectedTerm.normalizedText,
  )

  if (entry) return entry

  return {
    normalizedText: selectedTerm.normalizedText,
    term: selectedTerm.text,
    partOfSpeech: selectedTerm.type,
    definition:
      selectedTerm.type === "expression"
        ? "An expression selected from this lesson sentence."
        : "A word selected from this lesson sentence.",
    sentenceNote: "Use the original sentence to review meaning and context.",
  }
}
