'use client';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background-primary)',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-oswald)',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 700,
          textTransform: 'lowercase',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          lineHeight: 1.1,
        }}
      >
        something drifted off course
      </h1>

      <p
        style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          maxWidth: '36ch',
          marginBottom: '0.5rem',
        }}
      >
        an unexpected error occurred. it&apos;s not you — we lost the signal.
      </p>

      {error.digest && (
        <p
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            fontFamily: 'monospace',
            marginBottom: '2rem',
            opacity: 0.6,
          }}
        >
          digest: {error.digest}
        </p>
      )}

      <button
        onClick={reset}
        style={{
          marginTop: error.digest ? 0 : '2rem',
          padding: '0.75rem 2rem',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-oswald)',
          fontWeight: 600,
          textTransform: 'lowercase',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          backgroundColor: 'var(--text-primary)',
          color: 'var(--background-primary)',
          border: '3px solid var(--text-primary)',
          boxShadow: '4px 4px 0px var(--text-secondary)',
          transition: 'box-shadow 0.15s ease, transform 0.15s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0px var(--text-secondary)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translate(2px, 2px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '4px 4px 0px var(--text-secondary)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'translate(0, 0)';
        }}
      >
        try again
      </button>
    </div>
  );
}
