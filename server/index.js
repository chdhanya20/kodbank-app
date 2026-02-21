
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import balanceRoutes from './routes/balance.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://kodbank-banking-app.vercel.app'
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', balanceRoutes);

app.listen(PORT, () => {
  console.log(`Kodbank server running on http://localhost:${PORT}`);
});
