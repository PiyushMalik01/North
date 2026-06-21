import Link from 'next/link';

export default function NotFound() {
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
      <p
        style={{
          fontSize: '0.75rem',
          fontFamily: 'var(--font-oswald)',
          fontWeight: 500,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          marginBottom: '1.25rem',
        }}
      >
        404
      </p>

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
        lost in the cold
      </h1>

      <p
        style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          maxWidth: '36ch',
          marginBottom: '2.5rem',
        }}
      >
        this page isn&apos;t on the map. it may have moved, been removed, or never existed.
      </p>

      <Link
        href="/"
        style={{
          display: 'inline-block',
          padding: '0.75rem 2rem',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-oswald)',
          fontWeight: 600,
          textTransform: 'lowercase',
          letterSpacing: '0.05em',
          textDecoration: 'none',
          backgroundColor: 'var(--text-primary)',
          color: 'var(--background-primary)',
          border: '3px solid var(--text-primary)',
          boxShadow: '4px 4px 0px var(--text-secondary)',
        }}
      >
        go home
      </Link>
    </div>
  );
}
