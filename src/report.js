const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '..', 'relatorios');

function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

function gerarRelatorio(estatisticas, tempoInicio) {
  ensureReportsDir();

  const tempoFim = new Date().toISOString();
  const duracao = (new Date() - new Date(tempoInicio)) / 1000;

  const relatorio = {
    timestamp: tempoFim,
    execution_time_seconds: duracao,
    resumo: {
      total_buscado: estatisticas.totalBuscado,
      processados_persistidos: estatisticas.processados,
      adicionados: estatisticas.adicionados,
      atualizados: estatisticas.atualizados,
      ignorados_menores: estatisticas.ignorados.length,
      erros: estatisticas.erros.length
    },
    detalhes: {
      usuarios_ignorados: estatisticas.ignorados,
      detalhes_erros: estatisticas.erros
    }
  };

  const nomeArquivo = `relatorio_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const caminhoArquivo = path.join(REPORTS_DIR, nomeArquivo);
  fs.writeFileSync(caminhoArquivo, JSON.stringify(relatorio, null, 2), 'utf-8');

  console.log(`Relatório gerado: relatorios/${nomeArquivo}`);
  console.log('Resumo:');
  console.log(`- Total recebido: ${relatorio.resumo.total_buscado}`);
  console.log(`- Persistidos: ${relatorio.resumo.processados_persistidos}`);
  console.log(`- Adicionados: ${relatorio.resumo.adicionados}`);
  console.log(`- Atualizados: ${relatorio.resumo.atualizados}`);
  console.log(`- Ignorados (<18): ${relatorio.resumo.ignorados_menores}`);
  console.log(`- Erros: ${relatorio.resumo.erros}`);
}

module.exports = { gerarRelatorio };
