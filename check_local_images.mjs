import fs from 'fs';
import path from 'path';

function findLocalImages(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findLocalImages(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.match(/src="(\/[^"']+)"/g);
            if (matches) {
                matches.forEach(m => {
                    const src = m.match(/src="([^"]+)"/)[1];
                    if (!src.startsWith('http') && !src.startsWith('/favicon')) {
                        const localPath = path.join('./public', src);
                        if (!fs.existsSync(localPath)) {
                            console.log(`Missing local image: ${src} in ${fullPath}`);
                        }
                    }
                });
            }
        }
    }
}
findLocalImages('./src');
