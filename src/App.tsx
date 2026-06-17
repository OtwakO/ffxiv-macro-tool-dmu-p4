import { useState } from 'react';
import { useTimeline } from './hooks/useTimeline';
import { useGridLayout } from './hooks/useGridLayout';
import { buttonConfigs } from './config/buttons';
import { StreamDeck } from './components/StreamDeck';
import { Timeline } from './components/Timeline';

export default function App() {
  const [isEditing, setIsEditing] = useState(false);
  const { timeline, toggleButton, clearAll } = useTimeline(buttonConfigs);
  const { grid, swapSlots } = useGridLayout(buttonConfigs);

  return (
    <div className="flex min-h-screen flex-col items-center bg-[var(--bg)] px-3 py-4 text-[var(--ink)] sm:px-6 sm:py-8">
      {/* App title */}
      <header className="mb-5 text-center sm:mb-6">
        <h1 className="text-xl font-semibold tracking-wide sm:text-2xl">
          FFXIV P4 DMU Macro Helper
        </h1>
        <p className="mt-1 text-xs text-[var(--ink-muted)]">
          巨集按鈕可以在編輯模式隨意拖動
        </p>
      </header>

      <main className="flex w-full max-w-md flex-col gap-4 sm:max-w-lg sm:gap-5">
        {/* Edit mode toggle */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className={[
              'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-150 active:scale-[0.97]',
              isEditing
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'border border-[var(--border)] bg-[var(--surface)] text-[var(--ink-muted)] hover:border-[var(--primary-light)]/50 hover:text-[var(--ink)]',
            ].join(' ')}
          >
            {isEditing ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                完成
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                編輯模式
              </>
            )}
          </button>
        </div>

        {/* Macro Pad */}
        <StreamDeck
          buttons={buttonConfigs}
          grid={grid}
          isEditing={isEditing}
          onPress={toggleButton}
          onClear={clearAll}
          onSwap={swapSlots}
        />

        {/* Timeline */}
        <Timeline timeline={timeline} />
      </main>

      <footer className="mt-6 text-center text-[10px] tracking-wider text-[var(--ink-faint)] sm:mt-8">
        僅供遊戲輔助使用
      </footer>
    </div>
  );
}
