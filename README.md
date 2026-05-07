# Desafio Técnico - Sincronização de Usuários (RH)

Aplicação Node.js que consome a API [RandomUser](https://randomuser.me/), persiste apenas usuários maiores de 18 anos em um banco SQLite (com chave única `email`) e gera um relatório detalhado do processamento.

## Requisitos atendidos

- Node.js 18+ (fetch nativo)
- Consumo da API com 150 usuários
- Persistência em SQLite
- Campo `email` como chave única (UPSERT: adiciona ou atualiza)
- Filtro por idade >= 18 anos (baseado no campo `dob.age` da API)
- Relatório em JSON contendo:
  - Quantidade de registros processados
  - Adicionados / atualizados / ignorados (menores)
  - Detalhes de erros ou inconsistências

## Como executar

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd integration-challenge
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute a aplicação**
   ```bash
   npm start
   ```

Na primeira execução, o banco de dados (dados/integration.db) e a tabela users serão criados automaticamente. O relatório será salvo na pasta relatorios/ com timestamp.

## Estrutura do código

- `src/api.js` – requisição à API RandomUser.
- `src/db.js` – inicialização do SQLite e operações CRUD.
- `src/processor.js` – lógica de filtro etário e upsert (verifica existência antes de inserir/atualizar).
- `src/report.js` – geração do arquivo JSON de relatório.
- `src/main.js` – orquestração principal.

## Exemplo de saída (console)

```
Iniciando integração...
Buscando usuários da API...
150 usuários recebidos.
Processando dados...
Relatório gerado: relatorios/relatorio_2025-01-15T14-35-22-123Z.json
Total: 150, Adicionados: 87, Atualizados: 45, Ignorados: 17, Erros: 1
Integração finalizada.
```

## Decisões técnicas

- **SQLite** – banco local simples, sem necessidade de configuração adicional.
- **Controle de adicionado/atualizado** – consulta prévia por email para distinguir operação e acumular estatísticas corretas.
- **Tratamento de erros** – falhas na API, no banco ou dados inconsistentes são registrados no relatório, sem interromper todo o fluxo.
- **Idade** – utiliza o campo dob.age fornecido pela API, que já reflete a idade atual de acordo com a data de nascimento.

## Possíveis melhorias futuras

- Adicionar logs com níveis (debug/info/error).
- Implementar testes unitários (Jest).
- Permitir configuração via variáveis de ambiente (número de resultados, caminho do banco).
- Suporte a execução agendada (cron job).

## Licença

Este projeto é apenas para fins de avaliação técnica.
