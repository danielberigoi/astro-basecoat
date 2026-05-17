#!/usr/bin/env node
import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, "components");

type Cmd = "add" | "list" | "help";

async function listTemplates(): Promise<string[]> {
	const files = await readdir(TEMPLATES_DIR);
	return files
		.filter((f) => f.endsWith(".astro"))
		.map((f) => f.replace(/\.astro$/, ""));
}

async function prompt(question: string): Promise<string> {
	const rl = createInterface({ input: stdin, output: stdout });
	try {
		return await rl.question(question);
	} finally {
		rl.close();
	}
}

async function add(names: string[]): Promise<void> {
	if (names.length === 0) {
		console.error("Usage: astro-basecoat add <component...>");
		console.error("Run `astro-basecoat list` to see available components.");
		process.exit(1);
	}

	const available = new Set(await listTemplates());
	const unknown = names.filter((n) => !available.has(n));
	if (unknown.length > 0) {
		console.error(`Unknown component(s): ${unknown.join(", ")}`);
		console.error(`Available: ${[...available].join(", ")}`);
		process.exit(1);
	}

	const targetDir = resolve(process.cwd(), "src/components/ui");
	await mkdir(targetDir, { recursive: true });

	for (const name of names) {
		const src = join(TEMPLATES_DIR, `${name}.astro`);
		const dest = join(targetDir, `${name}.astro`);
		if (existsSync(dest)) {
			const answer = (await prompt(`  ${dest} exists. Overwrite? [y/N] `))
				.trim()
				.toLowerCase();
			if (answer !== "y" && answer !== "yes") {
				console.log(`  skipped ${name}`);
				continue;
			}
		}
		await copyFile(src, dest);
		console.log(`  ✓ src/components/ui/${name}.astro`);
	}
}

function help(): void {
	console.log(`astro-basecoat — Basecoat UI components for Astro

Usage:
  astro-basecoat add <component...>   Copy components into src/components/ui/
  astro-basecoat list                 List available components
  astro-basecoat help                 Show this message
`);
}

async function main(): Promise<void> {
	const [cmd, ...args] = process.argv.slice(2) as [
		Cmd | undefined,
		...string[],
	];
	switch (cmd) {
		case "add":
			await add(args);
			break;
		case "list": {
			const names = await listTemplates();
			for (const n of names) console.log(n);
			break;
		}
		case "help":
		case undefined:
			help();
			break;
		default:
			console.error(`Unknown command: ${cmd}`);
			help();
			process.exit(1);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
