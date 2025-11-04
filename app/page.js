import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f6f8fb 0%, #e9eef7 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: 800,
        width: '100%',
        background: 'white',
        borderRadius: 12,
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.06)'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome</h1>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
          Vendors can submit their resource lists, expected budget range, optional CV, and rate card.
        </p>
        <Link href="/vendors" style={{
          display: 'inline-block',
          backgroundColor: '#111827',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: 8,
          textDecoration: 'none'
        }}>Go to Vendor Submission</Link>
      </div>
    </main>
  );
}
