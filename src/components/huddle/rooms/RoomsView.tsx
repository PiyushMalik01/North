'use client';

import { useState } from 'react';
import { CommunityRail } from './CommunityRail';
import { NewPost } from './NewPost';
import { Feed } from './Feed';

export function RoomsView() {
  const [community, setCommunity] = useState<string | undefined>(undefined);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-28 pt-6">
      <div className="grid gap-5 md:grid-cols-[180px_1fr]">
        <aside className="hidden md:block">
          <CommunityRail active={community} onSelect={setCommunity} />
        </aside>
        <div>
          <NewPost active={community} />
          <div className="mt-4">
            <Feed community={community} />
          </div>
        </div>
      </div>
    </div>
  );
}
