/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// @ts-check
import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');
const isProduction = process.argv.includes('--production');

/** @type {esbuild.BuildOptions} */
const sharedOptions = {
	bundle: true,
	sourcemap: true,
	minify: isProduction,
	treeShaking: true,
	target: ['es2022'],
	external: ['vscode'],
	format: 'cjs',
	logLevel: 'info',
	logOverride: {
		'import-is-undefined': 'error',
	},
};

/** @type {esbuild.BuildOptions} */
const browserOptions = {
	...sharedOptions,
	platform: 'browser',
	mainFields: ['browser', 'module', 'main'],
	define: {
		'process.platform': JSON.stringify('web'),
		'process.env': JSON.stringify({}),
		'process.env.BROWSER_ENV': JSON.stringify('true'),
	},
};

/** @type {esbuild.BuildOptions} */
const nodeOptions = {
	...sharedOptions,
	platform: 'node',
	mainFields: ['module', 'main'],
};

/** @type {esbuild.BuildOptions[]} */
const configs = [
	// Client Browser
	{
		...browserOptions,
		entryPoints: { clientMain: './src/client/browser/clientMain.ts' },
		outdir: './dist/browser',
	},
	// Client Node
	{
		...nodeOptions,
		entryPoints: { clientMain: './src/client/node/clientMain.ts' },
		outdir: './dist/node',
	},
	// Server Browser
	{
		...browserOptions,
		entryPoints: { serverMain: './src/server/browser/serverWorkerMain.ts' },
		outdir: './dist/browser',
	},
	// Server Node
	{
		...nodeOptions,
		entryPoints: { serverMain: './src/server/node/serverNodeMain.ts' },
		outdir: './dist/node',
	},
];

async function main() {
	if (isWatch) {
		const contexts = await Promise.all(configs.map(c => esbuild.context(c)));
		await Promise.all(contexts.map(ctx => ctx.watch()));
		console.log('[watch] Build finished, watching for changes...');
	} else {
		await Promise.all(configs.map(c => esbuild.build(c)));
	}
}

main().catch(() => process.exit(1));
