/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path');
const webpack = require('webpack');

/** @type WebpackConfig */
const clientBrowserConfig = {
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
	target: 'webworker', // extensions run in a webworker context
	entry: {
		'extension': './src/client/browser/clientMain.ts',
	},
	output: {
		filename: 'clientMain.js',
		path: path.join(__dirname, './dist/browser'),
		libraryTarget: 'commonjs'
	},
	resolve: {
		mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
		extensions: ['.ts', '.js'], // support ts-files and js-files
		alias: {
			// provides alternate implementation for node module and source files
		},
		fallback: {
			// Webpack 5 no longer polyfills Node.js core modules automatically.
			// see https://webpack.js.org/configuration/resolve/#resolvefallback
			// for the list of Node.js core module polyfills.
			'assert': require.resolve('assert')
		},
		extensionAlias: {
			'.js': ['.js', '.ts']
		}
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: 'ts-loader',
				options: {
					compilerOptions: {
						'sourceMap': true,
					},
					onlyCompileBundledFiles: true,
				}
			}]
		}]
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1 // disable chunks by default since web extensions must be a single bundle
		})
	],
	externals: {
		'vscode': 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false
	},
	devtool: 'nosources-source-map', // create a source map that points to the original source file
	infrastructureLogging: {
		level: "log", // enables logging required for problem matchers
	},
};

/** @type WebpackConfig */
const clientNodeConfig = {
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
	target: 'node',
	entry: {
		'extension': './src/client/node/clientMain.ts',
	},
	output: {
		filename: 'clientMain.js',
		path: path.join(__dirname, './dist/node'),
		libraryTarget: 'commonjs',
		devtoolModuleFilenameTemplate: '../../[resource-path]'
	},
	resolve: {
		conditionNames: ['import', 'require', 'node-addons', 'node'],
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'], // support ts-files and js-files
		extensionAlias: {
			'.js': ['.js', '.ts']
		}
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: 'ts-loader',
				options: {
					compilerOptions: {
						'sourceMap': true,
					},
					onlyCompileBundledFiles: true,
				}
			}]
		}]
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1 // disable chunks by default since web extensions must be a single bundle
		}),
	],
	externals: {
		'vscode': 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false
	},
	devtool: 'nosources-source-map', // create a source map that points to the original source file
	infrastructureLogging: {
		level: "log", // enables logging required for problem matchers
	},
};

/** @type WebpackConfig */
const serverBrowserConfig = {
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
	target: 'webworker', // extensions run in a webworker context
	entry: {
		'extension': './src/server/browser/serverWorkerMain.ts',
	},
	output: {
		filename: 'serverMain.js',
		path: path.join(__dirname, './dist/browser'),
		library: 'serverExportVar',
		libraryTarget: 'var'
	},
	resolve: {
		mainFields: ['browser', 'module', 'main'], // look for `browser` entry point in imported node modules
		extensions: ['.ts', '.js'], // support ts-files and js-files
		extensionAlias: {
			'.js': ['.js', '.ts']
		},
		fallback: {
			// Webpack 5 no longer polyfills Node.js core modules automatically.
			// see https://webpack.js.org/configuration/resolve/#resolvefallback
			// for the list of Node.js core module polyfills.
			'assert': require.resolve('assert')
		}
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: 'ts-loader',
				options: {
					compilerOptions: {
						'sourceMap': true,
					},
					onlyCompileBundledFiles: true,
				}
			}]
		}]
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1 // disable chunks by default since web extensions must be a single bundle
		})
	],
	externals: {
		'vscode': 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false
	},
	devtool: 'nosources-source-map', // create a source map that points to the original source file
	infrastructureLogging: {
		level: "log", // enables logging required for problem matchers
	}
};

/** @type WebpackConfig */
const serverNodeConfig = {
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
	target: 'node',
	entry: {
		'extension': './src/server/node/serverNodeMain.ts',
	},
	output: {
		filename: 'serverMain.js',
		path: path.join(__dirname, './dist/node'),
		libraryTarget: 'commonjs',
		devtoolModuleFilenameTemplate: '../../[resource-path]'
	},
	resolve: {
		conditionNames: ['import', 'require', 'node-addons', 'node'],
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'], // support ts-files and js-files
		extensionAlias: {
			'.js': ['.js', '.ts']
		},
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: 'ts-loader',
				options: {
					compilerOptions: {
						'sourceMap': true,
					},
					onlyCompileBundledFiles: true,
				}
			}]
		}]
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1 // disable chunks by default since web extensions must be a single bundle
		})
	],
	externals: {
		'vscode': 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false
	},
	devtool: 'nosources-source-map', // create a source map that points to the original source file
	infrastructureLogging: {
		level: "log", // enables logging required for problem matchers
	},
};

module.exports = [clientBrowserConfig, clientNodeConfig, serverBrowserConfig, serverNodeConfig];