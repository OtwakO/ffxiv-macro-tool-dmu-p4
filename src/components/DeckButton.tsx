import { useMemo } from 'react';
import * as Icons from 'lucide-react';
import type { ButtonConfig } from '../types';

interface DeckButtonProps {
  config: ButtonConfig;
  isEditing?: boolean;
  onPress?: (id: string) => void;
}

function renderIcon(iconName: string) {
  const iconMap = Icons as unknown as Record<
    string,
    React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
  >;
  const LucideIcon = iconMap[iconName];

  if (LucideIcon) {
    return (
      <LucideIcon
        className="text-[var(--ink-muted)]"
        size={24}
        strokeWidth={2}
      />
    );
  }

  if (iconName.startsWith('<')) {
    return <span dangerouslySetInnerHTML={{ __html: iconName }} />;
  }

  return <span className="text-lg">{iconName}</span>;
}

export function DeckButton({ config, isEditing, onPress }: DeckButtonProps) {
  const iconEl = useMemo(() => renderIcon(config.icon), [config.icon]);
  const tooltipText = config.description ?? config.label;

  return (
    <div className="group relative aspect-square h-full w-full">
      {/* Tooltip */}
      <span className="pointer-events-none absolute -top-9 left-1/2 z-30 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--ink)] px-2.5 py-1 text-[11px] font-medium text-[var(--bg)] opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 sm:block">
        {tooltipText}
        <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-b border-r border-[var(--border)] bg-[var(--ink)]" />
      </span>

      <button
        type="button"
        aria-label={tooltipText}
        title={tooltipText}
        onClick={() => {
          if (!isEditing) {
            onPress?.(config.id);
          }
        }}
        className={[
          'relative flex h-full w-full flex-col items-center justify-center gap-0.5',
          'rounded-lg border border-[var(--border)] bg-[var(--surface-raised)]',
          'shadow-[0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.04)]',
          'transition-all duration-150',
          'select-none touch-manipulation outline-none',
          'hover:border-[var(--primary-light)]/70 hover:bg-[var(--surface)]',
          'active:scale-[0.97] active:shadow-[var(--shadow-pressed)]',
          'focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
          isEditing ? 'cursor-grab active:cursor-grabbing' : '',
        ].join(' ')}
      >
        {/* Edit mode grip indicator */}
        {isEditing && (
          <span className="absolute left-1.5 top-1.5 text-[var(--ink-faint)]">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="1.5" cy="1.5" r="1" />
              <circle cx="5" cy="1.5" r="1" />
              <circle cx="8.5" cy="1.5" r="1" />
              <circle cx="1.5" cy="5" r="1" />
              <circle cx="5" cy="5" r="1" />
              <circle cx="8.5" cy="5" r="1" />
              <circle cx="1.5" cy="8.5" r="1" />
              <circle cx="5" cy="8.5" r="1" />
              <circle cx="8.5" cy="8.5" r="1" />
            </svg>
          </span>
        )}

        {/* Icon */}
        <span className="relative z-10">{iconEl}</span>

        {/* Label */}
        <span className="max-w-[90%] truncate text-[12px] font-medium leading-tight text-[var(--ink-muted)] sm:text-[10px] mt-1">
          {config.label}
        </span>
      </button>
    </div>
  );
}
