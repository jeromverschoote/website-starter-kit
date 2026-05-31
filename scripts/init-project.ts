/**
 * One-shot project initializer for repositories created from this template.
 *
 *   yarn init:project                  # interactive
 *   yarn init:project --non-interactive --name acme-site --sanity-id abc123
 *   yarn init:project --protect --verify
 *   yarn init:project --dry-run        # show what would change, write nothing
 *
 * Safe to re-run: it refuses to touch an already-initialized repo unless
 * --force is passed, and never overwrites an existing .env. The repo is
 * considered "initialized" once the root package.json name is no longer
 * "website-starter-kit" (so there is no sentinel file to track).
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const TEMPLATE_NAME = "website-starter-kit";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const { values: flags } = parseArgs({
  options: {
    name: { type: "string" },
    title: { type: "string" },
    author: { type: "string" },
    "author-url": { type: "string" },
    "base-url": { type: "string" },
    "sanity-id": { type: "string" },
    "sanity-dataset": { type: "string" },
    protect: { type: "boolean", default: false },
    verify: { type: "boolean", default: false },
    "git-init": { type: "boolean", default: false },
    "non-interactive": { type: "boolean", default: false },
    force: { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false },
    help: { type: "boolean", default: false },
  },
});

const dry = flags["dry-run"] ?? false;
const interactive = !flags["non-interactive"] && stdin.isTTY;
const remaining: string[] = [];

if (flags.help) {
  console.log(
    "Usage: yarn init:project [--name --title --author --author-url --base-url\n" +
      "  --sanity-id --sanity-dataset] [--git-init] [--protect] [--verify]\n" +
      "  [--non-interactive] [--force] [--dry-run]",
  );
  process.exit(0);
}

function run(cmd: string, input?: string) {
  if (dry) {
    console.log(`  [dry-run] ${cmd}`);
    return "";
  }
  return execSync(cmd, { cwd: ROOT, input, encoding: "utf8", stdio: input ? "pipe" : "inherit" }) ?? "";
}

function writeText(rel: string, content: string) {
  if (dry) {
    console.log(`  [dry-run] write ${rel}`);
    return;
  }
  writeFileSync(join(ROOT, rel), content);
}

const rl = interactive ? createInterface({ input: stdin, output: stdout }) : null;
async function ask(question: string, fallback: string): Promise<string> {
  if (!rl) return fallback;
  const answer = (await rl.question(`${question}${fallback ? ` (${fallback})` : ""}: `)).trim();
  return answer || fallback;
}

function titleCase(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function setEnvValue(content: string, key: string, value: string): string {
  if (!value) return content;
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  return re.test(content) ? content.replace(re, line) : `${content}\n${line}\n`;
}

function gitRemoteSlug(): string | null {
  try {
    const url = execSync("git remote get-url origin", { cwd: ROOT, encoding: "utf8" }).trim();
    const match = /github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/.exec(url);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function main() {
  const pkgPath = join(ROOT, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { name: string };

  if (pkg.name !== TEMPLATE_NAME && !flags.force) {
    console.log(
      `This repo is already initialized (package name is "${pkg.name}").\n` +
        "Pass --force to run the steps again.",
    );
    rl?.close();
    return;
  }

  const slug = gitRemoteSlug();
  const defaultName = flags.name ?? slug?.split("/")[1] ?? TEMPLATE_NAME;

  const name = flags.name ?? (await ask("Project name (package.json)", defaultName));
  const title = flags.title ?? (await ask("Display title (page <head>)", titleCase(name)));
  const author = flags.author ?? (await ask("Author name", ""));
  const authorUrl = flags["author-url"] ?? (await ask("Author URL", ""));
  const baseUrl = flags["base-url"] ?? (await ask("Site base URL", "https://www.example.com"));
  const sanityId = flags["sanity-id"] ?? (await ask("Sanity project ID", ""));
  const sanityDataset = flags["sanity-dataset"] ?? (await ask("Sanity dataset", "production"));
  rl?.close();

  console.log("\nApplying setup...\n");

  // 1. Rename the root package (this is also the "initialized" sentinel).
  if (name !== pkg.name) {
    pkg.name = name;
    writeText("package.json", `${JSON.stringify(pkg, null, 2)}\n`);
    console.log(`  package.json name -> ${name}`);
  }

  // 2. Create .env files from their examples and fill in known values.
  for (const [example, target, isRoot] of [
    [".env.example", ".env", true],
    ["apps/sanity/.env.example", "apps/sanity/.env", false],
  ] as const) {
    if (existsSync(join(ROOT, target))) {
      console.log(`  ${target} exists — left untouched`);
      continue;
    }
    if (dry) {
      console.log(`  [dry-run] create ${target} from ${example}`);
      continue;
    }
    copyFileSync(join(ROOT, example), join(ROOT, target));
    let content = readFileSync(join(ROOT, target), "utf8");
    content = setEnvValue(content, "SANITY_STUDIO_PROJECT_ID", sanityId);
    content = setEnvValue(content, "SANITY_STUDIO_DATASET_ID", sanityDataset);
    if (isRoot) {
      content = setEnvValue(content, "AUTHOR_NAME", author);
      content = setEnvValue(content, "AUTHOR_URL", authorUrl);
      content = setEnvValue(content, "NEXT_SITEMAP_BASE_DOMAIN_URL", baseUrl);
    }
    writeFileSync(join(ROOT, target), content);
    console.log(`  ${target} created`);
  }

  // 3. Replace the "Starter" placeholder title in the root metadata.
  const layoutRel = "apps/web/src/app/layout.ts";
  if (existsSync(join(ROOT, layoutRel))) {
    const layout = readFileSync(join(ROOT, layoutRel), "utf8");
    if (layout.includes("Starter")) {
      writeText(layoutRel, layout.replaceAll("Starter", title));
      console.log(`  ${layoutRel} title -> ${title}`);
    }
  }

  // 4. Replace the template README with a project one (but never clobber a
  //    README the user has already customized).
  const readmePath = join(ROOT, "README.md");
  const isTemplateReadme =
    existsSync(readmePath) && readFileSync(readmePath, "utf8").startsWith(`# ${TEMPLATE_NAME}`);
  if (!existsSync(readmePath) || isTemplateReadme) {
    writeText(
      "README.md",
      `# ${title}\n\nCreated from the website-starter-kit template.\n\n` +
        "See [`docs/init-checklist.md`](docs/init-checklist.md) for remaining setup steps.\n",
    );
    console.log("  README.md scaffolded");
  } else {
    console.log("  README.md exists (customized) — left untouched");
  }

  // 5. Git. With --git-init (e.g. after a degit clone with no history) start a
  //    fresh repo; otherwise just ensure the `development` branch exists.
  const inRepo = (() => {
    try {
      execSync("git rev-parse --is-inside-work-tree", { cwd: ROOT, stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  })();
  try {
    if (!inRepo && flags["git-init"]) {
      run("git init");
      run("git add -A");
      run('git commit -m "Initial commit"');
      run("git branch development");
      console.log("  git initialized (initial commit + development branch)");
    } else if (!inRepo) {
      remaining.push("Initialize git (`git init`) and create a `development` branch — or re-run with --git-init.");
    } else {
      const hasDev = (() => {
        try {
          execSync("git show-ref --verify --quiet refs/heads/development", { cwd: ROOT });
          return true;
        } catch {
          return false;
        }
      })();
      if (hasDev) {
        console.log("  development branch already exists");
      } else {
        run("git branch development");
        console.log("  development branch created");
      }
    }
  } catch {
    remaining.push("Set up git: `git init` (if needed) and create a `development` branch.");
  }

  // 6. Optional: server-side branch protection on main.
  if (flags.protect) {
    const protectSlug = slug;
    let authed = false;
    try {
      execSync("gh auth status", { stdio: "ignore" });
      authed = true;
    } catch {
      /* not authenticated */
    }
    if (protectSlug && authed) {
      const body = JSON.stringify({
        required_status_checks: {
          strict: true,
          checks: [
            { context: "Verify Code Quality" },
            { context: "Run End-to-End Tests" },
            { context: "Verify Bundle Size" },
          ],
        },
        enforce_admins: true,
        required_pull_request_reviews: { required_approving_review_count: 0 },
        restrictions: null,
        allow_force_pushes: false,
        allow_deletions: false,
      });
      try {
        run(
          `gh api -X PUT repos/${protectSlug}/branches/main/protection ` +
            `-H "Accept: application/vnd.github+json" --input -`,
          body,
        );
        console.log(`  branch protection applied to ${protectSlug}@main`);
      } catch {
        remaining.push(`Apply branch protection to ${protectSlug}@main (gh api call failed).`);
      }
    } else {
      remaining.push(
        "Apply branch protection: needs a GitHub `origin` remote and an authenticated `gh` CLI (`gh auth login`).",
      );
    }
  } else {
    remaining.push("Apply branch protection to `main` (re-run with --protect, or see docs/init-checklist.md).");
  }

  // 7. Optional: verify a green baseline.
  if (flags.verify) {
    console.log("\nVerifying...\n");
    run("yarn lint");
    run("yarn workspace @repo/web check-types");
    run("yarn workspace @repo/ui check-types");
    run("yarn test");
  } else {
    remaining.push("Verify the baseline: yarn lint && check-types && yarn test && build.");
  }

  // Always-manual follow-ups.
  if (!sanityId) remaining.push("Create a Sanity project and set SANITY_STUDIO_PROJECT_ID.");
  remaining.push("Replace placeholder sitemap slugs in apps/web/src/app/sitemap.ts.");
  remaining.push("Fill remaining secrets/integration env vars (see .env / docs/init-checklist.md).");
  remaining.push("Add GitHub Actions secrets needed by CI.");

  console.log("\nDone." + (dry ? " (dry run — nothing was written.)" : ""));
  console.log("\nRemaining manual steps:");
  for (const step of remaining) console.log(`  - ${step}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
