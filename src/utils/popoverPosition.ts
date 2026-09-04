export type AnchorRect = {
  left: number
  top: number
  width: number
  height: number
}

export type PopoverSize = {
  width: number
  height: number
}

export type ViewportSize = {
  width: number
  height: number
}

export type PopoverPlacement = "top" | "bottom"

export type CalculatedPopoverPosition = {
  top: number
  left: number
  maxHeight: number
  placement: PopoverPlacement
}

type CalculatePopoverPositionOptions = {
  anchorRect: AnchorRect
  popoverSize: PopoverSize
  viewportSize: ViewportSize
  margin: number
  gap: number
}

export function calculatePopoverPosition({
  anchorRect,
  popoverSize,
  viewportSize,
  margin,
  gap,
}: CalculatePopoverPositionOptions): CalculatedPopoverPosition {
  const maxHeight = Math.max(0, viewportSize.height - margin * 2)
  const centeredLeft =
    anchorRect.left + anchorRect.width / 2 - popoverSize.width / 2
  const left = clamp(
    centeredLeft,
    margin,
    viewportSize.width - margin - popoverSize.width,
  )

  if (popoverSize.height > maxHeight) {
    return {
      top: margin,
      left,
      maxHeight,
      placement: "top",
    }
  }

  const belowTop = anchorRect.top + anchorRect.height + gap
  const aboveTop = anchorRect.top - gap - popoverSize.height
  const spaceBelow = viewportSize.height - margin - belowTop
  const spaceAbove = anchorRect.top - margin - gap
  const placement =
    spaceBelow >= popoverSize.height || spaceBelow >= spaceAbove
      ? "bottom"
      : "top"
  const unclampedTop = placement === "bottom" ? belowTop : aboveTop
  const top = clamp(unclampedTop, margin, viewportSize.height - margin)

  return {
    top,
    left,
    maxHeight,
    placement,
  }
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min

  return Math.min(Math.max(value, min), max)
}
