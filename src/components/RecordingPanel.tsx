type RecordingPanelProps = {
  recordingTime: string
  onStopRecording: () => void
}

const recordingWaveHeights = [
  17, 28, 42, 24, 36, 56, 32, 46, 25, 61, 38, 50, 29, 44, 58, 34, 48, 22, 40,
  55, 31, 45, 26, 52, 37, 59, 33, 47, 25, 41, 54, 30,
]

export default function RecordingPanel({
  recordingTime,
  onStopRecording,
}: RecordingPanelProps) {
  return (
    <div className="recording-panel" aria-live="polite">
      <div className="recording-status">
        <span className="recording-indicator" />
        Recording
      </div>
      <div className="recording-wave" aria-hidden="true">
        {recordingWaveHeights.map((height, index) => (
          <span
            key={index}
            style={{ height: `${height}%`, animationDelay: `${index * 45}ms` }}
          />
        ))}
      </div>
      <div className="recording-time">{recordingTime}</div>
      <button onClick={onStopRecording} className="stop-button">
        <span />
        Stop
      </button>
    </div>
  )
}
