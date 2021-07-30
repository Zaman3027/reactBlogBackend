import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import postRouter from './routes/postRoutes.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ credentials: true, origin: process.env.URL || '*' }));
app.use(json());
app.use(cookieParser());
app.use('/', express.static(join(__dirname, 'public')));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.listen(PORT, () => {
    console.log(`App is running on ${PORT}`);
})