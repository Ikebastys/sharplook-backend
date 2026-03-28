import { Heart } from "lucide-react";
import { useState } from "react";
import { toggleFavorite, logClick, getImageUrl } from "@/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface OutfitCardProps {
  id?: number;
  image: string;
  title: string;
  description?: string;
  badge?: string;
  date?: string;
  price?: number;
  is_favorite?: boolean;
  onRemove?: () => void;
  onFavoriteChanged?: (id: number, isFav: boolean) => void;
}

const OutfitCard = ({
  id,
  image,
  title,
  description,
  badge,
  date,
  price,
  is_favorite,
  onRemove,
  onFavoriteChanged,
}: OutfitCardProps) => {
  const { isLoggedIn } = useAuth();
  const [liked, setLiked] = useState(is_favorite ?? false);
  const [toggling, setToggling] = useState(false);

  const imgSrc = image.startsWith("http") || image.startsWith("/") || image.startsWith("data:")
    ? image
    : getImageUrl(image);

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onRemove) {
      onRemove();
      return;
    }

    if (!isLoggedIn) {
      toast.info("Войдите, чтобы сохранять вещи в избранное");
      return;
    }

    if (!id || toggling) return;

    setToggling(true);
    try {
      const res = await toggleFavorite(id);
      setLiked(res.is_favorite);
      onFavoriteChanged?.(id, res.is_favorite);
    } catch {
      toast.error("Не удалось обновить избранное");
    } finally {
      setToggling(false);
    }
  };

  const handleCardClick = () => {
    if (id) logClick(id);
  };

  return (
    <div
      className="group animate-fade-in overflow-hidden rounded-lg bg-card shadow-sm transition-shadow duration-300 hover:shadow-md cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {badge && (
          <span className="gradient-cta absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium text-primary-foreground">
            ✦ {badge}
          </span>
        )}
        <button
          onClick={handleHeartClick}
          disabled={toggling}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 backdrop-blur-sm transition-colors hover:bg-background"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${liked || onRemove ? "fill-primary text-primary" : "text-foreground"}`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
        {price != null && (
          <p className="mt-1 text-sm font-semibold text-foreground">{price.toLocaleString("ru-RU")} ₽</p>
        )}
        {date && <p className="mt-1 text-xs text-muted-foreground">Добавлено {date}</p>}
      </div>
    </div>
  );
};

export default OutfitCard;
