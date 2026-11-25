import { useEffect, useState } from "react";
import { type Post, listPosts, createPost, updatePost, deletePost } from "./api";

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setPosts(await listPosts());
      setError("");
    } catch (err) {
      setError(String(err));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    try {
      if (editingId !== null) await updatePost(editingId, title, body);
      else await createPost(title, body);
      setTitle("");
      setBody("");
      setEditingId(null);
      await load();
    } catch (err) {
      setError(String(err));
    }
  };

  const startEdit = (p: Post) => {
    setEditingId(p.id);
    setTitle(p.title);
    setBody(p.body);
  };

  const remove = async (id: number) => {
    try {
      await deletePost(id);
      await load();
    } catch (err) {
      setError(String(err));
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>Posts</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={submit} style={{ display: "grid", gap: 8, marginBottom: 24 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body" required />
        <div>
          <button type="submit">{editingId !== null ? "Save changes" : "Create post"}</button>
          {editingId !== null && (
            <button type="button" onClick={() => { setEditingId(null); setTitle(""); setBody(""); }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {posts.map((p) => (
        <article key={p.id} style={{ borderBottom: "1px solid #ccc", padding: "12px 0" }}>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
          <button onClick={() => startEdit(p)}>Edit</button>
          <button onClick={() => remove(p.id)}>Delete</button>
        </article>
      ))}
    </main>
  );
}
