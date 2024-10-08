import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

import Notification from '../models/notification.model.js';
import User from '../models/user.model.js';

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getUserProfile controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const toggleFollowUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You can not follow/unfollow yourself' });
    }

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: 'User unfollowed successfully' });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const notification = new Notification({
        type: 'follow',
        from: req.user._id,
        to: userToModify._id,
      });

      await notification.save();
      res.status(200).json({ message: 'User followed successfully' });
    }
  } catch (error) {
    console.log(`Error in toggleFollowUser controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select(['following']);
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);

    const filteredUsers = users.filter(user => !usersFollowedByMe.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach(user => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error in getSuggestedUsers controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullName, email, currentPassword, newPassword, bio, link, username } = req.body;
    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
      return res.status(400).json({ error: 'Please provide both current and a new passwords' });
    }

    if (currentPassword && newPassword) {
      const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user?.password || '');

      if (!isCurrentPasswordCorrect) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password should be at least 6 characters long' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImage) {
        await cloudinary.uploader.destroy(user.profileImage.split('/').at(-1).split('.')[0]);
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(user.coverImg.split('/').at(-1).split('.')[0]);
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImage = profileImg || user.profileImage;
    user.coverImage = coverImg || user.coverImage;

    user = await user.save();

    user.password = null;
    return res.status(200).json(user);
  } catch (error) {
    console.log(`Error in updateUser controller ${error.message}`);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
