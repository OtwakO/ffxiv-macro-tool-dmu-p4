interface EmptySlotProps {
  isOver?: boolean;
  isEditing?: boolean;
}

export function EmptySlot({ isOver, isEditing }: EmptySlotProps) {
  return (
    <div
      className={[
        'flex aspect-square w-full items-center justify-center',
        'rounded-lg transition-colors duration-150',
        isEditing
          ? isOver
            ? 'border-2 border-dashed border-[var(--primary)] bg-[var(--primary)]/5'
            : 'border-2 border-dashed border-[var(--border)]/50 bg-[var(--surface)]/30'
          : 'border border-dashed border-[var(--border-subtle)] bg-[var(--surface)]/20',
      ].join(' ')}
      aria-hidden="true"
    >
      {isEditing && !isOver && (
        <span className="text-[10px] text-[var(--ink-faint)]" />
      )}
    </div>
  );
}
