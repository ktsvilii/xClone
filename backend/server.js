import express from 'express';

import dotenv from 'dotenv';

import connect from './db/connect.js';

import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
  connect();
});
