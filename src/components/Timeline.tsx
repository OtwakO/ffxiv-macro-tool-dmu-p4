import type { Timeline as TimelineType } from '../types';
import { TimelineSlot } from './TimelineSlot';

interface TimelineProps {
  timeline: TimelineType;
}

export function Timeline({ timeline }: TimelineProps) {
  const filledCount = timeline.filter(Boolean).length;

  return (
    <section className="w-full">
      {/* Panel */}
      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-panel)] sm:rounded-3xl sm:p-4">
        {/* Subtle top highlight */}
        <div className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-[var(--border)]/60 to-transparent" />

        {/* Header */}
        <div className="mb-2 flex items-center justify-between sm:mb-3">
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink-faint)]" />
            <span className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] sm:text-base">
              機制時間線
            </span>
          </div>
          <span className="rounded-full bg-[var(--surface-raised)] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--ink-muted)]">
            {filledCount} / {timeline.length}
          </span>
        </div>

        {/* Step number row */}
        <div className="mb-1.5 grid grid-cols-3 gap-1.5 sm:mb-2 sm:grid-cols-6 sm:gap-2">
          {timeline.map((_, i) => (
            <div key={`step-${i}`} className="text-center">
              <span className="text-[10px] font-bold tabular-nums text-[var(--ink-faint)]">
                {i + 1}
              </span>
            </div>
          ))}
        </div>

        {/* 3×2 mobile / 6×1 desktop */}
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2">
          {timeline.map((slot, i) => (
            <TimelineSlot key={i} data={slot} />
          ))}
        </div>
      </div>
    </section>
  );
}
