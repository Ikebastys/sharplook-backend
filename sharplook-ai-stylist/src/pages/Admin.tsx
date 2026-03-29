import { getBaseUrl } from "@/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { isLoggedIn, isAdmin, token } = useAuth();

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // передаём токен через query-параметр, чтобы iframe авторизовался
  const adminUrl = `${getBaseUrl()}/admin/stats?token=${encodeURIComponent(token || "")}`;

  return (
    <div className="flex flex-1 flex-col">
      <div className="container py-4">
        <h1 className="text-xl font-semibold text-foreground">Панель администратора</h1>
        <p className="text-sm text-muted-foreground">Метрики и статистика SharpLook</p>
      </div>
      <iframe
        src={adminUrl}
        className="flex-1 border-t border-border"
        style={{ minHeight: "calc(100vh - 200px)" }}
        title="Admin Stats"
      />
    </div>
  );
};

export default Admin;
