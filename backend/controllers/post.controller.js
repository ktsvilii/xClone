import { v2 as cloudinary } from 'cloudinary';

import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';
import Post from '../models/post.model.js';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'user', select: '-password -email' })
      .populate({ path: 'comments.user', select: '-password -email' });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log('Error in getAllPosts controller: ', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log('Error in getLikedPosts controller: ', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const following = user.following;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log('Error in getFollowingPosts controller: ', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'user',
        select: '-password',
      })
      .populate({
        path: 'comments.user',
        select: '-password',
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log('Error in getUserPosts controller: ', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'You are not authorized' });
    }

    if (!text && !img) {
      return res.status(400).json({ error: 'Post should have content' });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.log(`Error in createPost controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post is not found' });
    }

    if (userId !== post.user.toString()) {
      return res.status(401).json({ error: 'You are not the author of this post' });
    }

    if (post.image) {
      const imgId = post.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(201).json({ deletedId: req.params.id });
  } catch (error) {
    console.log(`Error in deletePost controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post is not found' });
    }

    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      await Post.updateOne({ _id: post.id }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: post.id } });
      res.status(200).json({ message: 'Post unliked' });
    } else {
      await Post.updateOne({ _id: post.id }, { $push: { likes: userId } });
      await User.updateOne({ _id: userId }, { $push: { likedPosts: post.id } });

      if (req.user._id.toString() !== post.user.toString()) {
        const notification = new Notification({
          type: 'like',
          from: req.user._id,
          to: post.user,
        });
        await notification.save();
      }

      res.status(200).json({ message: 'Post liked' });
    }
  } catch (error) {
    console.log(`Error in toggleLikePost controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post is not found' });
    }

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const newComment = {
      user: userId,
      text,
    };

    post.comments.push(newComment);
    await post.save();

    return res.status(200).json(post);
  } catch (error) {
    console.log(`Error in commentPost controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
