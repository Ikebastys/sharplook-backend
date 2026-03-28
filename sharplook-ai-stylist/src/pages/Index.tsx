import { Search, Cpu, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import heroImg from "@/assets/hero-fashion.jpg";

const placeholders = [
  "джинсы straight для офиса",
  "чёрные кроссовки без ярких логотипов",
  "платье миди на свидание",
  "белая рубашка oversize из хлопка",
  "тёплый свитер крупной вязки до 5 000 ₽",
];

const steps = [
  { icon: Search, title: "Опиши, что ищешь", text: "Напиши запрос своими словами — как рассказал бы другу" },
  { icon: Cpu, title: "Поиск под капотом", text: "Алгоритм понимает смысл запроса и находит подходящие вещи из каталога" },
  { icon: Heart, title: "Сохрани понравившееся", text: "Добавляй вещи в избранное, чтобы вернуться к ним позже" },
];

const Index = () => {
  const [query, setQuery] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="container relative z-10 flex flex-col items-center gap-8 md:flex-row md:gap-16">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
              Умный поиск одежды<br />
              <span className="font-semibold">из разных магазинов</span>
            </h1>
            <p className="mt-4 max-w-md text-base text-muted-foreground">
              Пиши, что ищешь, своими словами — мы подберём подходящие вещи из каталога.
            </p>
            <div className="mt-8 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={placeholders[placeholderIdx]}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <button
                onClick={handleSearch}
                className="gradient-cta whitespace-nowrap rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Найти
              </button>
            </div>
          </div>
          <div className="hidden w-80 flex-shrink-0 md:block lg:w-96">
            <img
              src={heroImg}
              alt="Fashion hero"
              className="rounded-2xl shadow-lg"
              width={384}
              height={384}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-10 text-center text-2xl font-semibold text-foreground">Как это работает</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center rounded-lg bg-card p-8 text-center shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
