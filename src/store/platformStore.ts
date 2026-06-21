import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { defaultFlags, defaultAiConfig, type AiConfigShape } from '@/data/platform/admin';

interface PlatformState {
  /** Feature flags — the nav and zones read these so the admin can toggle areas live. */
  flags: Record<string, boolean>;
  aiConfig: AiConfigShape;
  setFlag: (key: string, value: boolean) => void;
  setAiConfig: (patch: Partial<AiConfigShape>) => void;
  resetFlags: () => void;
}

/**
 * Admin-controllable platform settings — feature flags + nor's AI config.
 * Persisted so toggles survive reloads and are read by the live app (e.g. TopNav
 * hides a zone when its flag is off). This is the "control" half of the admin panel.
 */
export const usePlatformStore = create<PlatformState>()(
  devtools(
    persist(
      (set) => ({
        flags: { ...defaultFlags },
        aiConfig: { ...defaultAiConfig },
        setFlag: (key, value) => set((s) => ({ flags: { ...s.flags, [key]: value } })),
        setAiConfig: (patch) => set((s) => ({ aiConfig: { ...s.aiConfig, ...patch } })),
        resetFlags: () => set({ flags: { ...defaultFlags } }),
      }),
      { name: 'north-platform' },
    ),
    { name: 'platform' },
  ),
);
