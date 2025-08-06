# 📚 Amazon Scraper + Google Books Search

Aplicativo full stack simples para busca de produtos/livros usando scraping da Amazon (via proxy), fallback educacional e API oficial do Google Books.

Desenvolvido com:

* **Bun + Express + Axios + JSDOM** no backend
* **Vite + HTML/CSS/JavaScript puro** no frontend

---

## 🚀 Funcionalidades

* `GET /api/scrape?keyword=`: faz scraping de livros da Amazon ou site de teste.
* `GET /api/books?keyword=`: busca livros via **API oficial do Google Books**.
* Interface de busca dinâmica (enquanto digita) com exibição automática dos resultados.

---

## 🛠️ Como rodar o projeto

### 🔧 Requisitos

* Node.js (para o frontend com Vite)
* Bun instalado ([https://bun.sh](https://bun.sh))

### 📦 Backend

```bash
cd backend
bun install
bun index.ts
```

A API estará disponível em:

```
http://localhost:3000
```

### 💻 Frontend

```bash
cd frontend
npm install
npm run dev
```

A interface estará disponível em:

```
http://localhost:5173
```

---

## 🔄 Alternância de fontes no backend

No arquivo `index.ts`, você pode alternar entre:

```ts
const useAmazon = true; // scraping real via Amazon (usa ScraperAPI)
const useAmazon = false; // modo fallback com site educacional
```

---

## 🔍 Exemplos de uso

### Google Books:

```
GET /api/books?keyword=html
```

### Amazon (se habilitado):

```
GET /api/scrape?keyword=notebook
```

---

## 🧠 Sobre a escolha da abordagem

Durante o desenvolvimento, tentei inicialmente realizar o scraping direto da Amazon utilizando Axios e JSDOM. No entanto, a Amazon aplica bloqueios severos (como status 503, páginas dinâmicas e sistemas anti-bot), mesmo com cabeçalhos customizados e o uso de proxies como o ScraperAPI com `render=true`.

Para contornar essa limitação técnica e manter o foco no funcionamento da aplicação, implementamos duas soluções complementares:

1. Um **modo de fallback educacional** com o site `books.toscrape.com`, permitindo simulações locais com filtro por palavra-chave.
2. Um **endpoint real via API pública do Google Books**, que garante estabilidade, dados reais e testes confiáveis com uma abordagem REST moderna.

Essa decisão garante que a aplicação funcione corretamente e respeite os limites técnicos de scraping de grandes sites.

---

## ✅ Boas práticas aplicadas

* Código comentado explicando a lógica de scraping e uso da API
* Tratamento de erros no backend (try/catch e validações)
* Validação de campos obrigatórios
* CORS habilitado para integração com o frontend
* `debounce` no frontend para evitar múltiplas requisições em tempo real

---

## ✨ Considerações finais

O projeto foi construído de forma limpa, modular e com foco na clareza do código.

O uso do Google Books permite testes reais e estáveis sem depender de scraping e proxies, mantendo o desafio fiel ao proposto, mas com solução técnica mais robusta.

---

Desenvolvido por [@wvitor](https://github.com/wvitu) 💻
