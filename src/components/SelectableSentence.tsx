import { useRef } from "react"
import type { KeyboardEvent, MouseEvent } from "react"
import type { LessonSentence, SelectedTerm } from "../types/lesson"
import {
  buildSelectedTerm,
  buildSelectedTermFromText,
  getSentenceTokens,
} from "../utils/expressionLogic"
import type { AnchorRect } from "../utils/popoverPosition"

type SelectableSentenceProps = {
  sentence: LessonSentence
  selectedTerm: SelectedTerm | null
  onSelectTerm: (term: SelectedTerm, anchorRect: AnchorRect) => void
}

export default function SelectableSentence({
  sentence,
  selectedTerm,
  onSelectTerm,
}: SelectableSentenceProps) {
  const sentenceRef = useRef<HTMLSpanElement>(null)
  const suppressNextClickRef = useRef(false)
  const tokens = getSentenceTokens(sentence)

  const selectToken = (event: MouseEvent<HTMLElement>, index: number) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false

      return
    }

    onSelectTerm(
      buildSelectedTerm(sentence, [index]),
      toAnchorRect(event.currentTarget.getBoundingClientRect()),
    )
  }

  const selectWithKeyboard = (
    event: KeyboardEvent<HTMLElement>,
    index: number,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return

    event.preventDefault()

    onSelectTerm(
      buildSelectedTerm(sentence, [index]),
      toAnchorRect(event.currentTarget.getBoundingClientRect()),
    )
  }

  return (
    <span ref={sentenceRef} onMouseUp={handleMouseUp}>
      {tokens.map((token) => {
        const selected =
          selectedTerm?.sentenceId === sentence.id &&
          selectedTerm.tokenIndexes.includes(token.index)

        return (
          <span key={`${token.rawText}-${token.index}`}>
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => selectToken(event, token.index)}
              onKeyDown={(event) => selectWithKeyboard(event, token.index)}
              className={`selectable-token ${
                selected ? "selectable-token-active" : ""
              }`}
            >
              {token.text}
            </span>{" "}
          </span>
        )
      })}
    </span>
  )

  function handleMouseUp() {
    const sentenceElement = sentenceRef.current
    const selection = window.getSelection()

    if (!sentenceElement || !selection || selection.isCollapsed) return
    if (!selection.anchorNode || !selection.focusNode) return
    if (
      !sentenceElement.contains(selection.anchorNode) ||
      !sentenceElement.contains(selection.focusNode)
    )
      return

    const range = selection.getRangeAt(0)

    if (!sentenceElement.contains(range.commonAncestorContainer)) return

    const selectedFromText = buildSelectedTermFromText(
      sentence,
      selection.toString(),
    )

    if (!selectedFromText) return

    const rangeRect = range.getBoundingClientRect()

    suppressNextClickRef.current = true
    window.setTimeout(() => {
      suppressNextClickRef.current = false
    }, 0)

    onSelectTerm(selectedFromText, toAnchorRect(rangeRect))
  }
}

function toAnchorRect(rect: DOMRect): AnchorRect {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  }
}
