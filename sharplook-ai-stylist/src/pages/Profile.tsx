import { useState } from "react";

const styles = ["Casual", "Office", "Sport", "Минимализм", "Вечерний", "Streetwear"];
const budgets = ["до 5 000 ₽", "5 000 – 15 000 ₽", "15 000 – 30 000 ₽", "от 30 000 ₽"];

const Profile = () => {
  const [selectedStyles, setSelectedStyles] = useState<string[]>(["Casual"]);
  const [budget, setBudget] = useState(budgets[1]);

  const toggleStyle = (s: string) =>
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  return (
    <div className="py-12">
      <div className="container max-w-lg">
        <h1 className="mb-2 text-2xl font-semibold text-foreground">Настройки стиля</h1>
        <p className="mb-8 text-sm text-muted-foreground">Расскажи о своих предпочтениях — поиск будет точнее</p>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Стили, которые нравятся</h2>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => toggleStyle(s)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedStyles.includes(s)
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Примерный бюджет на вещь</h2>
          <div className="flex flex-wrap gap-2">
            {budgets.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  budget === b
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <button className="gradient-cta w-full rounded-lg py-2.5 text-sm font-semibold text-primary-foreground">
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default Profile;
