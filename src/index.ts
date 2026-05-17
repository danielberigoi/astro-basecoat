import type { AstroIntegration } from "astro";
import tailwindcss from "@tailwindcss/vite";

type Options = {};

export default function basecoat(_options: Options = {}): AstroIntegration {
	return {
		name: "astro-basecoat",
		hooks: {
			"astro:config:setup": ({ injectScript, updateConfig }) => {
				updateConfig({
					vite: { plugins: [tailwindcss() as never] },
				});
				injectScript("page-ssr", `import 'astro-basecoat/styles.css';`);
			},
		},
	};
}
