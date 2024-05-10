const Post = require("../Models/Post");
const jsonwebtoken = require("jsonwebtoken");

module.exports = {
  async createPost(req, res) {
    const { title, description } = req.body;
    const file = req.file;

    const picture = file ? file.path : "";
    // get user of token auth
    const { authorization } = req.headers;

    // console.log(req);
    const token = authorization;

    // get user of token
    const user = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    try {
      const post = await Post.create({
        title,
        description,
        user: user.id,
        picture,
      });

      await post.save();
      res.status(200).json({
        message: "Post created successfully",
        data: post,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async getPosts(req, res) {
    try {
      const posts = await Post.find().populate("user", "-password -posts");
      res.status(200).json({
        message: "Posts retrieved successfully",
        data: posts,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async deletePost(req, res) {
    const { id } = req.params;
    const { user } = req;

    try {
      const post = await Post.findById(id);

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.user.toString() !== user._id.toString()) {
        throw new Error("You are not allowed to delete this post");
      }

      await Post.findByIdAndDelete(id);
      res.status(200).json({
        message: "Post deleted successfully",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async getUserPosts(req, res) {
    const { id } = req.params;

    try {
      const posts = await Post.find({ user: id }).populate(
        "user",
        "-password -posts"
      );
      res.status(200).json({
        message: "User posts retrieved successfully",
        data: posts,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async getPost(req, res) {
    const { id } = req.params;

    try {
      const post = await Post.findById(id).populate("user", "-password -posts");

      if (!post) {
        throw new Error("Post not found");
      }

      res.status(200).json({
        message: "Post retrieved successfully",
        data: post,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async updatePost(req, res) {
    const { id } = req.params;
    const { user } = req;
    const { title, description } = req.body;

    try {
      const post = await Post.findById(id);

      if (!post) {
        throw new Error("Post not found");
      }

      if (post.user.toString() !== user._id.toString()) {
        throw new Error("You are not allowed to update this post");
      }

      post.title = title;
      post.description = description;

      await post.save();
      res.status(200).json({
        message: "Post updated successfully",
        data: post,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
