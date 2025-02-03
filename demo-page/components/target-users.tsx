import { Users, BookOpen, Sparkles, Heart } from "lucide-react";

const icons = [Sparkles, BookOpen, Heart, Users];

export function TargetUsers({ t }) {
  return (
    <section id="target-users" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-bgmoo-darkGray mb-12">
          {t.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {t.items.map((text, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-md"
              >
                <Icon className="w-8 h-8 text-bgmoo-brown" />
                <p className="text-lg">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
