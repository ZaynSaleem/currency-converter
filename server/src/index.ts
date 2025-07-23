import dotenv from "dotenv";
dotenv.config();

import express, { Application } from "express";
import currencyRoutes from "./routes/currencyRoutes";
import cors from "cors";

const app: Application = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());

app.use("/api/currency", currencyRoutes);

app.get("/", (req, res) => {
  res.send("Currency Converter API Health 100%");
});

app.listen(3000, () => console.log("Server is running on port 3000."));

module.exports = app;
