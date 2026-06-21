'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCommunities, useCreatePost } from '@/lib/huddle/hooks';

const inputStyle = {
  background: 'var(--scene-bg)',
  borderColor: 'var(--scene-card-border)',
  color: 'var(--text-primary)',
} as const;

export function NewPost({ active }: { active?: string }) {
  const { data: communities } = useCommunities();
  const create = useCreatePost(active);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const slug = active ?? communities?.[0]?.slug;

  const submit = () => {
    if (!title.trim() || !body.trim() || !slug) return;
    create.mutate({ title: title.trim(), body: body.trim(), communitySlug: slug });
    setTitle('');
    setBody('');
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-2xl border px-4 py-3 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
        style={{ background: 'var(--scene-card)', borderColor: 'var(--scene-card-border)' }}
      >
        <Plus size={16} /> start a post{slug ? ` in ${slug}` : ''}…
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="space-y-2 rounded-2xl border p-4"
      style={{ background: 'var(--scene-card)', borderColor: 'var(--scene-card-border)' }}
    >
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="title"
        className="w-full rounded-lg border px-3 py-2 text-sm font-medium outline-none focus:border-[var(--text-secondary)]"
        style={inputStyle}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="say something…"
        rows={3}
        className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:border-[var(--text-secondary)]"
        style={inputStyle}
      />
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
        >
          cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || !body.trim()}
          className="rounded-lg px-4 py-1.5 text-sm font-semibold disabled:opacity-40"
          style={{ background: 'var(--text-primary)', color: 'var(--scene-bg)' }}
        >
          post
        </button>
      </div>
    </form>
  );
}
