const BASE_URLS = ["http://localhost:8000", "http://127.0.0.1:8000"];

export function getBaseUrl() {
  return BASE_URLS[0];
}

function getToken(): string | null {
  return localStorage.getItem("access_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let lastErr: unknown;
  for (const base of BASE_URLS) {
    const url = `${base}${path}`;
    try {
      const res = await fetch(url, { ...options, headers, mode: "cors" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `API error ${res.status}`);
      }
      return res.json();
    } catch (err) {
      console.error("API request failed", { url, err });
      lastErr = err;
      // пробуем следующий base-url (например, если localhost резолвится в IPv6)
      continue;
    }
  }
  throw lastErr || new Error("API request failed");
}

/* --- Types --- */

export interface Product {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  image_path: string;
  price: number;
  category: string;
  color: string;
  is_favorite: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  email: string;
  is_admin: boolean;
}

export interface ToggleFavoriteResponse {
  product_id: number;
  is_favorite: boolean;
}

interface SearchResponse {
  items: Product[];
}

/* --- Endpoints --- */

export function searchProducts(query: string, limit = 12) {
  return request<SearchResponse>("/v1/search/text", {
    method: "POST",
    body: JSON.stringify({ query, limit }),
  }).then((res) => res.items || []);
}

export function register(email: string, password: string) {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function toggleFavorite(productId: number) {
  return request<ToggleFavoriteResponse>("/v1/favorites/toggle", {
    method: "POST",
    body: JSON.stringify({ product_id: productId }),
  });
}

export function getFavorites() {
  return request<Product[]>("/v1/favorites/list");
}

export function logClick(productId: number) {
  // Fire-and-forget
  request("/v1/events/click", {
    method: "POST",
    body: JSON.stringify({ product_id: productId }),
  }).catch(() => {});
}

export function getMe() {
  return request<UserProfile>("/v1/me");
}

export function getImageUrl(imagePath: string) {
  if (!imagePath) return "/placeholder.svg";
  if (imagePath.startsWith("http")) return imagePath;
  // относительные пути указывают на отсутствующие локальные файлы — показываем плейсхолдер
  return "/placeholder.svg";
}
