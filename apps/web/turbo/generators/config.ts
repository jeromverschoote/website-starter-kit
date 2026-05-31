import fs from "node:fs";
import path from "node:path";

import type { PlopTypes } from "@turbo/gen";

/**
 * `turbo gen view` — scaffold a page/view following the component guidelines:
 * views/<feature>/landing (page that composes a Suspense'd async section that
 * owns its Sanity fetch + co-located .queries.ts), the matching app route with
 * loading handler, and the view's dictionary keys.
 */
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // "case-studies" -> "Case Studies"
  plop.setHelper("humanize", (text: string) =>
    String(text)
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  );

  plop.setGenerator("view", {
    description: "A page/view (views/<feature>/landing) + app route + an async section",
    prompts: [
      {
        type: "input",
        name: "feature",
        message: "Feature name (kebab-case, e.g. about):",
        validate: (value: string) =>
          /^[a-z][a-z0-9-]*$/.test(value) || "Use kebab-case: lower-case letters, digits and dashes.",
      },
    ],
    actions: () => {
      const view = "src/views/{{ kebabCase feature }}/landing";
      const section = `${view}/_components/{{ kebabCase feature }}-intro`;
      const route = "src/app/[locale]/{{ kebabCase feature }}";

      return [
        { type: "add", path: `${view}/{{ kebabCase feature }}-landing-page.tsx`, templateFile: "templates/page.tsx.hbs" },
        { type: "add", path: `${view}/{{ kebabCase feature }}-landing-page.queries.ts`, templateFile: "templates/page.queries.ts.hbs" },
        { type: "add", path: `${view}/{{ kebabCase feature }}-landing-page.styles.ts`, templateFile: "templates/page.styles.ts.hbs" },
        { type: "add", path: `${view}/index.ts`, templateFile: "templates/page.index.ts.hbs" },
        { type: "add", path: `${section}/{{ kebabCase feature }}-intro.tsx`, templateFile: "templates/section.tsx.hbs" },
        { type: "add", path: `${section}/{{ kebabCase feature }}-intro.styles.ts`, templateFile: "templates/section.styles.ts.hbs" },
        { type: "add", path: `${section}/index.ts`, templateFile: "templates/section.index.ts.hbs" },
        { type: "add", path: `${route}/page.ts`, templateFile: "templates/route.page.ts.hbs" },
        { type: "add", path: `${route}/loading.tsx`, templateFile: "templates/route.loading.tsx.hbs" },
        (data, _config, p) => {
          const { feature } = data as { feature: string };
          const camel = p!.renderString("{{ camelCase feature }}", { feature });
          const human = p!.renderString("{{ humanize feature }}", { feature });
          const dictPath = path.join(p!.getDestBasePath(), "src/dictionaries/en.json");
          const dict = JSON.parse(fs.readFileSync(dictPath, "utf8")) as {
            view?: Record<string, unknown>;
          };
          dict.view = dict.view ?? {};
          if (dict.view[camel]) return `view.${camel} already present in en.json — left as-is`;
          dict.view[camel] = {
            intro: {
              heading: human,
              description: `Replace this with your ${human} content.`,
            },
          };
          fs.writeFileSync(dictPath, `${JSON.stringify(dict, null, 2)}\n`);
          return `added view.${camel} to en.json`;
        },
      ];
    },
  });
}
