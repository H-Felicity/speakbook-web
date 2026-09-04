import type { ReactNode } from "react"

import type { LessonMode } from "../types/lesson"

import Icon from "./Icon"

type AppShellProps = {
  currentMode: LessonMode

  isRecording: boolean

  onModeChange: (mode: LessonMode) => void

  children: ReactNode
}

const tabs: LessonMode[] = ["Watch", "Shadow", "Expressions"]

export default function AppShell({
  currentMode,

  isRecording,

  onModeChange,

  children,
}: AppShellProps) {
  return (
    <main className="min-h-full bg-background p-5 text-foreground md:p-10">
      <div className="mx-auto max-w-[1376px]">
        <p className="mb-4 text-[14px] text-muted-foreground">
          {currentMode === "Shadow"
            ? "03 Shadow Ready"
            : currentMode === "Expressions"
              ? "05 Expressions"
              : "01 Watch Default"}
        </p>
        <section className="overflow-hidden rounded-[12px] border border-border bg-card">
          <header className="relative flex h-16 items-center border-b border-border px-6">
            <button className="nav-back" aria-label="Go back">
              <Icon name="back" className="size-4" /> Back
            </button>
            <h1 className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold tracking-[-0.02em]">
              A Day in My Life in London
            </h1>
            <nav
              className="ml-auto mr-14 flex h-full gap-7"
              aria-label="Lesson sections"
            >
              {tabs.map((tab) => (
                <button
                  key={tab}
                  data-preserve-popover="true"
                  disabled={isRecording}
                  onClick={() => onModeChange(tab)}
                  className={`tab ${currentMode === tab ? "tab-active" : ""}`}
                >
                  {tab}
                </button>
              ))}
            </nav>
            <button
              className="absolute right-5 text-muted-foreground"
              aria-label="More options"
            >
              <Icon name="more" className="size-5" />
            </button>
          </header>
          {children}
        </section>
      </div>
    </main>
  )
}
