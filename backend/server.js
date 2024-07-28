import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { v2 as cloudinary } from 'cloudinary';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postsRoutes from './routes/post.routes.js';

import connect from './db/connect.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.config.CLOUDINARY_CLOUD_NAME,
  api_key: process.config.CLOUDINARY_API_KEY,
  api_secret: process.config.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postsRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
  connect();
});
