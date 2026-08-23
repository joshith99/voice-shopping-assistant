export function substitutesFor(
	listNames: string[],
	substitutes: Record<string, string[]>
): string[] {
	const result: string[] = [];
	for (const name of listNames) {
		for (const alternative of substitutes[name] ?? []) {
			if (!listNames.includes(alternative) && !result.includes(alternative)) {
				result.push(alternative);
			}
		}
	}
	return result;
}
