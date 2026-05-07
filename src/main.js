const { buscarUsuarios } = require('./api');
const { initDatabase } = require('./db');
const { processarUsuario } = require('./processor');
const { gerarRelatorio } = require('./report');

async function main() {
  const startTime = new Date();
  console.log('Iniciando integração...');

  const estatisticas = {
    totalBuscado: 0,
    processados: 0,
    adicionados: 0,
    atualizados: 0,
    ignorados: [],
    erros: []
  };

  let banco = null;
  try {
    banco = await initDatabase();
    console.log('Buscando usuários da API...');
    const usuarios = await buscarUsuarios();
    estatisticas.totalBuscado = usuarios.length;
    console.log(`${estatisticas.totalBuscado} usuários recebidos.`);

    console.log('Processando dados...');
    for (const usuario of usuarios) {
      await processarUsuario(usuario, banco, estatisticas);
    }

    gerarRelatorio(estatisticas, startTime);
  } catch (error) {
    console.error('Erro fatal:', error.message);
    estatisticas.erros.push({ fatal: true, reason: error.message });
    gerarRelatorio(estatisticas, startTime);
    process.exit(1);
  } finally {
    if (banco && typeof banco.close === 'function') await banco.close();
    console.log('Integração finalizada.');
  }
}

main();