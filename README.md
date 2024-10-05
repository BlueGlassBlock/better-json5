# better-json5 

> Comprehensive support for JSON5 in Visual Studio Code

## Features

- [x] "Semantic" syntax highlighting with correctly colored keys
- [x] JSON Schema based validation and intellisense
- [x] Error checking
- [x] Completely configurable formatting

## Extension Settings

- `json5.schemas`: Associate schemas to JSON5 files in the current project.
- `json5.validate.enable`: Enable/disable validation.
- `json5.format.enable`: Enable/disable formatting.
- `json5.format.keepLines`: Keep all existing new lines when formatting.
- `json5.format.trailingCommas`: Control the occurrence of trailing commas in objects and arrays.
- `json5.format.keyQuotes`: Control the usage of quotes for object keys.
- `json5.format.stringQuotes`: Control the usage of quotes for string values in objects and arrays.
- `json5.tracing`: Traces the communication between VS Code and the JSON5 language server.

## TODO

- Semantic completion for strings based on user quotes preference / context (needs decision)

## Credits

This extension is heavily based on the [JSON Language Features](https://github.com/microsoft/vscode/tree/main/extensions/json-language-features) extension by Microsoft.

## Changelog

### 0.0.3

- Implemented `json5.format.trailingCommas` setting
- Implemented `json5.format.keyQuotes` and `json5.format.stringQuotes` settings
- Published to <https://open-vsx.org> [#2](https://github.com/BlueGlassBlock/better-json5/issues/2)

### 0.0.2

- Fixed [#1](https://github.com/BlueGlassBlock/better-json5/issues/1): Extension failed to load in <https://vscode.dev>

### 0.0.1

- Initial release

## License

[MIT](LICENSE.md)