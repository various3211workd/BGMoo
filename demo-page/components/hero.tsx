import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

export function Hero({ t }) {
  return (
    <section className="py-20 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-bgmoo-darkGray mb-6">
          {t.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          {t.description}
        </p>
        <Button
          asChild
          className="bg-bgmoo-brown hover:bg-bgmoo-darkGreen text-bgmoo-beige text-lg py-2 px-6"
        >
          <Link href="/pages">
            {t.cta} <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
