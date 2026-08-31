import type { RefObject } from "react"
import type { LessonSentence } from "../types/lesson"
import Icon from "./Icon"
import TranscriptList from "./TranscriptList"
import WordPopover from "./WordPopover"

type WatchViewProps = {
  sentences: LessonSentence[]
  currentSentence: LessonSentence
  currentSentenceIndex: number
  playing: boolean
  looping: boolean
  saved: boolean
  wordOpen: boolean
  expressionSaved: boolean
  wordPopoverRef: RefObject<HTMLDivElement | null>
  transcriptListRef: RefObject<HTMLDivElement | null>
  onTogglePlaying: () => void
  onToggleLooping: () => void
  onToggleSaved: () => void
  onToggleWordOpen: () => void
  onToggleExpressionSaved: () => void
  onOpenShadowPractice: () => void
  onSentenceSelect: (index: number) => void
}

export default function WatchView({
  sentences,
  currentSentence,
  currentSentenceIndex,
  playing,
  looping,
  saved,
  wordOpen,
  expressionSaved,
  wordPopoverRef,
  transcriptListRef,
  onTogglePlaying,
  onToggleLooping,
  onToggleSaved,
  onToggleWordOpen,
  onToggleExpressionSaved,
  onOpenShadowPractice,
  onSentenceSelect,
}: WatchViewProps) {
  return (
    <div className="grid min-h-[790px] grid-cols-1 lg:h-[790px] lg:grid-cols-[62%_38%]">
      <section className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-7">
        <div className="video-frame group relative aspect-video overflow-hidden rounded-[10px] bg-[#1a1a1b]">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90"
            alt="Woman walking on a London street with a red bus passing behind her"
            className="size-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(0,0,0,.7)_100%)]" />
          <div className="absolute inset-x-4 bottom-4 text-white">
            <div className="mb-3 h-0.5 rounded-full bg-white/35">
              <div className="h-full w-[48%] rounded-full bg-[#5965F2]" />
            </div>
            <div className="flex items-center gap-3 text-[13px] font-medium">
              <button
                onClick={onTogglePlaying}
                aria-label={playing ? "Pause" : "Play"}
              >
                <Icon name="play" className="size-5" />
              </button>
              <Icon name="volume" className="size-4" />
              <span>{currentSentence.startTime} / 3:02</span>
              <div className="ml-auto flex items-center gap-4">
                <span>1.0×</span>
                <span className="rounded bg-white px-1 text-[11px] font-bold text-[#18181A]">
                  CC
                </span>
                <Icon name="expand" className="size-5" />
                <Icon name="expand" className="size-5" />
              </div>
            </div>
          </div>
        </div>

        <article className="mt-6 rounded-[12px] border border-border bg-card px-5 py-4 md:px-6 md:py-5">
          <p className="text-[13px] font-medium text-secondary-foreground">
            Sentence {currentSentenceIndex + 1} / {sentences.length}
          </p>
          <div className="py-5 text-center md:py-6">
            <div ref={wordPopoverRef} className="sentence-line">
              <p className="mx-auto max-w-[570px] text-[24px] font-semibold leading-[1.25] tracking-[-0.035em] md:text-[29px]">
                {currentSentence.english.split(" ").map((word, index) =>
                  word === "weather" ? (
                    <span key={`${word}-${index}`} className="word-anchor">
                      <button
                        type="button"
                        onClick={onToggleWordOpen}
                        className="word-trigger"
                        aria-expanded={wordOpen}
                      >
                        weather
                      </button>{" "}
                    </span>
                  ) : (
                    <span
                      key={`${word}-${index}`}
                      className={index === 1 ? "text-primary" : ""}
                    >
                      {word}{" "}
                    </span>
                  ),
                )}
              </p>
              {wordOpen && (
                <WordPopover
                  expressionSaved={expressionSaved}
                  onToggleExpressionSaved={onToggleExpressionSaved}
                />
              )}
            </div>
            <p className="mt-3 text-[15px] text-muted-foreground">
              {currentSentence.chinese}
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <div className="flex gap-2">
              <button
                onClick={onToggleLooping}
                className={`action-button ${looping ? "action-selected" : ""}`}
              >
                <Icon name="loop" className="size-4" />
                Loop
              </button>
              <button
                onClick={onToggleSaved}
                className={`action-button ${saved ? "action-selected" : ""}`}
              >
                <Icon name="bookmark" className="size-4" />
                {saved ? "Saved" : "Save"}
              </button>
            </div>
            <button onClick={onOpenShadowPractice} className="practice-button">
              Practice This Sentence
            </button>
          </div>
        </article>
      </section>

      <TranscriptList
        sentences={sentences}
        currentSentenceIndex={currentSentenceIndex}
        transcriptListRef={transcriptListRef}
        onSentenceSelect={onSentenceSelect}
      />
    </div>
  )
}
