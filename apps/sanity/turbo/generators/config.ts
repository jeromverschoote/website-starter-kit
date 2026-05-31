import fs from "node:fs";
import path from "node:path";

import type { PlopTypes } from "@turbo/gen";

/**
 * `turbo gen section` — scaffold a Sanity page-builder section schema in
 * src/sections/<name>-section.ts and register it in src/sections/index.ts
 * (import + allSectionModels + sectionEntries) so the studio picks it up.
 */
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // "feature-grid" -> "Feature Grid"
  plop.setHelper("humanize", (text: string) =>
    String(text)
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  );

  plop.setGenerator("section", {
    description: "A Sanity section schema, registered in src/sections/index.ts",
    prompts: [
      {
        type: "input",
        name: "name",
        message: 'Section name without the "-section" suffix (kebab-case, e.g. feature-grid):',
        validate: (value: string) =>
          /^[a-z][a-z0-9-]*$/.test(value) || "Use kebab-case: lower-case letters, digits and dashes.",
      },
    ],
    actions: () => [
      {
        type: "add",
        path: "src/sections/{{ kebabCase name }}-section.ts",
        templateFile: "templates/section.ts.hbs",
      },
      (data, _config, p) => {
        const { name } = data as { name: string };
        const kebab = p!.renderString("{{ kebabCase name }}", { name });
        const camel = p!.renderString("{{ camelCase name }}", { name });
        const title = p!.renderString("{{ humanize name }}", { name });
        const variable = `${camel}Section`;

        const indexPath = path.join(p!.getDestBasePath(), "src/sections/index.ts");
        let source = fs.readFileSync(indexPath, "utf8");

        if (source.includes(`from './${kebab}-section'`)) {
          return `section "${kebab}-section" already registered — left as-is`;
        }

        source = source
          .replace(
            "\n\nexport type SectionEntry",
            `\nimport ${variable} from './${kebab}-section';\n\nexport type SectionEntry`,
          )
          .replace(
            "export const allSectionModels: ObjectDefinition[] = [\n",
            `export const allSectionModels: ObjectDefinition[] = [\n  ${variable},\n`,
          )
          .replace(
            "  // Add new sections here",
            `  { model: ${variable}, title: '${title}', icon: ${variable}.icon },\n  // Add new sections here`,
          );

        fs.writeFileSync(indexPath, source);
        return `registered ${variable} in src/sections/index.ts`;
      },
    ],
  });
}
