import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCurrencyStore } from '../store/currencyStore';
import { getCurrencyList, convertCurrency } from '../services/currencyService';

interface Currency {
  code: string;
  name: string;
}

const CurrencyConverter: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const memoizedCurrencies = useMemo(() => currencies, [currencies]);
  
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('INR');
  
  const [amount, setAmount] = useState<number>(1);
  
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const addConversion = useCurrencyStore((state) => state.addConversion);
  const conversionHistory = useCurrencyStore((state) => state.conversionHistory);
  const memoizedConversionHistory = useMemo(() => conversionHistory, [conversionHistory]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCurrencies = await getCurrencyList();
        setCurrencies(fetchedCurrencies);
      } catch (err) {
        setError('Failed to fetch currency list.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  const handleConvert = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await convertCurrency(fromCurrency, toCurrency, amount);
      setResult(response.convertedAmount);

      const now = new Date();
      addConversion({
        from: fromCurrency,
        to: toCurrency,
        amount: amount,
        result: response.convertedAmount,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString(),
      });
    } catch (err) {
      setError('Failed to convert currency.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, amount, addConversion]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Currency Converter</h1>
      <div className="card p-4 shadow-sm">
        {loading && (
          <div className="d-flex justify-content-center mb-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        <div className="row g-3 mb-4">
          <div className="col-md-4 col-sm-12">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              min="0"
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <label htmlFor="fromCurrency" className="form-label">From</label>
            <select
              className="form-select"
              id="fromCurrency"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {memoizedCurrencies?.length && memoizedCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 col-sm-12">
            <label htmlFor="toCurrency" className="form-label">To</label>
            <select
              className="form-select"
              id="toCurrency"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              {memoizedCurrencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="d-grid">
          <button className="btn btn-primary btn-lg" onClick={handleConvert} disabled={loading}>
            Convert
          </button>
        </div>

        {result !== null && (
          <div className="mt-4 p-3 bg-light rounded text-center">
            <h3>
              {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
            </h3>
          </div>
        )}
      </div>

      <h2 className="mt-5 mb-3 text-center">Conversion History</h2>
      {memoizedConversionHistory.length === 0 ? (
        <p className="text-center">No conversions yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {memoizedConversionHistory.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.time}</td>
                  <td>{record.from}</td>
                  <td>{record.to}</td>
                  <td>{record.amount}</td>
                  <td>{record.result.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
