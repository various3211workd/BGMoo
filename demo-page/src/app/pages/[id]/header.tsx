import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-deep-purple text-peach shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">
          <Link href="/pages">ウェブ小説サイト</Link>
        </h1>
      </nav>
    </header>
  );
}
