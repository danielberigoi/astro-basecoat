import type { AstroIntegration } from "astro";

type Options = {};

export default function basecoat(_options: Options = {}): AstroIntegration {
	return {
		name: "astro-basecoat",
		hooks: {
			"astro:config:setup": ({ injectScript }) => {
				injectScript("page-ssr", `import 'astro-basecoat/styles.css';`);
			},
		},
	};
}
