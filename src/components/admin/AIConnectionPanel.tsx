'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { FiLoader } from 'react-icons/fi';
import { OAuthCard } from '@/components/admin/OAuthCard';
import { ApiKeyCard } from '@/components/admin/ApiKeyCard';
import { ModelCard } from '@/components/admin/ModelCard';

type ConnectionStatus = 'disconnected' | 'polling' | 'connected';

interface DeviceFlow {
  userCode: string;
  verificationUrl: string;
  deviceAuthId: string;
}

export function AIConnectionPanel() {
  const [oauthStatus, setOauthStatus] = useState<ConnectionStatus>('disconnected');
  const [deviceFlow, setDeviceFlow] = useState<DeviceFlow | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<ConnectionStatus>('disconnected');
  const [maskedKey, setMaskedKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/ai/status');
      if (!res.ok) return;
      const data = await res.json();
      setOauthStatus(data.oauth.connected ? 'connected' : 'disconnected');
      if (data.apiKey.connected) {
        setApiKeyStatus('connected');
        setMaskedKey(data.apiKey.maskedKey ?? '');
      }
      if (data.model) setModel(data.model);
    } catch {
      /* status endpoint unavailable */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchStatus]);

  const startDeviceFlow = async () => {
    setOauthStatus('polling');
    try {
      const res = await fetch('/api/ai/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'device_code' }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const flow: DeviceFlow = {
        userCode: data.userCode,
        verificationUrl: data.verificationUrl,
        deviceAuthId: data.deviceAuthId,
      };
      setDeviceFlow(flow);
      pollForToken(flow);
    } catch {
      setOauthStatus('disconnected');
    }
  };

  const pollForToken = (flow: DeviceFlow) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/ai/poll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceAuthId: flow.deviceAuthId, userCode: flow.userCode }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'connected') {
          setOauthStatus('connected');
          setDeviceFlow(null);
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (data.status === 'error') {
          setOauthStatus('disconnected');
          setDeviceFlow(null);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        /* retry next tick */
      }
    }, 5000);
    setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
    }, 300_000);
  };

  const disconnectOauth = async () => {
    await fetch('/api/ai/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'device_code' }),
    });
    setOauthStatus('disconnected');
    setDeviceFlow(null);
  };

  const connectApiKey = async () => {
    if (!apiKey.trim()) return;
    setApiKeyStatus('polling');
    try {
      const res = await fetch('/api/ai/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: 'api_key', provider: 'openai', key: apiKey }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setApiKeyStatus('connected');
      setMaskedKey(data.maskedKey ?? apiKey.slice(0, 3) + '...' + apiKey.slice(-4));
      setApiKey('');
    } catch {
      setApiKeyStatus('disconnected');
    }
  };

  const disconnectApiKey = async () => {
    await fetch('/api/ai/disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method: 'api_key' }),
    });
    setApiKeyStatus('disconnected');
    setMaskedKey('');
  };

  const saveModel = async (value: string) => {
    setModel(value);
    await fetch('/api/ai/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: value }),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <FiLoader className="w-5 h-5 text-[var(--text-muted)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-xl space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
            AI Connections
          </h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Connect your AI provider to power Nor and intelligent features.
          </p>
        </div>

        <OAuthCard
          status={oauthStatus}
          deviceFlow={deviceFlow}
          onConnect={startDeviceFlow}
          onDisconnect={disconnectOauth}
        />

        <ApiKeyCard
          status={apiKeyStatus}
          maskedKey={maskedKey}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          onConnect={connectApiKey}
          onDisconnect={disconnectApiKey}
        />

        <ModelCard model={model} onSave={saveModel} />
      </div>
    </div>
  );
}
