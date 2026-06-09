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

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Unify h2 sizes
    content = content.replace(/text-2xl md:text-3xl lg:text-4xl font-extrabold/g, 'text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold');
    content = content.replace(/text-3xl md:text-4xl font-extrabold/g, 'text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold');
    content = content.replace(/text-3xl md:text-5xl font-extrabold/g, 'text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold');
    content = content.replace(/text-3xl font-extrabold/g, 'text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold');
    content = content.replace(/text-4xl md:text-6xl font-extrabold/g, 'text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold');
    
    // Some h2s might just be <h2 className="text-3xl font-bold ...
    // E.g. in about/NetworkPage.tsx
    content = content.replace(/<h2 className="text-3xl font-bold/g, '<h2 className="text-2xl md:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.15]');

    // About Page missing mb-3 md:mb-6 matching
    // Let's not touch the margins as they are specific to the component unless they are wildly off.
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log('Restyled h2 sizes in: ' + filePath);
    }
  }
});
