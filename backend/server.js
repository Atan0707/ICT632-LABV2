const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// NewsAPI configuration
const NEWS_API_KEY = process.env.NEWS_API_KEY;

// Endpoint to fetch news
app.get('/api/news', async (req, res) => {
  try {
    const { country = 'my', category = 'general', pageSize = 20, q } = req.query;
    
    let endpoint = `https://newsapi.org/v2/everything`;
    let params = {
      q: 'malaysia', // Default query for Malaysia news
      sortBy: 'publishedAt',
      apiKey: NEWS_API_KEY
    };

    // If category is provided and not general, add it to the query
    if (category && category !== 'general') {
      params.q = `malaysia ${category}`;
    }

    // If search query is provided, use that instead
    if (q) {
      params.q = q;
    }
    
    const response = await axios.get(endpoint, { params });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      message: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
