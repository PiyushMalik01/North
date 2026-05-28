'use client';

import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { LearningStyleSliders } from '@/types';

interface LearningStyleStepProps {
  onNext: () => void;
}

interface SliderConfig {
  key: keyof LearningStyleSliders;
  left: string;
  right: string;
  chartLabel: string;
}

const SLIDERS: SliderConfig[] = [
  { key: 'theoryVsHandsOn', left: 'theory nerd', right: 'hands-on builder', chartLabel: 'Hands-on' },
  { key: 'soloVsCollab', left: 'solo grinder', right: 'team player', chartLabel: 'Collab' },
  { key: 'sprintVsMarathon', left: 'sprint learner', right: 'marathon pacer', chartLabel: 'Pace' },
  { key: 'guidedVsExplore', left: 'guide me', right: 'let me explore', chartLabel: 'Explore' },
];

const RANGE_STYLES = `
  input[type="range"].ls-slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 6px;
    border-radius: 9999px;
    outline: none;
    cursor: grab;
  }
  input[type="range"].ls-slider:active {
    cursor: grabbing;
  }
  /* Webkit track */
  input[type="range"].ls-slider::-webkit-slider-runnable-track {
    height: 6px;
    border-radius: 9999px;
    background: inherit;
  }
  /* Webkit thumb */
  input[type="range"].ls-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--accent);
    border: 2.5px solid var(--background);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--accent);
    margin-top: -7px;
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }
  input[type="range"].ls-slider::-webkit-slider-thumb:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35), 0 0 0 3px var(--accent-muted);
  }
  input[type="range"].ls-slider:active::-webkit-slider-thumb {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4), 0 0 0 5px var(--accent-muted);
  }
  /* Firefox track */
  input[type="range"].ls-slider::-moz-range-track {
    height: 6px;
    border-radius: 9999px;
    background: var(--surface-3);
    border: none;
  }
  /* Firefox filled portion */
  input[type="range"].ls-slider::-moz-range-progress {
    height: 6px;
    border-radius: 9999px;
    background: var(--accent);
  }
  /* Firefox thumb */
  input[type="range"].ls-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--accent);
    border: 2.5px solid var(--background);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--accent);
    transition: box-shadow 0.15s ease;
  }
  input[type="range"].ls-slider::-moz-range-thumb:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35), 0 0 0 3px var(--accent-muted);
  }
`;

export function LearningStyleStep({ onNext }: LearningStyleStepProps) {
  const { data, updateLearningStyle } = useOnboardingStore();
  const style = data.learningStyle;

  const chartData = SLIDERS.map((s) => ({
    axis: s.chartLabel,
    value: style[s.key],
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6">
      {/* Injected range input styles */}
      <style dangerouslySetInnerHTML={{ __html: RANGE_STYLES }} />

      <div className="w-full max-w-2xl flex flex-col items-start gap-8">
        {/* Heading */}
        <div>
          <h1
            className={cn(
              'font-[family-name:var(--font-oswald)] text-2xl',
              'text-[var(--text-primary)]',
            )}
          >
            everyone learns different.
          </h1>
          <p className="text-[var(--text-secondary)] text-base mt-1">
            drag to set your style.
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            no wrong answers — this helps us personalize your experience
          </p>
        </div>

        {/* Two-column layout: sliders + radar */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          {/* Sliders column */}
          <div className="flex flex-col gap-5">
            {SLIDERS.map((slider, i) => (
              <motion.div
                key={slider.key}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                {/* Labels */}
                <div className="flex justify-between mb-2 gap-4">
                  <span className="text-xs text-[var(--text-muted)] select-none shrink-0">
                    {slider.left}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] select-none shrink-0 text-right">
                    {slider.right}
                  </span>
                </div>

                {/* Custom range */}
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={style[slider.key]}
                  onChange={(e) =>
                    updateLearningStyle({ [slider.key]: Number(e.target.value) })
                  }
                  className="ls-slider"
                  style={{
                    background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${style[slider.key]}%, var(--surface-3) ${style[slider.key]}%, var(--surface-3) 100%)`,
                  }}
                  aria-label={`${slider.left} versus ${slider.right}`}
                />
              </motion.div>
            ))}
          </div>

          {/* Radar chart column */}
          <motion.div
            className="aspect-square max-w-[280px] mx-auto w-full md:max-w-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ResponsiveContainer width="100%" height="100%" minHeight={220}>
              <RadarChart cx="50%" cy="50%" outerRadius="55%" data={chartData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis
                  dataKey="axis"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                />
                <Radar
                  name="style"
                  dataKey="value"
                  stroke="var(--accent)"
                  fill="var(--accent)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Continue button -- always visible since sliders have defaults */}
        <motion.button
          type="button"
          onClick={onNext}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'self-end w-12 h-12 rounded-full',
            'bg-[var(--accent)] text-[var(--accent-fg)]',
            'flex items-center justify-center text-xl',
            'cursor-pointer',
          )}
          aria-label="Continue"
        >
          &rarr;
        </motion.button>
      </div>
    </div>
  );
}
