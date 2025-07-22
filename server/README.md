# Currency Converter API

A Node.js Express API for currency conversion using TypeScript and [freecurrencyapi.com](https://freecurrencyapi.com/docs/).

## Features
- TypeScript support
- Express.js server
- Currency conversion endpoint using a third-party API

## Folder Structure
```
src/
  controllers/
    currencyController.ts
  routes/
    currencyRoutes.ts
  index.ts
```

## Setup
1. Clone the repository and install dependencies:
   ```sh
   npm install
   ```
2. Add your API key from [freecurrencyapi.com](https://freecurrencyapi.com/) in `src/controllers/currencyController.ts`:
   ```ts
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Build and Run
```sh
npm run build
npm start
```

## API Usage
### POST /api/currency/convert
**Body:**
```
{
  "from": "USD",
  "to": "EUR",
  "amount": 100
}
```
**Response:**
```
{
  "from": "USD",
  "to": "EUR",
  "amount": 100,
  "convertedAmount": 92.5,
  "rate": 0.925
}
``` 