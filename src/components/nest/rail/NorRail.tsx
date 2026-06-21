'use client';

import { NorAsk } from './NorAsk';
import { FlockPresence } from './FlockPresence';
import { DriftSignals } from './DriftSignals';

export function NorRail() {
  return (
    <div className="flex flex-col gap-4">
      <NorAsk />
      <FlockPresence />
      <DriftSignals />
    </div>
  );
}
