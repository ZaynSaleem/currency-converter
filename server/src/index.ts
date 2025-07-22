import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import currencyRoutes from './routes/currencyRoutes';
import path from 'path';

const app: Application = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

app.use('/api/currency', currencyRoutes);

app.get('/', (req, res) => {
  res.send('Currency Converter API');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 