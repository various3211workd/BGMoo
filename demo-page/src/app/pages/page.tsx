import Link from "next/link";
import { BookOpen, Award, TrendingUp } from "lucide-react";
import Footer from "./[id]/footer";
import Header from "./[id]/header";

export default function HomePage() {
  const topNovels = [
    { id: 1, title: "星影の旅人", author: "月野 光", link: "/pages/0" },
    {
      id: 2,
      title: "霧に閉ざされた館",
      author: "風間 翔太",
      link: "/pages/2",
    },
    {
      id: 3,
      title: "星詠みの指輪と失われた王国の秘宝",
      author: "緑川 葉子",
      link: "/pages/1",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-peach to-dusty-rose">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-deep-purple mb-4">
            想像力の扉を開こう
          </h2>
          <p className="text-xl text-taupe mb-8">
            最高の物語があなたを待っています
          </p>
          <Link
            href="/explore"
            className="bg-deep-purple text-peach px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300"
          >
            小説を探す
          </Link>
        </section>

        <section className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 mb-16">
          <h3 className="text-2xl font-bold text-deep-purple mb-6 flex items-center">
            <Award className="mr-2" />
            人気ランキング
          </h3>
          <div className="space-y-6">
            {topNovels.map((novel, index) => (
              <div key={novel.id} className="flex items-center">
                <span
                  className={`text-2xl font-bold mr-4 ${
                    index === 0
                      ? "text-deep-purple"
                      : index === 1
                      ? "text-taupe"
                      : "text-dusty-rose"
                  }`}
                >
                  {index + 1}
                </span>
                <div>
                  <Link
                    href={novel.link}
                    className="text-lg font-semibold text-deep-purple hover:underline"
                  >
                    {novel.title}
                  </Link>
                  <p className="text-sm text-taupe">{novel.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-deep-purple mb-4 flex items-center">
              <BookOpen className="mr-2" />
              最新の投稿
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-taupe hover:text-deep-purple hover:underline"
                >
                  夢見る少女の冒険
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-taupe hover:text-deep-purple hover:underline"
                >
                  月光のセレナーデ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-taupe hover:text-deep-purple hover:underline"
                >
                  闇の中の光
                </Link>
              </li>
            </ul>
          </div>
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-deep-purple mb-4 flex items-center">
              <TrendingUp className="mr-2" />
              トレンド
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-taupe hover:text-deep-purple hover:underline"
                >
                  ファンタジー
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-taupe hover:text-deep-purple hover:underline"
                >
                  ミステリー
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-taupe hover:text-deep-purple hover:underline"
                >
                  ロマンス
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
