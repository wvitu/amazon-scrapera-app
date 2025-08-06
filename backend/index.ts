import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const PORT = 3000;

app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Parâmetro "keyword" é obrigatório.' });
  }

  try {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36'
      }
    });

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const items = [];
    const productEls = document.querySelectorAll('[data-component-type="s-search-result"]');

    productEls.forEach((product) => {
      const title = product.querySelector('h2 a span')?.textContent?.trim() || '';
      const rating = product.querySelector('.a-icon-alt')?.textContent?.trim() || '';
      const reviews = product.querySelector('[aria-label$="ratings"]')?.textContent?.trim() || '';
      const image = product.querySelector('img')?.getAttribute('src') || '';

      if (title && image) {
        items.push({ title, rating, reviews, image });
      }
    });

    res.json(items);
  } catch (error) {
    console.error('Erro ao extrair dados da Amazon:', error);
    res.status(500).json({ error: 'Erro ao buscar dados da Amazon.' });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
