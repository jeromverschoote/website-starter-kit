/**
 * Printed after `yarn install`. Nudges fresh template clones to run the
 * initializer. Silent in CI and once the repo has been renamed (i.e. set up).
 * Must never fail — it always exits 0 so it can't break installs.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

try {
  if (process.env.CI) process.exit(0);

  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

  if (pkg.name === "website-starter-kit") {
    console.log(
      "\n[33m→ This looks like a fresh template clone.[0m\n" +
        "  Run [1myarn init:project[0m to finish setup " +
        "(see docs/init-checklist.md).\n",
    );
  }
} catch {
  /* never block install */
}

process.exit(0);
