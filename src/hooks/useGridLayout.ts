import { useCallback, useEffect, useState } from 'react';
import type { ButtonConfig, GridState } from '../types';

const GRID_SIZE = 25;
const STORAGE_KEY = 'ffxiv-macro-pad-layout-v1';

/* Default button placement — 5×5 grid, row-major */
const DEFAULT_LAYOUT: (string | null)[] = [
  'round1-true',
  'round1-fake',
  null,
  'fire-true',
  'fire-fake',
  'round2-true',
  'round2-fake',
  null,
  'water-true',
  'water-fake',
  'short-thunder',
  'short-water',
  null,
  null,
  null,
  'long-thunder',
  'long-water',
  null,
  null,
  null,
  null,
  null,
  null,
  'bomb-true',
  'bomb-fake',
];

function buildDefaultGrid(buttons: ButtonConfig[]): GridState {
  const validIds = new Set(buttons.map((b) => b.id));
  const grid: GridState = Array(GRID_SIZE).fill(null);
  const placed = new Set<string>();

  // Place known IDs from the explicit layout
  DEFAULT_LAYOUT.forEach((id, i) => {
    if (id && validIds.has(id)) {
      grid[i] = id;
      placed.add(id);
    }
  });

  // Fill any new / missing buttons into first empty slots
  let slot = 0;
  for (const btn of buttons) {
    if (!placed.has(btn.id)) {
      while (slot < GRID_SIZE && grid[slot] !== null) slot++;
      if (slot < GRID_SIZE) {
        grid[slot] = btn.id;
        placed.add(btn.id);
      }
    }
  }

  return grid;
}

function validateAndRepairGrid(saved: unknown, buttons: ButtonConfig[]): GridState {
  if (!Array.isArray(saved) || saved.length !== GRID_SIZE) {
    return buildDefaultGrid(buttons);
  }

  const validIds = new Set(buttons.map((b) => b.id));
  const grid: GridState = Array(GRID_SIZE).fill(null);
  const placed = new Set<string>();

  // Place valid saved buttons, preserving their positions
  saved.forEach((id, i) => {
    if (typeof id === 'string' && validIds.has(id) && !placed.has(id)) {
      grid[i] = id;
      placed.add(id);
    }
  });

  // Place any new / missing buttons into first empty slots
  let slot = 0;
  for (const btn of buttons) {
    if (!placed.has(btn.id)) {
      while (slot < GRID_SIZE && grid[slot] !== null) slot++;
      if (slot < GRID_SIZE) {
        grid[slot] = btn.id;
        placed.add(btn.id);
      }
    }
  }

  return grid;
}

export function useGridLayout(buttons: ButtonConfig[]) {
  const [grid, setGrid] = useState<GridState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        return validateAndRepairGrid(parsed, buttons);
      }
    } catch {
      /* ignore corrupt storage */
    }
    return buildDefaultGrid(buttons);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
    } catch {
      /* ignore storage errors */
    }
  }, [grid]);

  const swapSlots = useCallback((fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      fromIndex >= GRID_SIZE ||
      toIndex < 0 ||
      toIndex >= GRID_SIZE
    ) {
      return;
    }
    setGrid((prev) => {
      const next = [...prev];
      const temp = next[fromIndex];
      next[fromIndex] = next[toIndex];
      next[toIndex] = temp;
      return next;
    });
  }, []);

  return { grid, swapSlots };
}
