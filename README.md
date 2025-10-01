# Shopping List Application

Uma aplicação web de lista de compras com frontend em HTML/CSS/JavaScript e backend em Python FastAPI.

## Estrutura do Projeto

- `app/` - Frontend da aplicação (HTML, CSS, JavaScript)
- `api/` - Backend API em Python FastAPI
- `.github/workflows/` - Workflows do GitHub Actions para deploy

## Deploy no GitHub Pages

A aplicação frontend é automaticamente deployada no GitHub Pages quando há push para a branch `main`.

### Configuração Necessária

1. **Habilitar GitHub Pages no repositório:**
   - Vá para Settings > Pages
   - Em "Source", selecione "Deploy from a branch"
   - Selecione a branch "gh-pages" como source

2. **Configurar a URL da API:**
   - Edite o arquivo `app/scripts/app.js`
   - Substitua `http://127.0.0.1:8000` pela URL da sua API em produção

### Processo de Deploy

O workflow de deploy (`deploy.yml`) executa os seguintes passos:

1. Faz clone do repositório
2. Cria um diretório de deploy
3. Copia os arquivos da pasta `app/` para o diretório de deploy
4. Atualiza os caminhos dos arquivos para usar caminhos relativos
5. Configura o Git com credenciais do GitHub Actions
6. Cria/atualiza a branch `gh-pages`
7. Faz commit e push dos arquivos estáticos para a branch `gh-pages`

### URLs Após Deploy

Após o primeiro deploy bem-sucedido, a aplicação estará disponível em:
`https://[seu-usuario].github.io/shopping-list/`

### Desenvolvimento Local

Para desenvolvimento local:

1. **Backend (API):**
   ```bash
   cd api
   uv sync
   uv run src/app/main.py
   ```

2. **Frontend:**
   - Abra `app/index.html` em um servidor local
   - Ou use um servidor HTTP simples:
     ```bash
     cd app
     python -m http.server 3000
     ```

### Notas Importantes

- O frontend precisa de um backend API funcionando para trabalhar completamente
- As URLs no JavaScript são atualizadas automaticamente durante o deploy
- Certifique-se de que a API em produção aceita requisições CORS do domínio do GitHub Pages