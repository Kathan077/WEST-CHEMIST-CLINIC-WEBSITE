import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: '100px 5%', textAlign: 'center' }}>
      <h2>Page Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
        Return Home
      </Link>
    </div>
  );
}
