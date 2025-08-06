const input = document.getElementById('keyword');
const resultsDiv = document.getElementById('results');

let debounceTimer;

input.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const keyword = input.value.trim();
    if (keyword.length >= 3) {
      buscarLivros(keyword);
    } else {
      resultsDiv.innerHTML = '<p>Digite ao menos 3 letras para buscar livros...</p>';
    }
  }, 500); // atraso de 500ms após parar de digitar
});

async function buscarLivros(keyword) {
  resultsDiv.innerHTML = '<p>🔎 Buscando livros...</p>';

  try {
    const response = await fetch(`http://localhost:3000/api/books?keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      resultsDiv.innerHTML = '<p>❌ Nenhum livro encontrado.</p>';
      return;
    }

    const cards = data.map(item => `
      <div class="result-card">
        <img src="${item.image}" alt="Imagem do livro">
        <h3>${item.title}</h3>
        ${item.authors ? `<p>👤 ${item.authors}</p>` : ''}
        ${item.rating ? `<p>⭐ ${item.rating}</p>` : ''}
        ${item.link ? `<a href="${item.link}" target="_blank">📖 Visualizar</a>` : ''}
      </div>
    `).join('');

    resultsDiv.innerHTML = cards;
  } catch (err) {
    console.error('Erro ao buscar livros:', err);
    resultsDiv.innerHTML = '<p>Erro ao buscar livros. Veja o console.</p>';
  }
}
