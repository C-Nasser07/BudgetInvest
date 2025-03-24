   // server.js
   const express = require('express');
   const yahooFinance = require('yahoo-finance2').default;
   const app = express();
   const PORT = 5000;
 
   app.get('/api/quote/:symbol', async (req, res) => {
     const { symbol } = req.params;
     try {
       const quote = await yahooFinance.quote(symbol);
       res.json(quote);
     } catch (error) {
       res.status(500).send('Error fetching data');
     }
   });
 
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });