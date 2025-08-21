# Configuração de Arquivos de Demonstração AI

## Visão Geral

Os diretórios `.ai/`, `.cursor/`, `.gemini/` e `.windsurf/` contêm arquivos de demonstração e documentação gerados por IA para fins de referência e desenvolvimento. Estes arquivos são configurados para serem ignorados por todos os sistemas de desenvolvimento.

## Configurações Implementadas

### 1. Git (.gitignore)
```gitignore
# AI Demo Files
.ai/
.cursor/
.gemini/
.windsurf/
```

### 2. Cursor (.cursorignore)
```gitignore
# AI Demo Files
.ai/
.cursor/
.gemini/
.windsurf/
```

### 3. Biome (biome.json)
```json
"linter": {
  "ignore": ["node_modules", ".next", "packages/tsconfig", ".ai", ".cursor", ".gemini", ".windsurf"]
},
"files": {
  "ignoreUnknown": true
}
```

### 4. VSCode (.vscode/settings.json)
```json
"search.exclude": {
  "**/node_modules": true,
  "**/.ai": true,
  "**/.cursor": true,
  "**/.gemini": true,
  "**/.windsurf": true
},
"files.exclude": {
  "**/.ai": true,
  "**/.cursor": true,
  "**/.gemini": true,
  "**/.windsurf": true
}
```

### 5. TypeScript (tooling/typescript/base.json)
```json
"exclude": [
  "node_modules",
  ".ai",
  ".cursor",
  ".gemini",
  ".windsurf"
]
```

### 6. Prettier (.prettierignore)
```gitignore
# AI Demo Files
.ai/
.cursor/
.gemini/
.windsurf/
```

### 7. EditorConfig (.editorconfig)
```ini
# Ignore AI demo files
[.ai/**]
indent_style = unset
indent_size = unset
end_of_line = unset
insert_final_newline = unset
charset = unset
trim_trailing_whitespace = unset

[.cursor/**]
indent_style = unset
indent_size = unset
end_of_line = unset
insert_final_newline = unset
charset = unset
trim_trailing_whitespace = unset

[.gemini/**]
indent_style = unset
indent_size = unset
end_of_line = unset
insert_final_newline = unset
charset = unset
trim_trailing_whitespace = unset

[.windsurf/**]
indent_style = unset
indent_size = unset
end_of_line = unset
insert_final_newline = unset
charset = unset
trim_trailing_whitespace = unset
```

## Benefícios

- **Sem interferência**: Os arquivos de demonstração não interferem com linting, formatação ou análise de código
- **Performance**: Editores e linters não processam arquivos desnecessários
- **Organização**: Separação clara entre código de produção e arquivos de demonstração
- **Consistência**: Configuração uniforme em todos os sistemas de desenvolvimento

## Estrutura dos Diretórios de IA

### .ai/
- `docs/` - Documentação de demonstração de diferentes tecnologias
- `rules/` - Regras e configurações de demonstração

### .cursor/
- `rules/` - Regras específicas do Cursor AI

### .gemini/
- `rules/` - Regras específicas do Gemini AI

### .windsurf/
- `rules/` - Regras específicas do Windsurf AI

## Nota

Estes arquivos são apenas para demonstração e não fazem parte do código de produção. Eles são ignorados por todos os sistemas de desenvolvimento para evitar interferência com o linting, formatação e análise de código.
