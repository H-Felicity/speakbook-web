import type { ExpressionFilter, SavedExpression } from "../types/lesson"
import Icon from "./Icon"

type ExpressionsViewProps = {
  expressions: SavedExpression[]
  savedCount: number
  hasSavedExpressions: boolean
  filter: ExpressionFilter
  onFilterChange: (filter: ExpressionFilter) => void
  onOpenExpression: (expression: SavedExpression) => void
  onOpenWatch: () => void
}

type FilterOption = {
  label: string
  value: ExpressionFilter
}

const filters: FilterOption[] = [
  { label: "All", value: "all" },
  { label: "Expressions", value: "expression" },
  { label: "Words", value: "word" },
]

export default function ExpressionsView({
  expressions,
  savedCount,
  hasSavedExpressions,
  filter,
  onFilterChange,
  onOpenExpression,
  onOpenWatch,
}: ExpressionsViewProps) {
  return (
    <section className="expressions-workspace">
      <div className="expressions-header">
        <h2>Expressions</h2>
        <p>
          {savedCount} saved {savedCount === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="expression-filter-row" aria-label="Expression filters">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onFilterChange(item.value)}
            className={`filter-pill ${
              filter === item.value ? "filter-pill-active" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {expressions.length > 0 ? (
        <div className="expression-list">
          {expressions.map((expression) => (
            <button
              key={expression.id}
              type="button"
              onClick={() => onOpenExpression(expression)}
              className="expression-card"
            >
              <span className="expression-card-copy">
                <span className="expression-card-term">{expression.text}</span>
                <span className="expression-card-definition">
                  {expression.definition}
                </span>
                <span className="expression-card-sentence">
                  <Icon name="play" className="size-3" />
                  {expression.sentenceText}
                </span>
              </span>
              <span className="expression-card-meta">
                <span>Sentence {Number(expression.sentenceId)}</span>
                <span>{expression.startTime}</span>
                <span>
                  {expression.type === "expression" ? "Expression" : "Word"}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="expressions-empty">
          <div className="empty-icon">
            <Icon name="bookmark" className="size-6" />
          </div>
          <h3>{hasSavedExpressions ? "No matches" : "No expressions yet"}</h3>
          <p>
            {hasSavedExpressions
              ? "Try a different filter to find saved expressions."
              : "Select a word or expression in Watch, then save it to build this list."}
          </p>
          {!hasSavedExpressions && (
            <button
              type="button"
              onClick={onOpenWatch}
              className="practice-button"
            >
              Go to Watch
            </button>
          )}
        </div>
      )}
    </section>
  )
}
