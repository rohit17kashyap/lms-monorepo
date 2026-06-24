import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chatRoutes   from './routes/chatRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5002;

const allowedOrigins = /^http:\/\/localhost(:\d+)?$/;
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowedOrigins.test(origin)) }));
app.use(express.json());

app.use('/api/chat',    chatRoutes);
app.use('/api/tickets', ticketRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Chat server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
