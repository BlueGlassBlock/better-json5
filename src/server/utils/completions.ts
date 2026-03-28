import { CompletionItem, CompletionItemKind, InsertTextFormat, MarkupContent } from 'vscode-languageserver';

export interface CompletionOptions {
	sortRequiredFirst?: boolean;
	includeDefaultValue?: boolean;
	includeType?: boolean;
	includeEnum?: boolean;
	includeDescription?: boolean;
	includeConstraints?: boolean;
	maxEnumItems?: number;
}

export interface SchemaPropertyInfo {
	type?: string | string[];
	description?: string;
	defaultValue?: unknown;
	enumValues?: unknown[];
	required?: boolean;
	deprecated?: boolean;
	deprecationMessage?: string;
	constraint?: unknown;
	minimum?: number;
	maximum?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	format?: string;
	examples?: unknown[];
	schemaRef?: string;
	title?: string;
}

const TYPE_TEMPLATES: Record<string, string> = {
	object: '{\n  "${1:key}": ${2:value}\n}',
	array: '[\n  ${1:value}\n]',
	keyValue: '"${1:key}": ${2:value}',
	string: '"${1:value}"',
	number: '${1:0}',
	integer: '${1:0}',
	boolean: '${1|true,false|}',
	null: 'null',
	email: '"${1:user@example.com}"',
	url: '"${1:https://example.com}"',
	uuid: '"${1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}"',
	date: '"${1:2024-01-01}"',
	time: '"${1:12:00:00}"',
	datetime: '"${1:2024-01-01T12:00:00Z}"',
	ipv4: '"${1:192.168.1.1}"',
	hostname: '"${1:example.com}"'
};

const TYPE_ICONS: Record<string, string> = {
	object: '📦',
	array: '📋',
	string: '📝',
	number: '🔢',
	integer: '🔢',
	boolean: '✅',
	null: '🚫'
};

function getTypeIcon(type: string | string[]): string {
	const types = Array.isArray(type) ? type : [type];
	for (const t of types) {
		if (TYPE_ICONS[t]) return TYPE_ICONS[t];
	}
	return '❓';
}

function getTypeLabel(type: string | string[]): string {
	return Array.isArray(type) ? type.join(' | ') : type;
}

function getSnippetTemplate(type: string | string[], format?: string): string {
	const types = Array.isArray(type) ? type : [type];
	if (format === 'email' || types.includes('string')) {
		if (format === 'email') return TYPE_TEMPLATES.email;
		if (format === 'uri' || format === 'url') return TYPE_TEMPLATES.url;
		if (format === 'date-time') return TYPE_TEMPLATES.datetime;
		if (format === 'date') return TYPE_TEMPLATES.date;
		if (format === 'time') return TYPE_TEMPLATES.time;
		if (format === 'ipv4') return TYPE_TEMPLATES.ipv4;
		if (format === 'hostname') return TYPE_TEMPLATES.hostname;
		if (format === 'uuid') return TYPE_TEMPLATES.uuid;
	}
	for (const t of types) {
		if (TYPE_TEMPLATES[t]) return TYPE_TEMPLATES[t];
	}
	return TYPE_TEMPLATES.keyValue;
}

function buildDocumentation(info: SchemaPropertyInfo): MarkupContent | string | undefined {
	const parts: string[] = [];
	if (info.title) parts.push(`### ${info.title}\n`);
	if (info.type) parts.push(`${getTypeIcon(info.type)} **Tipo:** \`${getTypeLabel(info.type)}\``);
	if (info.description) parts.push(`\n${info.description}`);
	if (info.enumValues?.length) {
		const preview = info.enumValues.slice(0, 8);
		const list = preview.map(v => `\`${JSON.stringify(v)}\``).join(', ');
		const more = info.enumValues.length > 8 ? ` [+${info.enumValues.length - 8}]` : '';
		parts.push(`\n📋 **Enum:** ${list}${more}`);
	}
	if (info.defaultValue !== undefined) {
		parts.push(`\n📌 **Padrão:** \`${JSON.stringify(info.defaultValue)}\``);
	}
	if (info.constraint) parts.push(`\n🔒 **Const:** \`${JSON.stringify(info.constraint)}\``);
	const constraints: string[] = [];
	if (info.minimum !== undefined && info.maximum !== undefined) {
		constraints.push(`\`${info.minimum} - ${info.maximum}\``);
	} else {
		if (info.minimum !== undefined) constraints.push(`mín: \`${info.minimum}\``);
		if (info.maximum !== undefined) constraints.push(`máx: \`${info.maximum}\``);
	}
	if (info.minLength !== undefined && info.maxLength !== undefined) {
		constraints.push(`\`${info.minLength} - ${info.maxLength} chars\``);
	} else {
		if (info.minLength !== undefined) constraints.push(`mín chars: \`${info.minLength}\``);
		if (info.maxLength !== undefined) constraints.push(`máx chars: \`${info.maxLength}\``);
	}
	if (info.pattern) constraints.push(`padrão: \`${info.pattern}\``);
	if (info.format) constraints.push(`formato: \`${info.format}\``);
	if (constraints.length) parts.push(`\n⚙️ **Restrições:** ${constraints.join(' | ')}`);
	if (info.examples?.length) {
		const ex = info.examples.slice(0, 3).map(v => `\`${JSON.stringify(v)}\``).join(', ');
		parts.push(`\n💡 **Exemplos:** ${ex}`);
	}
	if (info.deprecated) {
		parts.push(`\n⚠️ **DEPRECADO:** ${info.deprecationMessage || 'Propriedade depreciada'}`);
	}
	if (info.schemaRef) parts.push(`\n🔗 **Ref:** \`${info.schemaRef}\``);
	if (!parts.length) return undefined;
	return { kind: 'markdown', value: parts.join('\n\n') };
}

