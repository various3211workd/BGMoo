import { Header } from "../../../components/header";
import { Hero } from "../../../components/hero";
import { Features } from "../../../components/features";
import { TargetUsers } from "../../../components/target-users";
import { Download } from "../../../components/download";
import { Footer } from "../../../components/footer";
import { en } from "../../../components/lib/i18n/en";
import { ja } from "../../../components/lib/i18n/ja";

export default function Home({
  params: { lang },
}: {
  params: { lang: string };
}) {
  const t = lang === "ja" ? ja : en;

  return (
    <div className="min-h-screen bg-bgmoo-beige text-bgmoo-darkGreen">
      <Header t={t.header} lang={lang} />
      <main>
        <Hero t={t.hero} />
        <Features t={t.features} />
        <TargetUsers t={t.targetUsers} />
        <Download t={t.download} />
      </main>
      <Footer t={t.footer} />
    </div>
  );
}
