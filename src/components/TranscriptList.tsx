import type { RefObject } from "react"
import type { LessonSentence } from "../types/lesson"
import Icon from "./Icon"

type TranscriptListProps = {
  sentences: LessonSentence[]
  currentSentenceIndex: number
  transcriptListRef: RefObject<HTMLDivElement | null>
  onSentenceSelect: (index: number) => void
}

export default function TranscriptList({
  sentences,
  currentSentenceIndex,
  transcriptListRef,
  onSentenceSelect,
}: TranscriptListProps) {
  return (
    <aside className="flex min-h-0 flex-col bg-[#fdfdfc] p-6 lg:h-full lg:p-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">Transcript</h2>
        <div className="flex gap-4">
          <button aria-label="Filter transcript">
            <Icon name="sliders" className="size-4" />
          </button>
          <button aria-label="Transcript options">
            <Icon name="sliders" className="size-4" />
          </button>
        </div>
      </div>
      <div
        ref={transcriptListRef}
        className="transcript-scroll min-h-0 flex-1 overflow-y-auto rounded-[10px] border border-border bg-card"
      >
        {sentences.map((item, index) => (
          <button
            key={item.id}
            data-active={currentSentenceIndex === index}
            onClick={() => onSentenceSelect(index)}
            className={`transcript-line ${
              currentSentenceIndex === index ? "transcript-active" : ""
            }`}
          >
            <span className="timestamp">{item.startTime}</span>
            <span className="line-copy">
              <span className="block text-[14px] font-medium leading-5">
                {item.english}
              </span>
              <span className="mt-1 block text-[13px] leading-5 text-muted-foreground">
                {item.chinese}
              </span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  )
}
