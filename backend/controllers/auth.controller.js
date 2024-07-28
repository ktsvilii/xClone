import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../lib/utils/generateToken.js';

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'This user already exists' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password should be at least 6 characters length' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImage: newUser.profileImage,
        coverImage: newUser.coverImage,
      });
    } else {
      res.status(400).json({ message: 'User has not been created' });
    }
  } catch (error) {
    console.log(`Error in signup controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');
    if (!isPasswordCorrect || !user) {
      return res.status(400).json({ error: 'Incorrect username or password' });
    }

    generateTokenAndSetCookie(user._id, res);
    return res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
    });
  } catch (error) {
    console.log(`Error in login controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const logout = async (_, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.log(`Error in logout controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getMe controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
