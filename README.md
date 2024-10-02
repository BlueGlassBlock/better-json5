# better-json5 

> Comprehensive support for JSON5 in Visual Studio Code

## Features

- [x] "Semantic" syntax highlighting with correctly colored keys
- [x] JSON Schema based validation and intellisense
- [x] Error checking

## Extension Settings

- `json5.schemas`: Associate schemas to JSON5 files in the current project."
- `json5.validate.enable`: Enable/disable validation.
- `json5.format.enable`: Enable/disable formatting.
- `json5.format.keepLines`: Keep all existing new lines when formatting."
- `json5.tracing`: Traces the communication between VS Code and the JSON5 language server.

## TODO

- Make formatting default to unquoted keys / configurable in settings
- Prefer unquoted keys in completion

# Credits

This extension is heavily based on the [JSON Language Features](https://github.com/microsoft/vscode/tree/main/extensions/json-language-features) extension by Microsoft.

## License

[MIT](LICENSE.md)