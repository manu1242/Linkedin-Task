const Post = require("../Model/PostModel");

// Feed: Get all posts
const Feed = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("Author", "name avatar UserType")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create Post
const createPost = async (req, res) => {
  try {
    const images = req.files?.map((image) => `/uploads/${image.filename}`) || [];
    const { content, PostType } = req.body;

    const newPost = await Post.create({
      Author: req.User._id,
      content,
      PostType,
      images,
    });

    res.json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Post
const updatePost = async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!existingPost.Author.equals(req.User._id)) {
      return res.status(403).json({ message: "You are not the post owner" });
    }

    Object.assign(existingPost, req.body);
    await existingPost.save();

    res.json(existingPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!existingPost.Author.equals(req.User._id) && req.user.UserType !== "ADMIN") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await existingPost.remove();
    res.status(200).json({ message: "Post successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like or Unlike Post
const likePost = async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const idx = existingPost.likes.findIndex((id) => id.equals(req.User._id));
    if (idx === -1) {
      existingPost.likes.push(req.User._id);
    } else {
      existingPost.likes.splice(idx, 1);
    }

    await existingPost.save();
    res.status(200).json({ likeCount: existingPost.likes.length, liked: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Comment on Post
const commentPost = async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      User: req.User._id,
      text: req.body.text, 
      createdAt: new Date(),
    };

    existingPost.comments.push(comment);
    await existingPost.save();

    res.json(existingPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Share Post
const sharePost = async (req, res) => {
  try {
    const existingPost = await Post.findById(req.params.postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Initialize shares if null or not an array
    if (!Array.isArray(existingPost.shares)) {
      existingPost.shares = [];
    }

    if (existingPost.shares.includes(req.User._id)) {
      return res.status(400).json({ message: "Already shared this post" });
    }

    existingPost.shares.push(req.User._id);
    await existingPost.save();

    res.status(200).json({ message: "Post shared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  Feed,
  createPost,
  updatePost,
  deletePost,
  likePost,
  commentPost,
  sharePost,
};
