export type SlotIndex = 1 | 2 | 3 | 4 | 5 | 6;

export type SlotOverride = string | { mainText?: string; subText?: string };

export interface ButtonConfig {
  id: string;
  label: string;
  icon: string; // Lucide icon name, emoji, or inline SVG string
  group?: string;
  description?: string;
  slots: Partial<Record<SlotIndex, SlotOverride>>;
}

export interface TimelineSlotData {
  mainText: string;
  subText: string;
  sourceButtonId: string;
  sourceButtonLabel: string;
}

export type Timeline = [
  TimelineSlotData | null,
  TimelineSlotData | null,
  TimelineSlotData | null,
  TimelineSlotData | null,
  TimelineSlotData | null,
  TimelineSlotData | null,
];

/* Grid layout types */
export type GridSlot = string | null; // button ID or empty
export type GridState = GridSlot[]; // 25 slots
