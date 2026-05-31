import fs from "node:fs";
import path from "node:path";

import type { PlopTypes } from "@turbo/gen";

/**
 * `turbo gen component` — scaffold a UI component the way this package expects:
 * a folder with <name>.tsx + <name>.test.tsx + index.ts (optionally a
 * <name>.styles.ts), and an entry in package.json `exports` so it can be
 * imported as `@repo/ui/<name>`. Encodes the layout + naming once so it is
 * identical whether a human or an agent runs it.
 */
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("component", {
    description: "A UI component folder (+ test, index, optional styles) registered in package.json exports",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Component name (kebab-case, e.g. user-card):",
        validate: (value: string) =>
          /^[a-z][a-z0-9-]*$/.test(value) || "Use kebab-case: lower-case letters, digits and dashes.",
      },
      {
        type: "confirm",
        name: "withStyles",
        message: "Include a <name>.styles.ts file?",
        default: false,
      },
    ],
    actions: (answers) => {
      const { withStyles } = answers as { name: string; withStyles: boolean };
      const dir = "src/components/{{ kebabCase name }}";

      const actions: PlopTypes.ActionType[] = [
        {
          type: "add",
          path: `${dir}/{{ kebabCase name }}.tsx`,
          templateFile: "templates/component.tsx.hbs",
        },
        {
          type: "add",
          path: `${dir}/{{ kebabCase name }}.test.tsx`,
          templateFile: "templates/component.test.tsx.hbs",
        },
        {
          type: "add",
          path: `${dir}/index.ts`,
          templateFile: "templates/index.ts.hbs",
        },
      ];

      if (withStyles) {
        actions.push({
          type: "add",
          path: `${dir}/{{ kebabCase name }}.styles.ts`,
          templateFile: "templates/component.styles.ts.hbs",
        });
      }

      // Register the component in package.json `exports` (append, preserving order).
      actions.push((data, _config, p) => {
        const { name } = data as { name: string };
        const kebab = p!.renderString("{{ kebabCase name }}", { name });
        const pkgPath = path.join(p!.getDestBasePath(), "package.json");
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8")) as {
          exports: Record<string, string>;
        };
        const key = `./${kebab}`;
        if (pkg.exports[key]) return `exports["${key}"] already present — left as-is`;
        pkg.exports = { ...pkg.exports, [key]: `./src/components/${kebab}/index.ts` };
        fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
        return `registered exports["${key}"] in package.json`;
      });

      return actions;
    },
  });
}
