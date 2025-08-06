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

  // ✅ Toggle de fonte: Amazon ou site de teste
  const useAmazon = true;

  try {
    let url = '';
    let html = '';

    if (useAmazon) {
      const amazonURL = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
      const scraperAPIUrl = `http://api.scraperapi.com?api_key=f6b47fb6f1d759e6cb534d443afe03dd&render=true&url=${encodeURIComponent(amazonURL)}`;

      console.log("🔍 Iniciando scraping da Amazon...");
      console.log("🌐 URL montada:", scraperAPIUrl);

      const response = await axios.get(scraperAPIUrl);
      html = response.data;
    } else {
      url = `https://books.toscrape.com/catalogue/category/books_1/index.html`;

      console.log("🔍 Iniciando scraping do site de teste...");
      console.log("🌐 URL montada:", url);

      const response = await axios.get(url);
      html = response.data;
    }

    const dom = new JSDOM(html);
    const document = dom.window.document;
    const items: any[] = [];

    if (useAmazon) {
      const productEls = document.querySelectorAll('[data-component-type="s-search-result"]');

      productEls.forEach((product) => {
        const title = product.querySelector('h2 a span')?.textContent?.trim() || '';
        const rating = product.querySelector('.a-icon-star-small span')?.textContent?.trim() || '';
        const reviews = product.querySelector('.a-size-base.s-underline-text')?.textContent?.trim() || '';
        const image = product.querySelector('img')?.getAttribute('src') || '';

        if (title && image) {
          items.push({ title, rating, reviews, image });
        }
      });

    } else {
      const productEls = document.querySelectorAll('.product_pod');

      productEls.forEach((product) => {
        const title = product.querySelector('h3 a')?.getAttribute('title') || '';
        const rating = product.querySelector('.star-rating')?.classList[1] || '';
        const price = product.querySelector('.price_color')?.textContent?.trim() || '';
        const image = 'https://books.toscrape.com/' + (product.querySelector('img')?.getAttribute('src') || '');

        if (title && image) {
          items.push({ title, rating, price, image });
        }
      });
    }

    console.log(`✅ ${items.length} produtos extraídos.`);
    res.json(items);
  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error);
    res.status(500).json({ error: 'Erro ao buscar dados.' });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
