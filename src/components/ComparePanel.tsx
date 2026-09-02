import type { AbPlayback } from "../types/lesson"
import Icon from "./Icon"

type ComparePanelProps = {
  abPlayback: AbPlayback
  difficult: boolean
  onSetAbPlayback: (playback: AbPlayback) => void
  onStartAbCompare: () => void
  onToggleDifficult: () => void
  onTryAgain: () => void
  onNextSentence: () => void
}

const originalWaveHeights = [
  18, 30, 52, 24, 64, 38, 78, 44, 30, 58, 75, 35, 52, 29, 69, 43, 60, 32, 51,
  72, 39, 61, 28, 46, 67, 36, 54, 31, 49, 64, 38, 55, 27, 44,
]
const userWaveHeights = [
  20, 36, 44, 29, 57, 33, 70, 42, 26, 51, 62, 31, 48, 25, 60, 39, 53, 28, 46,
  66, 34, 58, 24, 42, 61, 32, 50, 28, 43, 59, 31, 48, 22, 39,
]

export default function ComparePanel({
  abPlayback,
  difficult,
  onSetAbPlayback,
  onStartAbCompare,
  onToggleDifficult,
  onTryAgain,
  onNextSentence,
}: ComparePanelProps) {
  return (
    <div className="compare-panel">
      <div className="audio-rows">
        <div
          className={`audio-row ${
            abPlayback === "original" ? "audio-row-playing" : ""
          }`}
        >
          <span className="audio-label">Original</span>
          <button
            className="audio-play"
            onClick={() => onSetAbPlayback("original")}
          >
            <Icon name="play" className="size-4" />
          </button>
          <span className="audio-wave audio-wave-original">
            {originalWaveHeights.map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </span>
          <span className="audio-duration">3.8s</span>
        </div>
        <div
          className={`audio-row ${
            abPlayback === "you" ? "audio-row-playing" : ""
          }`}
        >
          <span className="audio-label">You</span>
          <button className="audio-play" onClick={() => onSetAbPlayback("you")}>
            <Icon name="play" className="size-4" />
          </button>
          <span className="audio-wave audio-wave-user">
            {userWaveHeights.map((height, index) => (
              <i key={index} style={{ height: `${height}%` }} />
            ))}
          </span>
          <span className="audio-duration">4.2s</span>
        </div>
      </div>
      <div className="compare-actions">
        <button onClick={onStartAbCompare} className="ab-button">
          ⚯&nbsp;{" "}
          {abPlayback === "original"
            ? "Playing Original"
            : abPlayback === "you"
              ? "Playing You"
              : "A/B Compare"}
        </button>
        <button onClick={onToggleDifficult} className="ghost-control">
          {difficult ? "★" : "☆"}&nbsp; Difficult
        </button>
        <div className="compare-primary-actions">
          <button onClick={onTryAgain} className="try-again-button">
            Try Again
          </button>
          <button onClick={onNextSentence} className="compare-next-button">
            Next&nbsp; →
          </button>
        </div>
      </div>
    </div>
  )
}
