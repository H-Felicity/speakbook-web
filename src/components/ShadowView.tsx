import type { AbPlayback, LessonSentence, ShadowState } from "../types/lesson"
import ComparePanel from "./ComparePanel"
import Icon from "./Icon"
import RecordingPanel from "./RecordingPanel"

type ShadowViewProps = {
  sentences: LessonSentence[]
  currentSentence: LessonSentence
  currentSentenceIndex: number
  shadowState: ShadowState
  recordingTime: string
  clipPlaying: boolean
  looping: boolean
  difficult: boolean
  abPlayback: AbPlayback
  isRecording: boolean
  onToggleClipPlaying: () => void
  onToggleLooping: () => void
  onStartRecording: () => void
  onStopRecording: () => void
  onSetAbPlayback: (playback: AbPlayback) => void
  onStartAbCompare: () => void
  onToggleDifficult: () => void
  onTryAgain: () => void
  onNextSentence: () => void
  onPreviousSentence: () => void
  onFooterNextSentence: () => void
}

export default function ShadowView({
  sentences,
  currentSentence,
  currentSentenceIndex,
  shadowState,
  recordingTime,
  clipPlaying,
  looping,
  difficult,
  abPlayback,
  isRecording,
  onToggleClipPlaying,
  onToggleLooping,
  onStartRecording,
  onStopRecording,
  onSetAbPlayback,
  onStartAbCompare,
  onToggleDifficult,
  onTryAgain,
  onNextSentence,
  onPreviousSentence,
  onFooterNextSentence,
}: ShadowViewProps) {
  return (
    <section className="shadow-workspace">
      <div className="shadow-progress">
        <span
          style={{
            width: `${((currentSentenceIndex + 1) / sentences.length) * 100}%`,
          }}
        />
      </div>
      <div className="shadow-content">
        <div className="shadow-video relative aspect-video overflow-hidden rounded-[10px] bg-[#1a1a1b]">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90"
            alt="Woman walking on a London street with a red bus passing behind her"
            className="size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_52%,rgba(0,0,0,.7)_100%)]" />
          <div className="absolute inset-x-4 bottom-3 text-white">
            <div className="mb-2 h-0.5 rounded-full bg-white/35">
              <div className="h-full w-full rounded-full bg-[#5965F2]" />
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span>
                {currentSentence.startTime} – {currentSentence.endTime}
              </span>
              <span>Sentence clip</span>
            </div>
          </div>
        </div>
        <div className="mt-7 text-center">
          <p className="text-[13px] font-medium text-secondary-foreground">
            Sentence {currentSentenceIndex + 1} / {sentences.length}
          </p>
          <p className="mx-auto mt-2 max-w-[650px] text-[28px] font-medium leading-[1.24] tracking-[-0.035em] md:text-[32px]">
            {currentSentence.english}
          </p>
          <p className="mt-3 text-[15px] text-muted-foreground">
            {currentSentence.chinese}
          </p>
        </div>
        <div className="mt-7 flex flex-col items-center">
          {isRecording ? (
            <RecordingPanel
              recordingTime={recordingTime}
              onStopRecording={onStopRecording}
            />
          ) : shadowState === "compare" ? (
            <ComparePanel
              abPlayback={abPlayback}
              difficult={difficult}
              onSetAbPlayback={onSetAbPlayback}
              onStartAbCompare={onStartAbCompare}
              onToggleDifficult={onToggleDifficult}
              onTryAgain={onTryAgain}
              onNextSentence={onNextSentence}
            />
          ) : (
            <>
              <button
                onClick={onToggleClipPlaying}
                className="listen-button"
                aria-pressed={clipPlaying}
              >
                <Icon name="play" className="size-4" />
                {clipPlaying ? "Playing" : "Listen"}
              </button>
              <button onClick={onStartRecording} className="record-button">
                <span className="record-dot" />
                Record
              </button>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={onToggleLooping}
                  className={`ghost-control ${
                    looping ? "ghost-control-selected" : ""
                  }`}
                >
                  ↺&nbsp; Loop
                </button>
                <button className="ghost-control">1.0×</button>
                <button className="ghost-control">☆&nbsp; Difficult</button>
              </div>
            </>
          )}
        </div>
      </div>
      <footer className="shadow-footer">
        <button
          disabled={isRecording}
          onClick={onPreviousSentence}
          className="lesson-nav lesson-nav-previous"
        >
          ←&nbsp; Previous
        </button>
        <span className="auto-next">
          Auto Next{" "}
          <button aria-label="Toggle auto next" className="auto-next-toggle">
            <span />
          </button>
        </span>
        {shadowState === "compare" ? (
          <span />
        ) : (
          <button
            disabled={isRecording}
            onClick={onFooterNextSentence}
            className="lesson-nav"
          >
            Next&nbsp; →
          </button>
        )}
      </footer>
    </section>
  )
}
