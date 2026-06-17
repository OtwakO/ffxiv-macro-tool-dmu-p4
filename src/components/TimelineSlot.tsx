import type { TimelineSlotData } from '../types';

interface TimelineSlotProps {
  data: TimelineSlotData | null;
}

export function TimelineSlot({ data }: TimelineSlotProps) {
  const isEmpty = !data;
  const hasMain = data && data.mainText !== '';
  const hasSub = data && data.subText !== '';

  return (
    <div
      className={[
        'relative flex items-center justify-center',
        'rounded-lg text-center transition-all duration-150',
        'min-h-[3.5rem] p-2 pb-5 sm:min-h-[4rem] sm:p-2.5 sm:pb-5',
        isEmpty
          ? 'border border-[var(--border-subtle)] bg-[var(--bg)]/60'
          : 'border border-[var(--primary)]/30 bg-[var(--surface-raised)] shadow-[inset_0_0_0_1px_var(--primary-glow),0_1px_2px_rgba(0,0,0,0.03)]',
      ].join(' ')}
    >
      {isEmpty || (!hasMain && !hasSub) ? (
        <span className="text-xs text-[var(--ink-faint)] sm:text-sm">—</span>
      ) : (
        <>
          <span className="text-sm font-semibold leading-tight text-[var(--ink)] sm:text-base">
            {hasMain ? data.mainText : '—'}
          </span>
          {hasSub && (
            <span className="absolute bottom-1 left-0 right-0 mx-auto max-w-full truncate px-1 text-[9px] text-[var(--ink-muted)] sm:text-[10px]">
              {data.subText}
            </span>
          )}
        </>
      )}
    </div>
  );
}
