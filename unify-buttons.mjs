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

const largeButtons = [
  /px-3 md:px-10 py-1.5 md:py-4.*?text-\[9px\] md:text-base/g,          // Hero
  /px-3 md:px-10 py-1 md:py-4.*?text-\[9px\] md:text-base/g,             // Hero secondary
  /px-6 md:px-10 py-2.5 md:py-4.*?text-xs md:text-base/g,              // Services
  /px-8 md:px-10 py-4.*?text-sm md:text-base/g                           // News
];
const largeReplacement = 'px-6 md:px-10 py-3 md:py-4 rounded font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-accent/20 flex items-center justify-center gap-2 md:gap-3 text-center text-xs md:text-base uppercase tracking-wider w-fit';

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // We can just regex replace the specific class names for the Hero buttons since they are most egregious
    content = content.replace(/px-3 md:px-10 py-1\.5 md:py-4.*?text-\[9px\] md:text-base/g, 'px-6 md:px-10 py-3 md:py-4 rounded font-bold transition-colors flex items-center justify-center gap-2 text-center text-xs md:text-base');
    content = content.replace(/px-3 md:px-10 py-1 md:py-4.*?text-\[9px\] md:text-base/g, 'px-6 md:px-10 py-3 md:py-4 rounded font-bold transition-colors flex items-center justify-center gap-2 text-center text-xs md:text-base');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log('Restyled buttons in: ' + filePath);
    }
  }
});
