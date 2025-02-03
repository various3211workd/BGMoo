import { Button } from "./ui/button";
import { DownloadIcon } from "lucide-react";

export function Download({ t }) {
  return (
    <section
      id="download"
      className="py-20 bg-bgmoo-darkGray text-bgmoo-beige text-center"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t.title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{t.description}</p>
        <Button
          asChild
          className="bg-bgmoo-brown hover:bg-bgmoo-darkGreen text-bgmoo-beige text-lg py-2 px-6"
        >
          <a href="#" target="_blank" rel="noopener noreferrer">
            {t.cta} <DownloadIcon className="ml-2" />
          </a>
        </Button>
      </div>
    </section>
  );
}
