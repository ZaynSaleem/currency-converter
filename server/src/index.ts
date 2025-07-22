import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import currencyRoutes from './routes/currencyRoutes';

import cors from 'cors';

const app: Application = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL // Allow only your frontend's origin
}));

app.use(express.json());

app.use('/api/currency', currencyRoutes);

app.get('/', (req, res) => {
  res.send('Currency Converter API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 