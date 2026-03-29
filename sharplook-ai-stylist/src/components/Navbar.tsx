import { Heart, Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, isAdmin, logout } = useAuth();

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      location.pathname === path ? "text-primary" : "text-muted-foreground"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
          Sharp<span className="text-primary">Look</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/about" className={linkClass("/about")}>
            О проекте
          </Link>
          <Link to="/favorites" className={linkClass("/favorites")}>
            <span className="flex items-center gap-1.5">
              <Heart className="h-4 w-4" /> Избранное
            </span>
          </Link>
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link to="/admin" className={linkClass("/admin")}>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Admin
                  </span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/80"
              >
                <LogOut className="h-4 w-4" /> Выйти
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Войти
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link to="/about" className={linkClass("/about")} onClick={() => setMobileOpen(false)}>
              О проекте
            </Link>
            <Link
              to="/favorites"
              className={linkClass("/favorites")}
              onClick={() => setMobileOpen(false)}
            >
              Избранное
            </Link>
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className={linkClass("/admin")} onClick={() => setMobileOpen(false)}>
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="text-left text-sm font-medium text-muted-foreground"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="gradient-cta rounded-lg px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                onClick={() => setMobileOpen(false)}
              >
                Войти
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
