import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer({ t }) {
  return (
    <footer className="bg-bgmoo-darkGreen text-bgmoo-beige py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>{t.copyright}</p>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="#"
                  className="hover:text-bgmoo-brown transition-colors"
                >
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-bgmoo-brown transition-colors"
                >
                  {t.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-bgmoo-brown transition-colors"
                >
                  {t.contact}
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bgmoo-brown transition-colors"
            >
              <Github size={24} />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-bgmoo-brown transition-colors"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
