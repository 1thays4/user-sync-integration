async function buscarUsuarios() {
  const url = 'https://randomuser.me/api/?results=150';
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Erro na API: ${resposta.status} ${resposta.statusText}`);
  }
  const dados = await resposta.json();
  return dados.results;
}

module.exports = { buscarUsuarios };
