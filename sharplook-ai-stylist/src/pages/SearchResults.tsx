import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import OutfitCard from "@/components/OutfitCard";
import { searchProducts, Product } from "@/api/client";

const filters = ["Все", "Верх", "Низ", "Обувь", "Платья", "Аксессуары"];

function pluralize(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState("Все");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusQuery, setStatusQuery] = useState(initialQuery);

  const doSearch = async (q: string) => {
    const clean = q.trim();
    setQuery(q);
    if (!clean) {
      setResults([]);
      setSearched(false);
      setStatusQuery("");
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setStatusQuery(clean);
    setResults([]); // очищаем старые карточки, чтобы не «залипали»

    try {
      const items = await searchProducts(clean);
      setResults(items);
    } catch (err: any) {
      setResults([]);
      setError(err?.message || "Не удалось выполнить поиск");
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  // Запуск при загрузке/смене ?q
  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery) {
      doSearch(initialQuery);
    } else {
      setResults([]);
      setSearched(false);
      setStatusQuery("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const displayed = useMemo(() => {
    if (activeFilter === "Все") return results;
    return results.filter((r) =>
      r.category?.toLowerCase().includes(activeFilter.toLowerCase()),
    );
  }, [activeFilter, results]);

  const statusText = (() => {
    if (loading) return "Ищем…";
    if (error) return error;
    if (searched && statusQuery) {
      const word = pluralize(displayed.length, "вещь", "вещи", "вещей");
      return `Найдено ${displayed.length} ${word} по запросу «${statusQuery}»`;
    }
    return "Введите запрос, чтобы начать поиск";
  })();

  return (
    <div className="py-10">
      <div className="container">
        {/* Поисковая строка */}
        <form onSubmit={handleSubmit} className="mb-6 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Опиши, что ищешь…"
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button type="submit" className="gradient-cta rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground">
            Найти
          </button>
        </form>

        {/* Фильтры */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Статус */}
        <p className="mb-6 text-sm text-muted-foreground">{statusText}</p>

        {/* Ошибка */}
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        {/* Результаты / лоадер */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayed.map((r) => (
              <OutfitCard
                key={r.id}
                id={r.id}
                image={r.image_path}
                title={r.title}
                description={r.description}
                price={r.price}
                is_favorite={r.is_favorite}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
