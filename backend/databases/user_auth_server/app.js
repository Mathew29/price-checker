import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import { startAlertJob } from './jobs/scheduler.js'

dotenv.config()
const app = express();

app.use(express.json());

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));

app.use('/api/users', userRoutes);
startAlertJob()

export default app