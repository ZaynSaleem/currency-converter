import { Request, Response } from "express";
import axios from "axios";

const API_KEY = process.env.FREE_CURRENCY_API_KEY;
const BASE_URL = "https://api.freecurrencyapi.com/v1";

// It converts the currency fron base to target current
export const convertCurrency = async (req: Request, res: Response) => {
  const { from, to, amount } = req?.body;

  // Validation added to check if the required fields are added
  if (!from || !to || !amount) {
    return res
      .status(400)
      .json({ error: "Missing required fields: from, to, amount" });
  }

  // Wrapped the code in try catch to handle the error
  try {
    // Trigger currency conversion API
    const response = await axios.get(BASE_URL + "/latest", {
      params: {
        apikey: API_KEY,
        base_currency: from,
        currencies: to
      }
    });

    // Saving Response in a variable
    const rate = response?.data?.data[to];

    // If rate is not found, return error
    if (!rate) {
      return res.status(400).json({ error: "Invalid target currency" });
    }

    // Calculating the converted amount
    const convertedAmount = rate * amount;

    // Returning the response
    res.json({ from, to, amount, convertedAmount, rate });
  } catch (error) {
    res.status(500).json({
      error: "Currency conversion failed",
      details: error instanceof Error ? error?.message : error
    });
  }
};

export const getCurrencies = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(BASE_URL + "/currencies", {
      params: {
        apikey: API_KEY
      }
    });

    const currenciesObj = response?.data?.data;

    // Convert object to array of currency objects
    const currencies = Object.values(currenciesObj);

    console.log({ currencies });
    res.json({ currencies });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch currencies",
      details: error instanceof Error ? error?.message : error
    });
  }
};