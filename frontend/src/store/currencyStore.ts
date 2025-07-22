import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConversionRecord {
  from: string;
  to: string;
  amount: number;
  result: number;
  date: string;
  time: string;
}

interface CurrencyState {
  conversionHistory: ConversionRecord[];
  addConversion: (record: ConversionRecord) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      conversionHistory: [],
      addConversion: (record) =>
        set((state) => ({
          conversionHistory: [...state.conversionHistory, record],
        })),
    }),
    {
      name: 'currency-conversion-storage',
    }
  )
);