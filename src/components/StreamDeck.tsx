import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { ButtonConfig, GridState } from '../types';
import { DeckButton } from './DeckButton';
import { EmptySlot } from './EmptySlot';

interface StreamDeckProps {
  buttons: ButtonConfig[];
  grid: GridState;
  isEditing: boolean;
  onPress: (id: string) => void;
  onClear: () => void;
  onSwap: (fromIndex: number, toIndex: number) => void;
}

function GridCell({
  index,
  buttonId,
  buttonMap,
  isEditing,
  onPress,
}: {
  index: number;
  buttonId: string | null;
  buttonMap: Map<string, ButtonConfig>;
  isEditing: boolean;
  onPress: (id: string) => void;
}) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `cell-${index}`,
    data: { index },
    disabled: !isEditing,
  });

  const config = buttonId ? buttonMap.get(buttonId) : undefined;

  return (
    <div ref={setDroppableRef} className="relative aspect-square">
      {config ? (
        <DraggableButton
          index={index}
          config={config}
          isEditing={isEditing}
          onPress={onPress}
        />
      ) : (
        <EmptySlot isOver={isOver} isEditing={isEditing} />
      )}
    </div>
  );
}

function DraggableButton({
  index,
  config,
  isEditing,
  onPress,
}: {
  index: number;
  config: ButtonConfig;
  isEditing: boolean;
  onPress: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `button-${config.id}`,
    data: { index, buttonId: config.id },
    disabled: !isEditing,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        opacity: isDragging ? 0.35 : 1,
        touchAction: isEditing ? 'none' : 'auto',
      }}
      className={[
        'h-full w-full',
        isEditing ? 'cursor-grab active:cursor-grabbing' : '',
      ].join(' ')}
    >
      <DeckButton
        config={config}
        isEditing={isEditing}
        onPress={onPress}
      />
    </div>
  );
}

export function StreamDeck({
  buttons,
  grid,
  isEditing,
  onPress,
  onClear,
  onSwap,
}: StreamDeckProps) {
  const buttonMap = new Map<string, ButtonConfig>();
  for (const btn of buttons) {
    buttonMap.set(btn.id, btn);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const fromIndex = active.data.current?.index as number | undefined;
    const toIndex = over.data.current?.index as number | undefined;

    if (
      typeof fromIndex === 'number' &&
      typeof toIndex === 'number' &&
      fromIndex !== toIndex
    ) {
      onSwap(fromIndex, toIndex);
    }
  };

  return (
    <section className="w-full">
      {/* Chassis */}
      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[var(--shadow-panel)] sm:rounded-3xl sm:p-4">
        {/* Subtle top highlight */}
        <div className="pointer-events-none absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-[var(--border)]/60 to-transparent" />

        {/* Header bar */}
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <span className="text-sm font-semibold tracking-wide text-[var(--ink-muted)] sm:text-base">
            Macro Pad
          </span>

          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-[var(--danger-muted)]/40 bg-transparent px-3 py-1 text-[11px] font-semibold tracking-wide text-[var(--danger)] transition-colors duration-150 hover:bg-[var(--danger)]/10 hover:border-[var(--danger)]/60 active:scale-[0.97] sm:px-3.5 sm:py-1.5 sm:text-xs"
          >
            重設時間線
          </button>
        </div>

        {/* Edit mode banner */}
        {isEditing && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-dashed border-[var(--primary)]/30 bg-[var(--primary)]/5 px-3 py-2 text-[11px] text-[var(--primary)] sm:mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>拖動按鈕來自行排序， 按 <strong>完成</strong> 確定位置.</span>
          </div>
        )}

        {/* 5×5 grid */}
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {grid.map((buttonId, index) => (
              <GridCell
                key={`cell-${index}`}
                index={index}
                buttonId={buttonId}
                buttonMap={buttonMap}
                isEditing={isEditing}
                onPress={onPress}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </section>
  );
}
