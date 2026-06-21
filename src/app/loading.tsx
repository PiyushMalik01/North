export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background-primary)',
      }}
    >
      <span
        style={{
          fontSize: '0.875rem',
          letterSpacing: '0.1em',
          textTransform: 'lowercase',
          color: 'var(--text-muted, var(--text-secondary))',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      >
        loading
        <span style={{ display: 'inline-block', width: '1.5ch' }}>…</span>
      </span>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
