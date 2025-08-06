const button = document.getElementById('scrapeBtn');
const resultsDiv = document.getElementById('results');

button.addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value.trim();

  if (!keyword) {
    alert('Digite uma palavra-chave para buscar!');
    return;
  }

  resultsDiv.innerHTML = '<p>🔄 Buscando produtos...</p>';

  try {
    const response = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      resultsDiv.innerHTML = '<p>Nenhum resultado encontrado ou erro no backend.</p>';
      return;
    }

    if (data.length === 0) {
      resultsDiv.innerHTML = '<p>❌ Nenhum produto encontrado.</p>';
      return;
    }

    const cards = data.map(item => `
      <div class="result-card">
        <img src="${item.image}" alt="Imagem do produto">
        <h3>${item.title}</h3>
        ${item.rating ? `<p>⭐ Avaliação: ${item.rating}</p>` : ''}
        ${item.reviews ? `<p>🗣️ Avaliações: ${item.reviews}</p>` : ''}
        ${item.price ? `<p>💲 Preço: ${item.price}</p>` : ''}
      </div>
    `).join('');

    resultsDiv.innerHTML = cards;
  } catch (err) {
    console.error('Erro:', err);
    resultsDiv.innerHTML = '<p>Erro ao buscar os dados. Verifique o console.</p>';
  }
});
