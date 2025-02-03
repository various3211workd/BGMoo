import Link from "next/link";
import { Music } from "lucide-react";
import { Button } from "./ui/button";

export function Header({ t, lang }: { t: any; lang: string }) {
  const toggleLang = lang === "en" ? "ja" : "en";

  return (
    <header className="bg-bgmoo-darkGray text-bgmoo-beige py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href={`/${lang}`} className="flex items-center space-x-2">
          <Music size={24} />
          <span className="text-xl font-bold">BGMoo</span>
        </Link>
        <nav className="flex items-center">
          <ul className="flex space-x-4 mr-4">
            <li>
              <Link
                href="#features"
                className="hover:text-bgmoo-brown transition-colors"
              >
                {t.features}
              </Link>
            </li>
            <li>
              <Link
                href="#target-users"
                className="hover:text-bgmoo-brown transition-colors"
              >
                {t.whoItsFor}
              </Link>
            </li>
            <li>
              <Link
                href="#download"
                className="hover:text-bgmoo-brown transition-colors"
              >
                {t.download}
              </Link>
            </li>
          </ul>
          <Button asChild variant="outline" size="sm">
            <Link href={`/${toggleLang}`}>
              {toggleLang === "en" ? "English" : "日本語"}
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
