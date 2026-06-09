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

walkDir('./src/pages', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let dirty = false;

    // Standardize hero tag color
    let newContent = content.replace(/bg-\[#F7941D\] text-white font-bold tracking-wider text-\[10px\] mb-2 uppercase shadow-sm/g, 'bg-[#00A9CE] text-white font-bold tracking-wider text-[10px] mb-2 uppercase shadow-sm');
    
    // Unify padding to match global container standard format across generic sections
    // Instead of doing arbitrary replaces, let's target max-w-7xl and max-w-4xl that are left
    newContent = newContent.replace(/max-w-7xl mx-auto/g, 'max-w-[1260px] mx-auto w-full');
    
    // We update generic font classes
    newContent = newContent.replace(/<ChevronRight size={14} className="mx-2" \/>/g, '<ChevronRight size={14} className="mx-2 shrink-0" />');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log('Updated', filePath);
    }
  }
});
