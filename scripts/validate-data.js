#!/usr/bin/env node
/**
 * validate-data.js — validate the data files against schema/data-schema.json.
 *
 * Usage: npm run validate
 *
 * Checks:
 *   data/chakras.json         → each entry in  chakras[]  against definitions/chakra
 *   data/sephirot.json        → each entry in  sephirot[] against definitions/sephira
 *   data/correspondences.json → each entry in  mappings[] against definitions/correspondence
 *
 * Exits non-zero if any file fails to parse or any entry fails validation.
 */
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ROOT = path.join(__dirname, '..');

const schema = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'schema', 'data-schema.json'), 'utf8')
);

const ajv = new Ajv({ allErrors: true, strict: false });

function compileDefinition(name) {
  return ajv.compile({
    definitions: schema.definitions,
    $ref: `#/definitions/${name}`,
  });
}

const CHECKS = [
  {
    file: 'data/chakras.json',
    definition: 'chakra',
    getItems: (data) => data.chakras,
    label: 'chakras',
  },
  {
    file: 'data/sephirot.json',
    definition: 'sephira',
    getItems: (data) => data.sephirot,
    label: 'sephirot',
  },
  {
    file: 'data/correspondences.json',
    definition: 'correspondence',
    getItems: (data) => data.mappings,
    label: 'correspondence mappings',
  },
];

let failures = 0;

for (const check of CHECKS) {
  const filePath = path.join(ROOT, check.file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`[FAIL] ${check.file}: cannot parse JSON — ${err.message}`);
    failures++;
    continue;
  }

  const items = check.getItems(data);
  if (!Array.isArray(items)) {
    console.error(`[FAIL] ${check.file}: expected an array at the top level of "${check.label}"`);
    failures++;
    continue;
  }

  const validate = compileDefinition(check.definition);
  const bad = [];
  items.forEach((item, index) => {
    if (!validate(item)) {
      bad.push({ index, item, errors: validate.errors || [] });
    }
  });

  if (bad.length === 0) {
    console.log(`[OK]   ${check.file}: ${items.length} ${check.label} valid against "${check.definition}"`);
  } else {
    failures++;
    console.error(`[FAIL] ${check.file}: ${bad.length}/${items.length} ${check.label} failed "${check.definition}":`);
    for (const { index, item, errors } of bad.slice(0, 5)) {
      const id = (item && (item.id || item.tradition)) || `#${index}`;
      for (const e of errors.slice(0, 3)) {
        console.error(`       ${id}${e.instancePath || ''} ${e.message}`);
      }
    }
    if (bad.length > 5) console.error(`       ... and ${bad.length - 5} more`);
  }
}

if (failures > 0) {
  console.error(`\nValidation FAILED for ${failures} file(s).`);
  process.exit(1);
}
console.log('\nAll data files valid.');
