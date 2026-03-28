import { Search, Cpu, ShieldCheck, Layers } from "lucide-react";
import mascot from "@/assets/mascot-leopard.png";

const features = [
  { icon: Search, title: "Поиск своими словами", text: "Опиши вещь так, как расскажешь другу — алгоритм поймёт" },
  { icon: Cpu, title: "Семантический поиск", text: "Ищем по смыслу, а не по точным ключевым словам" },
  { icon: Layers, title: "Разные магазины", text: "Товары из нескольких каталогов в одном месте" },
  { icon: ShieldCheck, title: "Избранное", text: "Сохраняй понравившиеся вещи и возвращайся к ним" },
];

const futurePlans = [
  "Подбор готовых образов и сочетаний",
  "Поиск по картинке",
  "Персональные рекомендации на основе предпочтений",
  "Больше магазинов и категорий",
];

const About = () => (
  <div className="py-16">
    <div className="container">
      {/* Header */}
      <div className="mb-16 flex flex-col items-center gap-10 md:flex-row md:items-start">
        <div className="flex-1">
          <h1 className="mb-4 text-3xl font-light text-foreground md:text-4xl">
            Sharp<span className="text-primary font-semibold">Look</span> — умный поиск одежды
          </h1>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            SharpLook — это сервис, который помогает искать одежду по сложным текстовым запросам. Вместо фильтров и бесконечного скроллинга каталогов — опиши, что тебе нужно, своими словами, и получи подходящие товары из разных магазинов.
          </p>
          <p className="mb-4 text-base leading-relaxed text-muted-foreground">
            Сейчас проект на стадии MVP: мы тестируем качество семантического поиска по каталогу вещей и собираем обратную связь.
          </p>
        </div>
        <div className="flex-shrink-0">
          <img
            src={mascot}
            alt="SharpLook snow leopard mascot"
            className="h-56 w-56 object-contain drop-shadow-lg md:h-64 md:w-64"
            loading="lazy"
          />
        </div>
      </div>

      {/* Features */}
      <h2 className="mb-8 text-center text-2xl font-semibold text-foreground">Что умеет MVP сейчас</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div key={i} className="rounded-lg bg-card p-6 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">{f.title}</h3>
            <p className="text-xs text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </div>

      {/* Future plans */}
      <div className="mt-16 mx-auto max-w-lg rounded-xl bg-accent/20 p-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground text-center">Планы на будущее</h2>
        <ul className="flex flex-col gap-2.5">
          {futurePlans.map((plan, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              {plan}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default About;
