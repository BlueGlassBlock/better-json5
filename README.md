<div align="center">

# JSON5 Toolkit

> Suporte JSON5 para Visual Studio Code, feito da forma certa ⚡

</div>

Suporte completo para JSON5 no Visual Studio Code: syntax highlighting, validação, formatação, autocompletar inteligente baseado em JSON Schema e snippets.

## ✨ Funcionalidades

### Syntax Highlighting
Destaque de sintaxe com cores corretas para chaves, suporte total ao seu tema favorito.

![Syntax Highlighting](.github/highlighting.png)

### Autocompletar Inteligente
Sugestões contextuais baseadas em JSON Schema com informações detalhadas:
- Valores padrão
- Tipos de dados
- Descrições
- Enumeração de valores
- Prioridade para propriedades obrigatórias

![Autocompletar](.github/overview.gif)

### Snippets Práticos
Atalhos rápidos para criar estruturas JSON5:
- `json5-obj` - Objeto vazio
- `json5-arr` - Array vazio
- `json5-kv` - Par chave-valor
- `json5-str` - String
- `json5-num` - Número
- `json5-bool` - Booleano
- `json5-null` - Valor null
- E mais...

### Formatação Configurável

![Formatação](.github/formatting.gif)

### Comando de Ordenação

![Ordenação](.github/sorting.gif)

### Dobragem de Código
Dobragem adequada para objetos, arrays e strings multilinha.

![Dobragem](.github/folding.gif)

## ⚙️ Configurações da Extensão

- `json5.schemas`: Associar schemas aos arquivos JSON5 no projeto atual.
- `json5.validate.enable`: Habilitar/desabilitar validação.
- `json5.format.enable`: Habilitar/desabilitar formatação.
- `json5.format.keepLines`: Manter todas as quebras de linha existentes ao formatar.
- `json5.format.trailingCommas`: Controlar a ocorrência de vírgulas à direita em objetos e arrays.
- `json5.format.keyQuotes`: Controlar o uso de aspas para chaves de objeto.
- `json5.format.stringQuotes`: Controlar o uso de aspas para valores de string em objetos e arrays.
- `json5.format.tabSize`: Substituir o tamanho de tabulação para formatação. Se definido como `false`, usa o tamanho de tab padrão do editor. Se definido como `true`, usa <kbd>Tab</kbd> (`\t`) para indentação. Se definido como um número, usa esse número de espaços para indentação.
- `json5.format.startIgnoreDirective`: O início da diretiva de ignorância para formatação. Padrão para `json5-fmt: off`. Funciona apenas para comentários de linha `//`.
- `json5.format.endIgnoreDirective`: O fim da diretiva de ignorância para formatação. Padrão para `json5-fmt: on`. Funciona apenas para comentários de linha `//`.
- `json5.trace.server`: Rastreia a comunicação entre o VS Code e o servidor de linguagem JSON5.

## 🛠️ Snippets Disponíveis

| Prefixo | Descrição |
|---------|-----------|
| `json5-obj` | Objeto JSON5 vazio |
| `json5-arr` | Array JSON5 vazio |
| `json5-kv` | Par chave-valor genérico |
| `json5-kv-str` | Par chave-valor com string |
| `json5-kv-num` | Par chave-valor com número |
| `json5-kv-bool` | Par chave-valor com booleano |
| `json5-kv-null` | Par chave-valor com null |
| `json5-kv-arr` | Par chave-valor com array |
| `json5-kv-obj` | Par chave-valor com objeto |
| `json5-str` | String JSON5 |
| `json5-num` | Número JSON5 |
| `json5-bool` | Booleano JSON5 |
| `json5-null` | Valor null |
| `json5-comment` | Comentário de linha |
| `json5-comment-block` | Comentário de bloco |

## 📋 Créditos

Esta extensão é fortemente baseada na extensão [JSON Language Features](https://github.com/microsoft/vscode/tree/main/extensions/json-language-features) da Microsoft.

Fork do [better-json5](https://github.com/BlueGlassBlock/better-json5) com melhorias e evoluções contínuas.

## 📝 Licença

[MIT](LICENSE.md)

## 👤 Autor

**João M J Braga** - [GitHub](https://github.com/joaomjbraga) - joomdeveloper.app@gmail.com

---

Desenvolvido com ❤️ para a comunidade de desenvolvedores
