import { chmod, copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "src", "components");
const outDir = join(root, "dist", "components");
const cliPath = join(root, "dist", "cli.js");

await mkdir(outDir, { recursive: true });

const entries = await readdir(srcDir);
for (const file of entries) {
	if (!file.endsWith(".astro")) continue;
	await copyFile(join(srcDir, file), join(outDir, file));
}

await copyFile(join(root, "src", "styles.css"), join(root, "dist", "styles.css"));

const shebang = "#!/usr/bin/env node\n";
const cli = await readFile(cliPath, "utf8");
if (!cli.startsWith(shebang)) {
	await writeFile(cliPath, shebang + cli);
}
await chmod(cliPath, 0o755);
