import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  { pattern: /\[#f0f9fb\]/gi, replacement: 'sky-50' },
  { pattern: /\[#1a365d\]/gi, replacement: 'blue-900' },
  { pattern: /\[#008eac\]/gi, replacement: 'primary-dark' },
  { pattern: /\[#0b1424\]/gi, replacement: 'secondary-dark' },
  { pattern: /\[#050f1a\]/gi, replacement: 'slate-950' },
  { pattern: /\[#005b9f\]/gi, replacement: 'blue-700' },
  { pattern: /\[#0b6348\]/gi, replacement: 'emerald-800' },
  { pattern: /\[#e2e8f0\]/gi, replacement: 'slate-200' },
  { pattern: /\[#e11d48\]/gi, replacement: 'rose-600' },
  { pattern: /\[#facc15\]/gi, replacement: 'yellow-400' },
  { pattern: /\[#d97706\]/gi, replacement: 'amber-600' }
];

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let dirty = false;

    replacements.forEach(({ pattern, replacement }) => {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        dirty = true;
      }
    });
    
    if (dirty) {
      fs.writeFileSync(filePath, content);
      console.log('Updated hex colors in', filePath);
    }
  }
});
