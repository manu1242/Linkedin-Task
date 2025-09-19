import { useEffect, useState } from "react";
import api from "../../Api/axios";
import PostCard from "../../components/PostCard";
import { Send } from "lucide-react";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("GENERAL");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/posts/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error loading feed:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Post content is required!");
      return;
    }
    const form = new FormData();
    form.append("content", content);
    form.append("PostType", postType); 

    files.forEach((f) => form.append("images", f));
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.post("/posts", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts([res.data, ...posts]);
      setContent("");
      setFiles([]);
      setPostType("GENERAL");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={submit} className="bg-white shadow rounded p-4 mb-6">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex gap-3 mt-3">
          <select
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="GENERAL">General</option>
            <option value="BUSINESS_UPDATE">Business Update</option>
            <option value="ACHIEVEMENT">Achievement</option>
            <option value="JOB_POSTING">Job Posting</option>
          </select>

          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 rounded flex items-center gap-1 disabled:opacity-50"
          >
            <Send size={16} /> {loading ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
      <div className="space-y-4">
        {posts.length === 0 && (
          <p className="text-gray-500 text-center">No posts yet</p>
        )}
        {posts.map((p) => (
          <PostCard key={p._id} post={p} reload={load} />
        ))}
      </div>
    </div>
  );
}
