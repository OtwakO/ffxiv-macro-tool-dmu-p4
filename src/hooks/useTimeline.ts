import { useCallback, useMemo, useState } from 'react';
import type { ButtonConfig, SlotIndex, Timeline, TimelineSlotData } from '../types';

function normalizeOverride(
  override: string | { mainText?: string; subText?: string },
): { mainText?: string; subText?: string } {
  if (typeof override === 'string') {
    return { mainText: override };
  }
  return override;
}

function computeTimeline(
  activeIds: string[],
  configs: Map<string, ButtonConfig>,
): Timeline {
  const timeline: (TimelineSlotData | null)[] = [
    null, null, null, null, null, null,
  ];

  for (const id of activeIds) {
    const config = configs.get(id);
    if (!config) continue;

    for (const [slotStr, override] of Object.entries(config.slots)) {
      const slotIndex = Number(slotStr) as SlotIndex;
      if (slotIndex < 1 || slotIndex > 6) continue;

      const normalized = normalizeOverride(override);
      const existing = timeline[slotIndex - 1];

      timeline[slotIndex - 1] = {
        mainText: normalized.mainText ?? existing?.mainText ?? '',
        subText: normalized.subText ?? existing?.subText ?? '',
        sourceButtonId: config.id,
        sourceButtonLabel: config.label,
      };
    }
  }

  return timeline as Timeline;
}

export function useTimeline(buttonConfigs: ButtonConfig[]) {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  const configMap = useMemo(() => {
    const map = new Map<string, ButtonConfig>();
    for (const cfg of buttonConfigs) {
      map.set(cfg.id, cfg);
    }
    return map;
  }, [buttonConfigs]);

  const toggleButton = useCallback((id: string) => {
    setActiveIds((prev) => {
      // Remove if already present, then append to end so its slots take precedence
      const filtered = prev.filter((x) => x !== id);
      return [...filtered, id];
    });
  }, []);

  const clearAll = useCallback(() => {
    setActiveIds([]);
  }, []);

  const isActive = useCallback(
    (id: string) => activeIds.includes(id),
    [activeIds],
  );

  const timeline = useMemo(
    () => computeTimeline(activeIds, configMap),
    [activeIds, configMap],
  );

  return {
    timeline,
    activeIds,
    toggleButton,
    clearAll,
    isActive,
  };
}
