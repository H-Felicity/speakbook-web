type WordPopoverProps = {
  expressionSaved: boolean
  onToggleExpressionSaved: () => void
}

export default function WordPopover({
  expressionSaved,
  onToggleExpressionSaved,
}: WordPopoverProps) {
  return (
    <section
      className="word-popover"
      role="dialog"
      aria-label="Weather expression details"
    >
      <div className="flex items-start gap-2">
        <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-[#eef0ff] text-[12px] text-primary">
          ◖
        </span>
        <div>
          <h3>weather</h3>
          <p className="pronunciation">/ˈweðər/</p>
        </div>
      </div>
      <div className="word-definition">
        <p className="popover-label">noun</p>
        <p>天气；气象</p>
      </div>
      <div className="word-section">
        <p className="popover-label">In this sentence</p>
        <p>这里指“天气状况”</p>
      </div>
      <div className="word-section">
        <p className="popover-label">Useful expression</p>
        <p className="font-medium text-foreground">in any weather</p>
        <p>不论天气如何</p>
      </div>
      <div className="word-section">
        <p className="popover-label">Original sentence</p>
        <p className="sentence-quote">
          the weather is actually much nicer than I expected
        </p>
      </div>
      <button
        type="button"
        onClick={onToggleExpressionSaved}
        className={`expression-button ${
          expressionSaved ? "expression-saved" : ""
        }`}
      >
        {expressionSaved ? "✓ Saved" : "+  Save Expression"}
      </button>
    </section>
  )
}
