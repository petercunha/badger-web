import Link from "next/link";

export default function Dashboard() {
  return (
    <main style={{ padding: "6rem" }}>
      <p>Welcome to the dashboard!</p>
      <Link href="/api/auth/logout">Logout</Link>
    </main>
  );
}
