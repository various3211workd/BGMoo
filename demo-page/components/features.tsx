import { Music, Book, Brain } from "lucide-react";

const icons = [Music, Book, Brain];

export function Features({ t }) {
  return (
    <section
      id="features"
      className="py-20 bg-bgmoo-darkGreen text-bgmoo-beige"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.items.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div key={index} className="text-center">
                <Icon className="w-12 h-12 mb-4 text-bgmoo-brown mx-auto" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
