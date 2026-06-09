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
  { pattern: /\[#00a9ce\]/gi, replacement: 'primary' },
  { pattern: /\[#f7941d\]/gi, replacement: 'accent' },
  { pattern: /\[#0b1a2e\]/gi, replacement: 'secondary' },
  { pattern: /\[#008ebf\]/gi, replacement: 'primary' }, // We saw one #008EBF earlier! Replace with primary.
  { pattern: /\[#e0861a\]/gi, replacement: 'orange-500' }, // For hover:bg-[#e0861a] -> hover:bg-orange-500
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
