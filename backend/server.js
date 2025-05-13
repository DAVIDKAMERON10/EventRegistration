import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import qr from 'qrcode';

import participantRoutes from './routes/participantRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URI;


app.use(bodyParser.json());
app.use(cors());

mongoose.connect(MONGODB_URL)
  .then(() => console.log('✅ Database connection successful'))
  .catch((err) => console.error(err));

app.use('/api/participants', participantRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
