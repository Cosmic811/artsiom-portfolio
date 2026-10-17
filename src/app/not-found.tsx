import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <span className="footer-monogram">am.</span>
      <h1>This screen is off the map.</h1>
      <Link href="/">Return to the portfolio ↗</Link>
    </main>
  );
}
