/**
 * Phosphor instead of Font Awesome Pro (31 Oct 2026): every icon an editor
 * picked (the announcement banner, the socials) gets its Phosphor name and
 * the weight the site draws in. Until this has run on a dataset, the site
 * translates the old names itself (packages/ui/src/components/icon);
 * `FONT_AWESOME_NAMES` is the one list both read.
 *
 *   SANITY_STUDIO_DATASET_ID=development npx sanity exec scripts/migrate-icons.ts --with-user-token -- [--dry-run] [--production]
 *
 * Runs against the dataset in the environment and refuses `production`
 * unless --production is given. Idempotent: a Phosphor name in the right
 * weight is left alone. The whole documents, drafts included, land in
 * `scripts/backups/` before the first write.
 */
import { mkdirSync, writeFileSync } from 'node:fs';

import { icons } from '@phosphor-icons/core';
import { getCliClient } from 'sanity/cli';

import { FONT_AWESOME_NAMES } from '@repo/ui/icon-names';

const API_VERSION = '2025-02-19';
const PRODUCTION_FLAG = '--production';

/** The weight a migrated icon gets: the site's default. */
const WEIGHT = 'bold';

const PHOSPHOR = new Set<string>(icons.map((icon) => icon.name));

const hasFlag = (flag: string) => process.argv.includes(flag);
const isDryRun = hasFlag('--dry-run');

/** `raw` sees drafts and published documents alike. */
const client = getCliClient({ apiVersion: API_VERSION }).withConfig({
  perspective: 'raw',
});

/** A document as the Content Lake stores it: what a restore puts back. */
type TStoredDocument = { _id: string; _type: string; _rev: string };

type TIcon = { type?: string; accessor?: string };
type TDoc = {
  _id: string;
  _type: string;
  icon?: TIcon;
  button?: { icon?: TIcon };
};

/**
 * The production guard: the live dataset is touched only on purpose, with the
 * flag. Returns the dataset name, so the backup can be named after it.
 */
const openDataset = () => {
  const dataset = client.config().dataset;

  if (!dataset) {
    throw new Error('no dataset configured; set SANITY_STUDIO_DATASET_ID');
  }
  if (dataset === 'production' && !hasFlag(PRODUCTION_FLAG)) {
    throw new Error(
      `refusing the production dataset without ${PRODUCTION_FLAG}`,
    );
  }

  console.log(`Dataset: ${dataset}${isDryRun ? ' (dry run)' : ''}`);
  return dataset;
};

/**
 * Fetches the whole documents with these ids, and the draft of each, and
 * writes them to `backups/` (ignored by git). Whole documents, not the
 * projection below: `_id`, `_type` and `_rev` are what
 * `sanity dataset import --replace` needs to put a document back.
 */
const backupDocuments = async (dataset: string, ids: string[]) => {
  const published = ids.map((id) => id.replace(/^drafts\./, ''));
  const wanted = [...new Set(published.flatMap((id) => [id, `drafts.${id}`]))];
  const docs = await client.fetch<TStoredDocument[]>('*[_id in $ids]', {
    ids: wanted,
  });

  const directory = new URL('./backups/', import.meta.url);
  mkdirSync(directory, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = new URL(`${stamp}-${dataset}-icons.json`, directory);
  writeFileSync(backup, JSON.stringify(docs, null, 2));

  console.log(`Backup: ${backup.pathname} (${docs.length} documents)`);
};

/** Where a document keeps its icon: the announcement on `icon`, the socials on `button.icon`. */
const toPath = (doc: TDoc) =>
  doc._type === 'socials-settings' ? 'button.icon' : 'icon';

const run = async () => {
  const dataset = openDataset();

  const docs: TDoc[] = await client.fetch(
    '*[defined(icon.accessor) || defined(button.icon.accessor)]{ _id, _type, icon, button }',
  );

  if (!docs.length) {
    console.log('No document holds an icon. Nothing to do.');
    return;
  }

  await backupDocuments(
    dataset,
    docs.map((doc) => doc._id),
  );

  const transaction = client.transaction();
  let changes = 0;

  for (const doc of docs) {
    const path = toPath(doc);
    const icon = path === 'icon' ? doc.icon : doc.button?.icon;
    const accessor = icon?.accessor ?? '';
    const next = FONT_AWESOME_NAMES[accessor] ?? accessor;

    if (!PHOSPHOR.has(next)) {
      console.log(
        `No Phosphor icon for "${accessor}" (${doc._id}), left alone.`,
      );
      continue;
    }
    if (next === accessor && icon?.type === WEIGHT) continue;

    changes++;
    console.log(`- ${doc._id}: ${icon?.type} ${accessor} → ${WEIGHT} ${next}`);
    transaction.patch(doc._id, (patch) =>
      patch.set({ [`${path}.accessor`]: next, [`${path}.type`]: WEIGHT }),
    );
  }

  if (!changes) {
    console.log('Nothing to do.');
    return;
  }
  if (isDryRun) {
    console.log(`${changes} changes, none written (dry run).`);
    return;
  }

  await transaction.commit({ autoGenerateArrayKeys: false });
  console.log(`${changes} changes written.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
