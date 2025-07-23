import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Currency {
  code: string;
  name: string;
}

interface ConvertResponse {
  convertedAmount: number;
}

export const getCurrencyList = async (): Promise<Currency[]> => {
  const response = await axios.get(`${API_BASE_URL}/currency/list`);
  // The API returns an object where keys are currency codes and values are currency details.
  // We need to convert this into an array of Currency objects.
  return Object.keys(response.data.currencies).map((key) => ({
    code: response?.data?.currencies[key]?.code,
    name: response?.data?.currencies[key]?.name,
  }));
};

export const convertCurrency = async (
  from: string,
  to: string,
  amount: number
): Promise<ConvertResponse> => {
  const response = await axios.post(`${API_BASE_URL}/currency/convert`, {
    from,
    to,
    amount,
  });
  return response?.data;
};