function buildDetail(info: SchemaPropertyInfo): string | undefined {
	const parts: string[] = [];
	if (info.type) parts.push(getTypeIcon(info.type), getTypeLabel(info.type));
	if (info.required) parts.push(' ⭐');
	if (info.deprecated) parts.push(' ⚠️');
	if (info.enumValues?.length) {
		const preview = info.enumValues.slice(0, 3).map(v => JSON.stringify(v)).join(', ');
		parts.push(` [${preview}${info.enumValues.length > 3 ? '...' : ''}]`);
	}
	if (info.defaultValue !== undefined) parts.push(` = ${JSON.stringify(info.defaultValue)}`);
	return parts.join(' ');
}

export function enrichCompletionItem(item: CompletionItem, info?: SchemaPropertyInfo): CompletionItem {
	if (!info) return item;
	if (info.required) {
		item.kind = CompletionItemKind.Property;
		item.sortText = '\x00' + (item.sortText || String(item.label));
	} else if (item.kind === CompletionItemKind.Property) {
		item.sortText = '\x01' + (item.sortText || String(item.label));
	}
	item.detail = buildDetail(info);
	item.documentation = buildDocumentation(info);
	if (info.type && !item.insertText) {
		item.insertText = getSnippetTemplate(info.type, info.format);
		item.insertTextFormat = InsertTextFormat.Snippet;
	}
	if (info.deprecated) item.tags = [1];
	if (info.description && !item.documentation) item.documentation = info.description;
	return item;
}

export function enrichCompletionList(items: CompletionItem[]): CompletionItem[] {
	const enriched = items.map(item => enrichCompletionItem(item));
	enriched.sort((a, b) => {
		const aText = a.sortText || String(a.label);
		const bText = b.sortText || String(b.label);
		return aText.localeCompare(bText);
	});
	return enriched;
}

export function createPropertySnippet(label: string, type: string | string[], info?: SchemaPropertyInfo): CompletionItem {
	const item = CompletionItem.create(label);
	item.kind = CompletionItemKind.Property;
	item.insertTextFormat = InsertTextFormat.Snippet;
	item.insertText = getSnippetTemplate(type, info?.format);
	item.detail = buildDetail({ type, ...info });
	item.documentation = buildDocumentation({ type, ...info } as SchemaPropertyInfo);
	if (info?.required) item.sortText = '\x00' + label;
	return item;
}

export function createValueSnippet(value: unknown, info?: SchemaPropertyInfo): CompletionItem {
	const label = typeof value === 'string' ? value : JSON.stringify(value);
	const item = CompletionItem.create(label);
	item.kind = CompletionItemKind.Value;
	item.insertText = typeof value === 'string' ? `"${value}"` : String(value);
	const typeOf = value === null ? 'null' : typeof value;
	item.detail = buildDetail({ type: typeOf, ...info } as SchemaPropertyInfo);
	item.documentation = buildDocumentation({ type: typeOf, ...info } as SchemaPropertyInfo);
	return item;
}

export function createEnumSnippet(enumValues: unknown[]): CompletionItem[] {
	return enumValues.map((value, index) => {
		const item = CompletionItem.create(typeof value === 'string' ? value : JSON.stringify(value));
		item.kind = CompletionItemKind.Value;
		item.insertText = typeof value === 'string' ? `"${value}"` : String(value);
		item.detail = `📋 Enum ${index + 1}/${enumValues.length}`;
		item.documentation = buildDocumentation({
			type: typeof value,
			enumValues,
			description: `Valor enum: \`${JSON.stringify(value)}\``
		} as SchemaPropertyInfo);
		return item;
	});
}

export function createDefaultSnippets(): CompletionItem[] {
	const defaults = [
		{ label: 'true', value: true, type: 'boolean' },
		{ label: 'false', value: false, type: 'boolean' },
		{ label: 'null', value: null, type: 'null' },
		{ label: '"..."', value: '"..."', type: 'string' },
		{ label: '0', value: 0, type: 'number' },
		{ label: '1', value: 1, type: 'number' },
		{ label: '{}', value: '{}', type: 'object' },
		{ label: '[]', value: '[]', type: 'array' }
	];
	return defaults.map(def => {
		const item = CompletionItem.create(def.label);
		item.kind = def.type === 'object' || def.type === 'array' ? CompletionItemKind.Struct : CompletionItemKind.Value;
		item.insertText = String(def.value);
		item.detail = `${getTypeIcon(def.type)} ${def.type}`;
		item.sortText = '\x02' + def.label;
		return item;
	});
}

export function filterAndSortCompletions(items: CompletionItem[], maxItems: number = 500): CompletionItem[] {
	const COMMON_PREFIXES = ['id', 'name', 'type', 'key', 'value', 'data', 'config', 'settings'];
	const filtered = items.filter(item => item.label && item.kind !== CompletionItemKind.Text);
	filtered.sort((a, b) => {
		const aText = (a.sortText || String(a.label)).replace(/^[\x00-\x02]/, '').toLowerCase();
		const bText = (b.sortText || String(b.label)).replace(/^[\x00-\x02]/, '').toLowerCase();
		const aCommon = COMMON_PREFIXES.some(p => aText.startsWith(p));
		const bCommon = COMMON_PREFIXES.some(p => bText.startsWith(p));
		if (aCommon && !bCommon) return -1;
		if (!aCommon && bCommon) return 1;
		const aReq = (a.sortText || '').startsWith('\x00');
		const bReq = (b.sortText || '').startsWith('\x00');
		if (aReq && !bReq) return -1;
		if (!aReq && bReq) return 1;
		return aText.localeCompare(bText);
	});
	return filtered.slice(0, maxItems);
}
