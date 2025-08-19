# Scripts

Esta pasta contém scripts utilitários para o projeto.

## setup-env.js

Script para copiar automaticamente arquivos `.env.example` para `.env` nos diretórios necessários.

### Uso

```bash
# Usando o alias do package.json
bun run setup:env

# Ou executando diretamente
node scripts/setup-env.js
```

### Funcionalidades

- ✅ Copia automaticamente `.env.example` para `.env` em:
  - `apps/api/`
  - `apps/app/`
  - `apps/web/`
- ✅ Verifica se os arquivos já existem para evitar sobrescrita
- ✅ Fornece feedback visual do progresso
- ✅ Exibe resumo final com estatísticas
- ✅ Sugere próximos passos após a cópia

### Comportamento

- Se o arquivo `.env` já existe, ele é pulado (não sobrescrito)
- Se o arquivo `.env.example` não existe, é exibido um aviso
- Em caso de erro, é exibida uma mensagem de erro específica

### Exemplo de Saída

```
🚀 Iniciando setup dos arquivos .env...

✅ Copiado .env.example para .env em apps/api
✅ Copiado .env.example para .env em apps/app
✅ Copiado .env.example para .env em apps/web

📊 Resumo:
   - Total de diretórios processados: 3
   - Arquivos copiados com sucesso: 3
   - Arquivos pulados: 0

💡 Próximos passos:
   1. Edite os arquivos .env criados com suas variáveis de ambiente
   2. Execute 'bun install' para instalar as dependências
   3. Execute 'bun run dev' para iniciar o desenvolvimento

✨ Setup concluído!
```
