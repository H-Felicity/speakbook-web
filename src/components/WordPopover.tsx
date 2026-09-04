import { useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { SelectedTerm, VocabularyEntry } from "../types/lesson"
import {
  calculatePopoverPosition,
  type AnchorRect,
  type CalculatedPopoverPosition,
} from "../utils/popoverPosition"

type WordPopoverProps = {
  selectedTerm: SelectedTerm
  vocabularyEntry: VocabularyEntry
  anchorRect: AnchorRect
  isSaved: boolean
  onToggleSaved: () => void
  onRequestClose: () => void
}

export default function WordPopover({
  selectedTerm,
  vocabularyEntry,
  anchorRect,
  isSaved,
  onToggleSaved,
  onRequestClose,
}: WordPopoverProps) {
  const popoverRef = useRef<HTMLElement>(null)
  const [position, setPosition] = useState<CalculatedPopoverPosition | null>(
    null,
  )

  useLayoutEffect(() => {
    const updatePosition = () => {
      const popover = popoverRef.current

      if (!popover) return

      setPosition(
        calculatePopoverPosition({
          anchorRect,
          popoverSize: {
            width: popover.offsetWidth,
            height: popover.offsetHeight,
          },
          viewportSize: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          margin: 16,
          gap: 12,
        }),
      )
    }
    const closeOnScroll = (event: Event) => {
      const popover = popoverRef.current
      const target = event.target

      if (popover && target instanceof Node && popover.contains(target)) return

      onRequestClose()
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onRequestClose()
    }

    updatePosition()

    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", closeOnScroll, true)
    document.addEventListener("keydown", closeOnEscape)

    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", closeOnScroll, true)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [anchorRect, isSaved, onRequestClose])

  const popover = (
    <section
      ref={popoverRef}
      data-word-popover="true"
      className="word-popover"
      role="dialog"
      aria-label={`${selectedTerm.text} expression details`}
      style={
        position
          ? {
              left: `${position.left}px`,
              top: `${position.top}px`,
              maxHeight: `${position.maxHeight}px`,
            }
          : { opacity: 0, pointerEvents: "none" }
      }
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-[#eef0ff] text-[12px] font-semibold text-primary">
          {selectedTerm.type === "expression" ? "E" : "W"}
        </span>
        <div>
          <h3>{selectedTerm.text}</h3>
          {vocabularyEntry.pronunciation && (
            <p className="pronunciation">{vocabularyEntry.pronunciation}</p>
          )}
        </div>
      </div>
      <div className="word-definition">
        <p className="popover-label">
          {vocabularyEntry.partOfSpeech ?? selectedTerm.type}
        </p>
        <p>{vocabularyEntry.definition}</p>
      </div>
      <div className="word-section">
        <p className="popover-label">In this sentence</p>
        <p>{vocabularyEntry.sentenceNote}</p>
      </div>
      {vocabularyEntry.usefulExpression && (
        <div className="word-section">
          <p className="popover-label">Useful expression</p>
          <p className="font-medium text-foreground">
            {vocabularyEntry.usefulExpression.text}
          </p>
          <p>{vocabularyEntry.usefulExpression.translation}</p>
        </div>
      )}
      <div className="word-section">
        <p className="popover-label">Original sentence</p>
        <p className="sentence-quote">{selectedTerm.sentenceText}</p>
      </div>
      <button
        type="button"
        aria-pressed={isSaved}
        onClick={onToggleSaved}
        className={`expression-button ${isSaved ? "expression-saved" : ""}`}
      >
        {isSaved ? "✓ Saved" : "Save Expression"}
      </button>
    </section>
  )

  return createPortal(popover, document.body)
}
