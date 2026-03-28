const BASE_URL = "http://localhost:8000";

export function getBaseUrl() {
  return BASE_URL;
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

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API error ${res.status}`);
  }

  return res.json();
}

/* --- Types --- */

export interface Product {
  id: number;
  title: string;
  description: string;
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

export function getImageUrl(imagePath: string) {
  if (imagePath.startsWith("http")) return imagePath;
  return `${BASE_URL}/${imagePath}`;
}
