import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import api from "../Api/axios";

export default function PostCard({ post, reload }) {
  const [comment, setComment] = useState("");

  const like = async () => {
    await api.post(`/posts/${post._id}/like`);
    reload();
  };

  const share = async () => {
    await api.post(`/posts/${post._id}/share`);
    reload();
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/posts/${post._id}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      reload();
    } catch (err) {
      console.error("Error adding comment:", err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      {/* Author */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={post?.Author?.avatar || "/default-avatar.png"} // Use optional chaining here
          alt="avatar"
          className="w-10 h-10 rounded-full border"
        />
        <div>
          <div className="font-semibold">{post.Author.Name}</div>
          <div className="text-xs text-gray-500">{post.postType}</div>
        </div>
      </div>

      {/* Content */}
      <p className="mb-2">{post.content}</p>
      {post.images?.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {post.images.map((img) => (
            <img
              key={img}
              src={img}
              alt="post"
              className="w-full h-32 object-cover rounded"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-6 mt-3 text-sm">
        <button onClick={like} className="flex items-center gap-1">
          <ThumbsUp size={16} /> {post.likes?.length || 0}
        </button>
        <button className="flex items-center gap-1">
          <MessageCircle size={16} /> {post.comments?.length || 0}
        </button>
        <button onClick={share} className="flex items-center gap-1">
          <Share2 size={16} /> {post.shares?.length || 0}
        </button>
      </div>

      {/* Comments */}
      <div className="mt-3">
        {post.comments?.map((c) => (
          <div key={c._id} className="border-t py-2 text-sm">
            <strong>{c.User?.name || "User"}:</strong> {c.text}
          </div>
        ))}

        <form onSubmit={addComment} className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-1 border p-2 rounded text-sm"
          />
          <button type="submit" className="bg-gray-200 px-3 rounded text-sm">
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
