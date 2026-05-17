import { execSync } from "node:child_process";
import { readdirSync, unlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const demo = join(root, "demo");

// Clean any prior tarballs in demo so the glob below resolves to one file.
for (const f of readdirSync(demo)) {
	if (f.startsWith("astro-basecoat-") && f.endsWith(".tgz")) {
		unlinkSync(join(demo, f));
	}
}

const tarball = execSync(`npm pack --pack-destination "${demo}" --silent`, {
	cwd: root,
	encoding: "utf8",
}).trim();

execSync(`npm install ./${tarball}`, { cwd: demo, stdio: "inherit" });
