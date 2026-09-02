import { useEffect, useRef, useState } from "react"
import AppShell from "./components/AppShell"
import ShadowView from "./components/ShadowView"
import WatchView from "./components/WatchView"
import { sentences } from "./data/lesson"
import type { AbPlayback, LessonMode, ShadowState } from "./types/lesson"

export default function App() {
  const [currentMode, setCurrentMode] = useState<LessonMode>("Watch")
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(2)
  const [playing, setPlaying] = useState(false)
  const [looping, setLooping] = useState(false)
  const [saved, setSaved] = useState(false)
  const [wordOpen, setWordOpen] = useState(false)
  const [expressionSaved, setExpressionSaved] = useState(false)
  const [clipPlaying, setClipPlaying] = useState(false)
  const [shadowState, setShadowState] = useState<ShadowState>("ready")
  const [recordSeconds, setRecordSeconds] = useState(0)
  const [difficult, setDifficult] = useState(false)
  const [abPlayback, setAbPlayback] = useState<AbPlayback>("idle")
  const wordPopoverRef = useRef<HTMLDivElement>(null)

  const transcriptListRef = useRef<HTMLDivElement>(null)

  const currentSentence = sentences[currentSentenceIndex]

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        wordPopoverRef.current &&
        !wordPopoverRef.current.contains(event.target as Node)
      )
        setWordOpen(false)
    }

    if (wordOpen) document.addEventListener("mousedown", closeOnOutsideClick)

    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [wordOpen])

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
    setWordOpen(false)
    setCurrentMode("Shadow")
  }

  const changeMode = (mode: LessonMode) => {
    setWordOpen(false)
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
    setWordOpen(false)
    setCurrentSentenceIndex(index)
  }
  const isRecording = shadowState === "recording"
  const recordingTime = `00:${String(recordSeconds).padStart(2, "0")}`

  return (
    <AppShell
      currentMode={currentMode}
      isRecording={isRecording}
      onModeChange={changeMode}
    >
      {currentMode === "Shadow" ? (
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
          wordOpen={wordOpen}
          expressionSaved={expressionSaved}
          wordPopoverRef={wordPopoverRef}
          transcriptListRef={transcriptListRef}
          onTogglePlaying={() => setPlaying(!playing)}
          onToggleLooping={() => setLooping(!looping)}
          onToggleSaved={() => setSaved(!saved)}
          onToggleWordOpen={() => setWordOpen(!wordOpen)}
          onToggleExpressionSaved={() => setExpressionSaved(!expressionSaved)}
          onOpenShadowPractice={openShadowPractice}
          onSentenceSelect={selectSentence}
        />
      )}
    </AppShell>
  )
}
