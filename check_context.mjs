import fs from 'fs';
import path from 'path';

function findImageContext(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findImageContext(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('images.unsplash.com')) {
                    console.log(`\n--- ${fullPath}:${i+1} ---`);
                    console.log(lines[i].trim());
                }
            }
        }
    }
}
findImageContext('./src');
