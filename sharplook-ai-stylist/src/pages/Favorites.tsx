import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import OutfitCard from "@/components/OutfitCard";
import { getFavorites, Product } from "@/api/client";
import { useAuth } from "@/contexts/AuthContext";
import mascot from "@/assets/mascot-leopard.png";

const Favorites = () => {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    getFavorites()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="py-12">
        <div className="container flex flex-col items-center rounded-xl bg-accent/20 py-16">
          <img src={mascot} alt="Snow leopard mascot" className="mb-6 h-32 w-32 object-contain" loading="lazy" />
          <p className="text-base font-medium text-foreground">Войдите, чтобы видеть избранное</p>
          <Link to="/auth" className="gradient-cta mt-4 rounded-lg px-6 py-2.5 text-sm font-semibold text-primary-foreground">
            Войти
          </Link>
        </div>
      </div>
    );
  }

  const handleRemoved = (id: number) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="py-12">
      <div className="container">
        <h1 className="mb-2 text-3xl font-semibold text-foreground">Избранное</h1>
        <p className="mb-8 text-sm text-muted-foreground">Сохранённые вещи из поиска</p>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-muted aspect-[3/4]" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <OutfitCard
                key={item.id}
                id={item.id}
                image={item.image_path}
                title={item.title}
                description={item.description}
                price={item.price}
                is_favorite={true}
                onFavoriteChanged={(id, isFav) => {
                  if (!isFav) handleRemoved(id);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center rounded-xl bg-accent/20 py-16">
            <img src={mascot} alt="Snow leopard mascot" className="mb-6 h-32 w-32 object-contain" loading="lazy" />
            <p className="text-base font-medium text-foreground">Здесь пока пусто</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Добавляй понравившиеся вещи из поиска
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
