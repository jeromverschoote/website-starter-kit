import fs from "node:fs";
import path from "node:path";

import type { PlopTypes } from "@turbo/gen";

/**
 * `turbo gen data-source` — scaffold a data-layer source under
 * src/sources/<name> (an error-wrapped fetcher + test) and register it in
 * package.json `exports` so it imports as `@repo/data/<name>`.
 */
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("data-source", {
    description: "A data source (src/sources/<name>) + test, registered in package.json exports",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Source name (kebab-case, e.g. strapi):",
        validate: (value: string) =>
          /^[a-z][a-z0-9-]*$/.test(value) || "Use kebab-case: lower-case letters, digits and dashes.",
      },
    ],
    actions: () => {
      const dir = "src/sources/{{ kebabCase name }}";

      return [
        {
          type: "add",
          path: `${dir}/index.ts`,
          templateFile: "templates/source.ts.hbs",
        },
        {
          type: "add",
          path: `${dir}/index.test.ts`,
          templateFile: "templates/source.test.ts.hbs",
        },
        (data, _config, p) => {
          const { name } = data as { name: string };
          const kebab = p!.renderString("{{ kebabCase name }}", { name });
          const pkgPath = path.join(p!.getDestBasePath(), "package.json");
          const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
            exports: Record<string, string>;
          };
          const key = `./${kebab}`;
          if (pkg.exports[key]) return `exports["${key}"] already present — left as-is`;
          pkg.exports = { ...pkg.exports, [key]: `./src/sources/${kebab}/index.ts` };
          fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
          return `registered exports["${key}"] in package.json`;
        },
      ];
    },
  });
}
