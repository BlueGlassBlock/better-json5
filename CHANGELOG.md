# CHANGELOG - JSON5 Toolkit

Todos os cambiosnotable de este proyecto serán documentados en este archivo.

## [2.0.0] - 2024-03-28

### 🎉 Novas Funcionalidades

- **Melhorias no Autocompletar:**
  - Suporte para mostrar valores padrão (default) do schema
  - Exibição do tipo de dados nas sugestões
  - Descrições formatadas em markdown
  - Enumeração de valores disponíveis
  - Prioridade para propriedades obrigatórias (required)
  - Ordenação inteligente (required primeiro)

- **Snippets Práticos:**
  - 17 snippets novos para estruturas JSON5
  - Snippets para objetos, arrays, strings, números, booleanos, null
  - Snippets para pares chave-valor com diferentes tipos
  - Snippets para comentários de linha e bloco

### 🔧 Melhorias

- Conversão de Yarn para NPM
- Interface completamente em Português do Brasil
- Documentação atualizada
- Metadados do projeto atualizados
- Melhor formatação visual das sugestões

### 📦 Mudanças Técnicas

- Novo arquivo `src/server/utils/completions.ts` para utilities de autocompletar
- Snippets movidos para `snippets/json5.json`
- Atualização do `package.json` com novas configurações

### 🐛 Correções

- Diversas correções de bugs do upstream (better-json5 v1.6.0)

## [1.6.0] - Melhorias Anteriores

- Correção de cache de schema e atualizações em tempo real
- Adição da configuração `json5.decorateAllColors`
- Destaque de sintaxe para comentários em objetos
- Configurações de diretivas de ignorância para formatação
- Correção de formatação de vírgulas à direita
- Suporte a múltiplas linguagens (inglês, chinês)

---

## Notas de Migração

### De better-json5 para JSON5 Toolkit

1. **Snippets:** Prefixos alterados de `json5-` para `json5-` (mantido)
2. **Configurações:** Todas as configurações mantêm o prefixo `json5.`
3. **Arquivos:** Estrutura de arquivos levemente alterada

## Credits

Fork de [better-json5](https://github.com/BlueGlassBlock/better-json5) por Nyuan Zhang.
Baseado em [JSON Language Features](https://github.com/microsoft/vscode/tree/main/extensions/json-language-features) da Microsoft.

---

Desenvolvido por João M J Braga - joomdeveloper.app@gmail.com
