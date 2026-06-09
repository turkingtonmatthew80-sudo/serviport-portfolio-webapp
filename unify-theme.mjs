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

    // Hardcoded Colors to CSS variables
    content = content.replace(/bg-\[#0b1a2e\]/g, 'bg-secondary');
    content = content.replace(/text-\[#0b1a2e\]/g, 'text-secondary');
    content = content.replace(/border-\[#0b1a2e\]/g, 'border-secondary');
    content = content.replace(/from-\[#0b1a2e\]/g, 'from-secondary');
    content = content.replace(/to-\[#0b1a2e\]/g, 'to-secondary');
    content = content.replace(/via-\[#0b1a2e\]/g, 'via-secondary');

    content = content.replace(/bg-\[#00A9CE\]/g, 'bg-primary');
    content = content.replace(/text-\[#00A9CE\]/g, 'text-primary');
    content = content.replace(/border-\[#00A9CE\]/g, 'border-primary');

    content = content.replace(/bg-\[#F7941D\]/g, 'bg-accent');
    content = content.replace(/text-\[#F7941D\]/g, 'text-accent');
    content = content.replace(/border-\[#F7941D\]/g, 'border-accent');
    content = content.replace(/shadow-\[#F7941D\]/g, 'shadow-accent');

    // General cleanup for border radius - 'rounded' or 'rounded-lg' or 'rounded-xl' to 'rounded-sm' to match home page
    // Wait, the home page actually used `rounded` on some and `rounded-sm` or `rounded-xl` on others? 
    // I will leave border-radius alone unless generic. Let's fix paddings:
    content = content.replace(/py-24 px-6/g, 'py-12 md:py-16 lg:py-20 px-4 md:px-6 w-full flex justify-center');
    content = content.replace(/max-w-7xl mx-auto/g, 'max-w-[1260px] mx-auto w-full');
    content = content.replace(/max-w-4xl mx-auto w-full/g, 'max-w-[900px] mx-auto w-full');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log('Restyled: ' + filePath);
    }
  }
});
