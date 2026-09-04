import { useEffect, useRef, useState } from "react"
import AppShell from "./components/AppShell"
import ExpressionsView from "./components/ExpressionsView"
import ShadowView from "./components/ShadowView"
import WatchView from "./components/WatchView"
import { sentences } from "./data/lesson"
import { lookupVocabulary } from "./data/vocabulary"
import type {
  AbPlayback,
  ExpressionFilter,
  LessonMode,
  SavedExpression,
  SelectedTerm,
  ShadowState,
} from "./types/lesson"
import {
  filterSavedExpressions,
  hasSavedExpression,
  toggleSavedExpression,
} from "./utils/expressionLogic"
import type { AnchorRect } from "./utils/popoverPosition"

export default function App() {
  const [currentMode, setCurrentMode] = useState<LessonMode>("Watch")

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(2)

  const [playing, setPlaying] = useState(false)
  const [looping, setLooping] = useState(false)
  const [saved, setSaved] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState<SelectedTerm | null>(null)
  const [popoverAnchorRect, setPopoverAnchorRect] = useState<AnchorRect | null>(
    null,
  )
  const [savedExpressions, setSavedExpressions] = useState<SavedExpression[]>(
    [],
  )
  const [expressionFilter, setExpressionFilter] =
    useState<ExpressionFilter>("all")
  const [clipPlaying, setClipPlaying] = useState(false)

  const [shadowState, setShadowState] = useState<ShadowState>("ready")

  const [recordSeconds, setRecordSeconds] = useState(0)

  const [difficult, setDifficult] = useState(false)

  const [abPlayback, setAbPlayback] = useState<AbPlayback>("idle")

  const wordPopoverRef = useRef<HTMLDivElement>(null)

  const transcriptListRef = useRef<HTMLDivElement>(null)

  const currentSentence = sentences[currentSentenceIndex]
  const selectedVocabularyEntry = selectedTerm
    ? lookupVocabulary(selectedTerm)
    : null
  const selectedExpressionSaved =
    selectedTerm !== null && hasSavedExpression(savedExpressions, selectedTerm)
  const visibleExpressions = filterSavedExpressions(savedExpressions, {
    type: expressionFilter,
  })

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target

      if (!(target instanceof Node)) return

      const targetElement =
        target instanceof Element ? target : target.parentElement

      if (
        targetElement?.closest(
          "[data-preserve-popover='true'], [data-word-popover='true']",
        )
      )
        return

      if (wordPopoverRef.current && !wordPopoverRef.current.contains(target))
        closeWordPopover()
    }

    if (selectedTerm)
      document.addEventListener("mousedown", closeOnOutsideClick)

    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [selectedTerm])

  useEffect(() => {
    if (currentMode !== "Watch") return

    const list = transcriptListRef.current

    const activeSentence = list?.querySelector<HTMLElement>(
      "[data-active='true']",
    )

    if (!list || !activeSentence) return

    const targetTop =
      activeSentence.offsetTop -
      list.clientHeight / 2 +
      activeSentence.offsetHeight / 2

    list.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" })
  }, [currentMode, currentSentenceIndex])

  useEffect(() => {
    if (shadowState !== "recording") return

    const timer = window.setInterval(
      () => setRecordSeconds((seconds) => seconds + 1),

      1000,
    )

    return () => window.clearInterval(timer)
  }, [shadowState])

  const openShadowPractice = () => {
    setCurrentMode("Shadow")
  }

  const changeMode = (mode: LessonMode) => {
    setCurrentMode(mode)
  }

  const startRecording = () => {
    setClipPlaying(false)

    setRecordSeconds(0)

    setShadowState("recording")
  }

  const stopRecording = () => setShadowState("compare")

  const startAbCompare = () => {
    setAbPlayback("original")

    window.setTimeout(() => setAbPlayback("you"), 300)

    window.setTimeout(() => setAbPlayback("idle"), 1800)
  }

  const tryAgain = () => {
    setRecordSeconds(0)

    setShadowState("ready")
  }

  const nextSentence = () => {
    setCurrentSentenceIndex(
      Math.min(sentences.length - 1, currentSentenceIndex + 1),
    )

    setRecordSeconds(0)

    setShadowState("ready")
  }

  const selectSentence = (index: number) => {
    closeWordPopover()
    setCurrentSentenceIndex(index)
  }
  const selectTerm = (term: SelectedTerm, anchorRect: AnchorRect) => {
    setSelectedTerm(term)
    setPopoverAnchorRect(anchorRect)
  }
  const closeWordPopover = () => {
    setSelectedTerm(null)
    setPopoverAnchorRect(null)
  }
  const handleToggleSavedExpression = () => {
    if (!selectedTerm || !selectedVocabularyEntry) return

    setSavedExpressions((expressions) =>
      toggleSavedExpression(
        expressions,
        selectedTerm,
        selectedVocabularyEntry.definition,
        selectedVocabularyEntry.sentenceNote,
      ),
    )
  }
  const openExpression = (expression: SavedExpression) => {
    const sentenceIndex = sentences.findIndex(
      (sentence) => sentence.id === expression.sentenceId,
    )

    if (sentenceIndex >= 0) setCurrentSentenceIndex(sentenceIndex)

    setSelectedTerm(expression)
    setPopoverAnchorRect(null)
    setCurrentMode("Watch")
  }
  const isRecording = shadowState === "recording"

  const recordingTime = `00:${String(recordSeconds).padStart(2, "0")}`

  return (
    <AppShell
      currentMode={currentMode}
      isRecording={isRecording}
      onModeChange={changeMode}
    >
      {currentMode === "Expressions" ? (
        <ExpressionsView
          expressions={visibleExpressions}
          savedCount={savedExpressions.length}
          hasSavedExpressions={savedExpressions.length > 0}
          filter={expressionFilter}
          onFilterChange={setExpressionFilter}
          onOpenExpression={openExpression}
          onOpenWatch={() => changeMode("Watch")}
        />
      ) : currentMode === "Shadow" ? (
        <ShadowView
          sentences={sentences}
          currentSentence={currentSentence}
          currentSentenceIndex={currentSentenceIndex}
          shadowState={shadowState}
          recordingTime={recordingTime}
          clipPlaying={clipPlaying}
          looping={looping}
          difficult={difficult}
          abPlayback={abPlayback}
          isRecording={isRecording}
          onToggleClipPlaying={() => setClipPlaying(!clipPlaying)}
          onToggleLooping={() => setLooping(!looping)}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onSetAbPlayback={setAbPlayback}
          onStartAbCompare={startAbCompare}
          onToggleDifficult={() => setDifficult(!difficult)}
          onTryAgain={tryAgain}
          onNextSentence={nextSentence}
          onPreviousSentence={() =>
            setCurrentSentenceIndex(Math.max(0, currentSentenceIndex - 1))
          }
          onFooterNextSentence={() =>
            setCurrentSentenceIndex(
              Math.min(sentences.length - 1, currentSentenceIndex + 1),
            )
          }
        />
      ) : (
        <WatchView
          sentences={sentences}
          currentSentence={currentSentence}
          currentSentenceIndex={currentSentenceIndex}
          playing={playing}
          looping={looping}
          saved={saved}
          selectedTerm={selectedTerm}
          selectedVocabularyEntry={selectedVocabularyEntry}
          popoverAnchorRect={popoverAnchorRect}
          isSelectedExpressionSaved={selectedExpressionSaved}
          wordPopoverRef={wordPopoverRef}
          transcriptListRef={transcriptListRef}
          onTogglePlaying={() => setPlaying(!playing)}
          onToggleLooping={() => setLooping(!looping)}
          onToggleSaved={() => setSaved(!saved)}
          onSelectTerm={selectTerm}
          onToggleSavedExpression={handleToggleSavedExpression}
          onCloseExpressionPopover={closeWordPopover}
          onOpenShadowPractice={openShadowPractice}
          onSentenceSelect={selectSentence}
        />
      )}
    </AppShell>
  )
}
