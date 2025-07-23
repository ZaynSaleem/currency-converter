// export default CurrencyConverter;
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useCurrencyStore } from "../store/currencyStore";
import { getCurrencyList, convertCurrency } from "../services/currencyService";

interface Currency {
  code: string;
  name: string;
}

const CurrencyConverter: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const memoizedCurrencies = useMemo(() => currencies, [currencies]);

  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [amount, setAmount] = useState<number>(1);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const addConversion = useCurrencyStore((state) => state.addConversion);
  const conversionHistory = useCurrencyStore(
    (state) => state.conversionHistory
  );
  const memoizedConversionHistory = useMemo(
    () => conversionHistory,
    [conversionHistory]
  );

  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCurrencies = await getCurrencyList();
        setCurrencies(fetchedCurrencies);
      } catch (err) {
        setError("Failed to fetch currency list.");
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
      setError("Failed to convert currency.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency, toCurrency, amount, addConversion]);

  return (
    <div className="container my-5" style={{ maxWidth: "90%" }}>
      <div className="text-center mb-5">
        <h1 className="fw-bold text-forest-green fs-2 fs-md-1 px-3">
          Fast, Reliable International Money Exchange
        </h1>
        <p
          className="text-secondary mb-4 mx-auto px-3"
          style={{ maxWidth: "600px" }}
        >
          Convert between 170+ currencies with real-time exchange rates. Perfect
          for business, travel, or keeping track of international markets.
        </p>
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mb-4 fw-medium text-primary-green px-3">
          <div className="d-flex align-items-center justify-content-center">
            <i className="bi bi-clock me-2"></i>
            <span className="small">Real-time Rates</span>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <i className="bi bi-shield-check me-2"></i>
            <span className="small">Secure & Reliable</span>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <i className="bi bi-graph-up me-2"></i>
            <span className="small">Market Analysis</span>
          </div>
        </div>
      </div>

      <div className="row g-4 flex-column flex-lg-row">
        {/* Left Column - Conversion */}
        <div className="col col-lg-5 d-flex">
          <div className="card p-4 shadow-sm rounded-4 glass-effect w-100">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h6 className="fw-bold text-forest-green m-0">
                Currency Converter
              </h6>
              <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                <i className="bi bi-clock-history me-1"></i>
                Live Rates
              </span>
            </div>
            <h6 className="text-center text-muted mb-2">
              Mid-market exchange rate
            </h6>

            {loading && (
              <div className="d-flex justify-content-center mb-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}

            {/* Amount Input */}
            <div className="mb-3">
              <label htmlFor="amount" className="form-label text-start">
                Amount
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control form-control-lg focus-none"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  min="0"
                />
                <select
                  className="form-select form-select-lg"
                  id="fromCurrency"
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  style={{ maxWidth: "120px" }}
                >
                  {memoizedCurrencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="text-center my-2 d-flex align-items-center">
              <hr className="flex-grow-1 me-3" />
              <div
                className="btn btn-light bg-green-light rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                }}
              >
                ⇅
              </div>
              <hr className="flex-grow-1 ms-3" />
            </div>

            {/* Converted Result */}
            <div className="mb-4">
              <label htmlFor="converted" className="form-label small">
                Converted to
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  id="converted"
                  value={result || 0}
                  readOnly
                />
                <select
                  className="form-select form-select-lg"
                  id="toCurrency"
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  style={{ maxWidth: "120px" }}
                >
                  {memoizedCurrencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Convert Button */}
            <div className="d-grid gap-2 mt-4">
              <button
                className="btn bg-green-light btn-lg"
                onClick={handleConvert}
                disabled={loading}
              >
                Convert money
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Conversion History */}
        <div className="col d-flex">
          <div className="glass-effect py-4 rounded-4 w-100">
            <h6 className="mb-3 text-secondary fw-medium text-start px-5">
              Conversion History
            </h6>

            {memoizedConversionHistory.length === 0 ? (
              <p className="text-center text-secondary">No conversions yet.</p>
            ) : (
              <div className="conversion-table">
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr className="text-secondary">
                        <th className="fw-medium">Time</th>
                        <th className="fw-medium text-center">Conversion</th>
                        <th className="fw-medium text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memoizedConversionHistory.map((record, index) => (
                        <tr key={index} className="border-bottom">
                          <td className="text-nowrap">
                            <div>{record?.date}</div>
                            <small className="text-secondary">
                              {record?.time}
                            </small>
                          </td>
                          <td className="text-center">
                            <span className="text-primary-green">
                              {record?.from}
                            </span>
                            <span className="mx-2">→</span>
                            <span className="text-primary-green">
                              {record?.to}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="fw-medium">
                              {record?.amount.toLocaleString()} {record?.from}
                            </div>
                            <div className="text-success">
                              {record?.result.toLocaleString()} {record?.to}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
