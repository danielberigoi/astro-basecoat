<table border=0>
  <tr>
    <td><img src="https://astro.build/assets/press/astro-icon-dark.svg" alt="Astro" width="64" height="64"></td>
    <td><img src="https://basecoatui.com/assets/favicon.svg" alt="Basecoat UI" width="64" height="64"></td>
  </tr>
  
</table>

# astro-basecoat

> 🚧 **Work in progress.** APIs, component props, and the CLI may change without notice while this stabilizes. Feedback and issues are very welcome.

Astro integration for [**Basecoat UI**](https://basecoatui.com) — wires up Tailwind v4 and gives you a shadcn-style CLI to drop component source files into your project.

> Every component, every class, and every line of CSS/JS in this package comes from [Basecoat UI](https://basecoatui.com) by [@hunvreus](https://github.com/hunvreus). This integration is a thin Astro-shaped wrapper around their work — please [star the upstream repo](https://github.com/hunvreus/basecoat) and check out the [component gallery](https://basecoatui.com/components/).

```sh
npm i -D astro-basecoat tailwindcss @tailwindcss/vite basecoat-css
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import basecoat from 'astro-basecoat';

export default defineConfig({
  integrations: [basecoat()],
});
```

```sh
npx astro-basecoat add button alert card
```

```astro
---
import Button from '../components/ui/button.astro';
import Alert from '../components/ui/alert.astro';
---
<Alert title="Heads up">Components live in your project — edit freely.</Alert>
<Button variant="primary">Click</Button>
```

## What this gives you

- **Zero-config Tailwind v4** — the integration auto-installs `@tailwindcss/vite` and injects a stylesheet that pulls in Tailwind + Basecoat. No Vite plugin wiring, no `@import` lines to write.
- **shadcn-style component CLI** — `npx astro-basecoat add <component>` copies `.astro` source files into `src/components/ui/`. You own the code and customize freely.
- **Per-component JS** — interactive components carry their own `<script>` block. Astro bundles per page and dedupes the shared core, so a page using only `<Button>` ships zero JS.
- **Type-safe props** — every component is typed; passes through `class` and native attributes.

## Available components

Run `npx astro-basecoat list` to see what's available. The current set:

| Component | JS required |
| --- | --- |
| `alert` | — |
| `badge` | — |
| `button` | — |
| `card` | — |
| `input` | — |
| `tabs` | yes |

More are on the way; PRs welcome.

## CLI

```sh
npx astro-basecoat add <component...>   # copy components into src/components/ui/
npx astro-basecoat list                 # list available components
npx astro-basecoat help                 # show usage
```

The CLI prompts before overwriting an existing file.

## Usage examples

### Button

```astro
---
import Button from '../components/ui/button.astro';
---
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" size="lg">Buy now</Button>
<Button icon variant="ghost" aria-label="Settings">
  <svg><!-- icon --></svg>
</Button>
```

Props: `variant` (`primary` | `secondary` | `destructive` | `outline` | `ghost` | `link`), `size` (`default` | `sm` | `lg`), `icon` (boolean), plus any native `<button>` attribute.

### Alert

```astro
---
import Alert from '../components/ui/alert.astro';
---
<Alert title="Heads up" variant="default">Something happened.</Alert>
<Alert title="Error" variant="destructive">Something broke.</Alert>
```

Slots: `icon` (optional), default (description).

### Card

```astro
---
import Card from '../components/ui/card.astro';
---
<Card title="Title" description="Description">
  <p>Body content.</p>
  <p slot="footer">Footer text.</p>
</Card>
```

Slots: `header` (overrides `title`/`description`), default (body), `footer`.

### Tabs

```astro
---
import Tabs from '../components/ui/tabs.astro';
---
<Tabs
  id="account-tabs"
  tabs={[
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
  ]}
>
  <div slot="profile">Profile content</div>
  <div slot="security">Security content</div>
</Tabs>
```

## How the JS injection works

The integration only injects CSS. JS for interactive components is opt-in: each `.astro` template that needs JS imports its specific Basecoat script (and the shared core) in its own `<script>` block:

```astro
<script>
  import 'basecoat-css/dist/js/basecoat.min.js';
  import 'basecoat-css/dist/js/tabs.min.js';
</script>
```

Astro bundles per page and dedupes — pages that don't use the component pay nothing.

## Tailwind v4

The integration wires `@tailwindcss/vite` for you. If you already have `@tailwindcss/vite` registered elsewhere, that's fine — Vite tolerates the duplicate.

To customize Tailwind, drop a `tailwind.config.js` (Tailwind v4 reads it automatically when present) or use the new `@theme` block in a CSS file:

```css
/* src/styles/theme.css — import this from a layout */
@theme {
  --color-primary: oklch(0.5 0.2 250);
}
```

For shadcn-compatible theming, follow the [Basecoat theming docs](https://basecoatui.com/installation/).

## Customizing components

Components are *your code* after `astro-basecoat add`. Edit the file in `src/components/ui/` directly — props, markup, classes, anything. If you want to start over, re-run the CLI; it prompts before overwriting.

## Configuration

The integration currently takes no options. Per-component configuration (size defaults, theme variants) is on the roadmap.

```js
basecoat()  // that's it
```

## Versioning

The package version tracks the `basecoat-css` minor it's tested against. Peer-deps are loose so newer patch versions of Basecoat work without an update here.

## Contributing

```sh
git clone https://github.com/danielberigoi/astro-basecoat
cd astro-basecoat
npm install
npm run build
```

Adding a new component: drop a file in `src/components/<name>.astro`, run `npm run build`, and it's available via `npx astro-basecoat add <name>` once published.

## Credits

This package would not exist without [**Basecoat UI**](https://basecoatui.com) — a beautiful, framework-agnostic Tailwind v4 component library by [@hunvreus](https://github.com/hunvreus). All visual design, CSS, and JS belong to Basecoat. If you find this integration useful, please:

- ⭐ Star [hunvreus/basecoat](https://github.com/hunvreus/basecoat)
- 📖 Read the [Basecoat docs](https://basecoatui.com)
- 🎨 Browse the [component gallery](https://basecoatui.com/components/)
- 💬 Join the conversation on [Basecoat's discussions](https://github.com/hunvreus/basecoat/discussions)

`astro-basecoat` is an independent, community-maintained project and is not affiliated with the Basecoat team.

## License

MIT © Daniel Berigoi. Basecoat itself is also MIT-licensed by its respective authors.
