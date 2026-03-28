import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { login as apiLogin, register as apiRegister } from "@/api/client";
import { toast } from "sonner";

const Auth = () => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      saveToken(res.access_token);
      toast.success("Вы вошли в аккаунт");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast.error("Примите условия использования");
      return;
    }
    setLoading(true);
    try {
      const res = await apiRegister(email, password);
      saveToken(res.access_token);
      toast.success("Регистрация прошла успешно");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16">
      <div className="container flex flex-col items-start gap-12 md:flex-row">
        <div className="w-full max-w-md">
          <div className="mb-6 flex gap-4 border-b border-border">
            <button
              onClick={() => setTab("login")}
              className={`pb-3 text-sm font-semibold transition-colors ${
                tab === "login" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setTab("register")}
              className={`pb-3 text-sm font-semibold transition-colors ${
                tab === "register" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"
              }`}
            >
              Регистрация
            </button>
          </div>

          {tab === "login" ? (
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="you@email.com" required />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Пароль</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" required />
              </label>
              <button type="submit" disabled={loading} className="gradient-cta mt-2 rounded-lg py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                {loading ? "Входим…" : "Войти"}
              </button>
            </form>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleRegister}>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Имя</span>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Как вас зовут?" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="you@email.com" required />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">Пароль</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Минимум 8 символов" required />
              </label>
              <label className="flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 rounded border-border" />
                Соглашаюсь с условиями использования и политикой конфиденциальности
              </label>
              <button type="submit" disabled={loading} className="gradient-cta mt-2 rounded-lg py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                {loading ? "Регистрируем…" : "Зарегистрироваться"}
              </button>
            </form>
          )}
        </div>

        <div className="w-full max-w-sm rounded-xl bg-accent/30 p-8">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Зачем аккаунт?</h3>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              Сохраняй понравившиеся вещи в избранное
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              Сохраняй историю поисковых запросов
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
              Получай доступ к новым функциям первым
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Auth;
