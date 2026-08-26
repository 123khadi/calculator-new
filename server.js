const express = require('express');
const { evaluate } = require('mathjs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5500;
const fs = require('fs');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
const calculateExpression = (expression) => {
  if (typeof expression !== 'string' || !expression.trim()) {
    throw new Error('Expression is required.');
  }

  return evaluate(expression);
};

app.post('/calculate', (req, res) => {
  try {
    const { expression } = req.body || {};
    const result = calculateExpression(expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/calculate', (req, res) => {
  try {
    const { expression } = req.body || {};
    const result = calculateExpression(expression);
    res.json({ result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'calculator.html'));
});

app.get('/openCurrencyConverter', (req, res) => {
  res.send(`
    <html>
      <head><title>Currency Converter</title></head>
      <body>
        <h1>Currency Converter</h1>
      </body>
    </html>
  `);
});

app.post('/api/currency/convert', (req, res) => {
  try {
    const { amount, from, to } = req.body || {};

    if (amount === undefined || !from || !to) {
      return res.status(400).json({ error: 'Amount, from, and to are required.' });
    }

    const rates = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      INR: 83.3,
      JPY: 157.5,
      AUD: 1.51,
      CAD: 1.36
    };

    if (!rates[from] || !rates[to]) {
      return res.status(400).json({ error: 'Unsupported currency.' });
    }

    const converted = (Number(amount) / rates[from]) * rates[to];
    res.json({ result: Number(converted.toFixed(2)), from, to });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.post('/convert', (req, res) => {
    const { type, from, to, value } = req.body;
    const units = {
        length: { 'mm': 0.001, 'cm': 0.01, 'km': 1000 },
        volume: { 'mL': 0.001, 'L': 1, 'Gal': 3.78541 }
    };
    if (units[type] && units[type][from] && units[type][to]) {
        const result = (Number(value) / units[type][from]) * units[type][to];
        res.json({ result: result.toFixed(4) });
    } else {
        res.json({ error: 'Unsupported conversion' });
    }
});

app.post('/api/convertCurrency', async (req, res) => {
  try {
    const { amount, from, to } = req.body;
    
    if (amount === undefined || !from || !to) {
      return res.status(400).json({ error: 'Amount, from, and to are required.' });
    }

    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await response.json();
    const result = amount * data.rates[to];

    res.json({ result: Number(result.toFixed(2)), from, to });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// History get karne ke liye
app.get('/history', (req,res) =>{
  fs.readFile('db.json', 'utf8',(err,data) =>{
    if (err) {
        return res.status(500).json ({error:'File does not show'});
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData.history || []);
  });
});
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
 
module.exports = app;