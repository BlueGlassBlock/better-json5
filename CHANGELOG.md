# CHANGELOG

## 1.3.0

- Suggestions now respect quote of current input, instead of forcing users to use `json5.format.keyQuotes` and `json5.format.stringQuotes` settings all the time. ([#9](https://github.com/BlueGlassBlock/better-json5/issues/9))

## 1.2.1

- Fixed a minor issue that caused keys with only one character to be flagged as false-positive.

## 1.2.0

- Removed telemetry code that came with the fork.

- Addressed [vscode#232647](https://github.com/microsoft/vscode/issues/232647).

- Supported `${workspaceFolder}`, `${workspaceFolderBasename}`, `${pathSeparator}`, `${env:VARIABLE_NAME}` and `${config:CONFIG_NAME}` in `fileMatch` and `url` properties of `json5.schema` settings. ([#4](https://github.com/BlueGlassBlock/better-json5/issues/4))

> Please note that using variable substitution in `fileMatch` may not work as you expected since the pattern is identified as a **glob pattern**, and it doesn't like path separators that may come with variables.

## 1.1.2

- Optimized packaging method

## 1.1.1

- Fixed [#7](https://github.com/BlueGlassBlock/better-json5/issues/7)
- Fixed [#8](https://github.com/BlueGlassBlock/better-json5/issues/8)

## 1.1.0

- Fixed [#6](https://github.com/BlueGlassBlock/better-json5/issues/6): Multiline strings are getting false-positive errors
- Fixed TextMate grammar for floating point numbers like `3.`
- Implemented multiline string folding

## 1.0.1

- Fixed [#3](https://github.com/BlueGlassBlock/better-json5/issues/3): Extension looksup schema configuration in wrong section

## 1.0.0

- Make suggestions respect quote settings

## 0.0.3

- Implemented `json5.format.trailingCommas` setting
- Implemented `json5.format.keyQuotes` and `json5.format.stringQuotes` settings
- Published to <https://open-vsx.org> [#2](https://github.com/BlueGlassBlock/better-json5/issues/2)

## 0.0.2

- Fixed [#1](https://github.com/BlueGlassBlock/better-json5/issues/1): Extension failed to load in <https://vscode.dev>

## 0.0.1

- Initial release