const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.status === 204 ? (undefined as T) : res.json();
}

export const listPosts = () => request<Post[]>("/posts");

export const createPost = (title: string, body: string) =>
  request<Post>("/posts", { method: "POST", body: JSON.stringify({ title, body }) });

export const updatePost = (id: number, title: string, body: string) =>
  request<Post>(`/posts/${id}`, { method: "PATCH", body: JSON.stringify({ title, body }) });

export const deletePost = (id: number) =>
  request<void>(`/posts/${id}`, { method: "DELETE" });
