'use client';

import { useState } from 'react';
import { Bot, Save, WifiOff, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { usePlatformStore } from '@/store/platformStore';
import type { AiConfigShape } from '@/data/platform/admin';

const MODEL_MAP: Record<string, { label: string; value: string }[]> = {
  anthropic: [
    { label: 'claude-opus-4-8', value: 'claude-opus-4-8' },
    { label: 'claude-sonnet-4-6', value: 'claude-sonnet-4-6' },
    { label: 'claude-haiku-4-5-20251001', value: 'claude-haiku-4-5-20251001' },
  ],
  openai: [
    { label: 'gpt-5', value: 'gpt-5' },
    { label: 'gpt-4.1', value: 'gpt-4.1' },
  ],
  google: [{ label: 'gemini-2.5-pro', value: 'gemini-2.5-pro' }],
};

function isDirty(draft: AiConfigShape, saved: AiConfigShape): boolean {
  return (
    draft.provider !== saved.provider ||
    draft.model !== saved.model ||
    draft.temperature !== saved.temperature ||
    draft.systemPrompt !== saved.systemPrompt
  );
}

export default function AiSettings() {
  const aiConfig = usePlatformStore((s) => s.aiConfig);
  const setAiConfig = usePlatformStore((s) => s.setAiConfig);

  const [draft, setDraft] = useState<AiConfigShape>({ ...aiConfig });

  const dirty = isDirty(draft, aiConfig);

  function handleProviderChange(provider: string | null) {
    if (!provider) return;
    const models = MODEL_MAP[provider] ?? [];
    const defaultModel = models[0]?.value ?? draft.model;
    setDraft((prev) => ({ ...prev, provider, model: defaultModel }));
  }

  function handleModelChange(model: string | null) {
    if (!model) return;
    setDraft((prev) => ({ ...prev, model }));
  }

  function handleTemperatureChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDraft((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }));
  }

  function handleSystemPromptChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDraft((prev) => ({ ...prev, systemPrompt: e.target.value }));
  }

  function handleSave() {
    setAiConfig(draft);
    toast.success('AI config saved');
  }

  function handleReset() {
    setDraft({ ...aiConfig });
  }

  const providerModels = MODEL_MAP[draft.provider] ?? [];
  const modelInList = providerModels.some((m) => m.value === draft.model);
  const modelOptions = modelInList
    ? providerModels
    : [{ label: draft.model, value: draft.model }, ...providerModels];

  return (
    <div className="space-y-6">
      <AdminHeader title="nor · AI" description="Configure the platform's AI guide.">
        {dirty && (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            unsaved changes
          </Badge>
        )}
      </AdminHeader>

      {/* Connection status */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4 text-destructive" />
            <CardTitle className="text-base">Connection Status</CardTitle>
            <Badge variant="destructive" className="ml-auto">
              Degraded
            </Badge>
          </div>
          <CardDescription>
            Credential store unreachable — the AI backend reads its API keys from the database, which
            is currently offline. nor will not respond until the credential store is restored.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Model Settings</CardTitle>
          </div>
          <CardDescription>
            Changes apply to nor&apos;s next conversation session. Existing sessions are unaffected.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Provider */}
          <div className="space-y-1.5">
            <Label htmlFor="provider">Provider</Label>
            <Select value={draft.provider} onValueChange={handleProviderChange}>
              <SelectTrigger id="provider">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div className="space-y-1.5">
            <Label htmlFor="model">Model</Label>
            <Select value={draft.model} onValueChange={handleModelChange}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {modelOptions.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Temperature */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm tabular-nums text-muted-foreground">
                {draft.temperature.toFixed(1)}
              </span>
            </div>
            <input
              id="temperature"
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={draft.temperature}
              onChange={handleTemperatureChange}
              className="w-full accent-primary"
            />
          </div>

          {/* System prompt */}
          <div className="space-y-1.5">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <textarea
              id="system-prompt"
              value={draft.systemPrompt}
              onChange={handleSystemPromptChange}
              className="flex min-h-32 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

        </CardContent>

        <CardFooter className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={!dirty}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="ghost" onClick={handleReset} disabled={!dirty}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset to saved
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
