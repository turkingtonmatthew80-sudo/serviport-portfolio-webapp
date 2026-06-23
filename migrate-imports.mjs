import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (let file of list) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  }
  return results;
}

const files = walk('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

for (let file of files) {
  if (file.includes('db-wrapper.ts')) continue;
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (content.includes('from "firebase/firestore"')) {
    content = content.replace(/from "firebase\/firestore"/g, 'from "@/src/lib/db-wrapper"');
    changed = true;
  }
  if (content.includes("from 'firebase/firestore'")) {
    content = content.replace(/from 'firebase\/firestore'/g, 'from "@/src/lib/db-wrapper"');
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, content);
  }
}
