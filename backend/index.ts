import express from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const app = express();
const PORT = 3000;

// Habilita CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// 🔍 Scraping da Amazon ou site de testes
app.get('/api/scrape', async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Parâmetro "keyword" é obrigatório.' });
  }

  const useAmazon = false; // modo de teste padrão

  try {
    let url = '';
    let html = '';
    const items: any[] = [];

    if (useAmazon) {
      const amazonURL = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
      const scraperAPIUrl = `http://api.scraperapi.com?api_key=f6b47fb6f1d759e6cb534d443afe03dd&render=true&url=${encodeURIComponent(amazonURL)}`;

      console.log("🔍 Iniciando scraping da Amazon...");
      console.log("🌐 URL montada:", scraperAPIUrl);

      const response = await axios.get(scraperAPIUrl);
      html = response.data;

      const dom = new JSDOM(html);
      const document = dom.window.document;
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
      url = `https://books.toscrape.com/catalogue/category/books_1/index.html`;

      console.log("🔍 Iniciando scraping do site de teste...");
      console.log("🌐 URL montada:", url);

      const response = await axios.get(url);
      html = response.data;

      const dom = new JSDOM(html);
      const document = dom.window.document;
      const productEls = document.querySelectorAll('.product_pod');

      productEls.forEach((product) => {
        const title = product.querySelector('h3 a')?.getAttribute('title') || '';
        const rating = product.querySelector('.star-rating')?.classList[1] || '';
        const price = product.querySelector('.price_color')?.textContent?.trim() || '';
        const image = 'https://books.toscrape.com/' + (product.querySelector('img')?.getAttribute('src') || '');

        if (title.toLowerCase().includes(keyword.toLowerCase())) {
          items.push({ title, rating, price, image });
        }
      });
    }

    console.log(`✅ ${items.length} produtos extraídos para "${keyword}".`);
    res.json(items);
  } catch (error) {
    console.error('❌ Erro ao buscar dados:', error);
    res.status(500).json({ error: 'Erro ao buscar dados.' });
  }
});

// 📚 Integração com a API pública do Google Books
app.get('/api/books', async (req, res) => {
  const keyword = req.query.keyword;

  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Parâmetro "keyword" é obrigatório.' });
  }

  try {
    const googleBooksURL = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(keyword)}&maxResults=12`;
    const { data } = await axios.get(googleBooksURL);

    const items = (data.items || []).map((book: any) => {
      const info = book.volumeInfo;
      return {
        title: info.title,
        authors: info.authors?.join(', ') || '',
        rating: info.averageRating || 'Sem nota',
        image: info.imageLinks?.thumbnail || '',
        link: info.previewLink
      };
    });

    res.json(items);
  } catch (error) {
    console.error('❌ Erro ao buscar livros:', error);
    res.status(500).json({ error: 'Erro ao buscar livros.' });
  }
});

app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
