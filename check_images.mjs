import fs from 'fs';
import path from 'path';

function findImages(dir) {
    let images = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            images = images.concat(findImages(fullPath));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const matches = content.match(/https:\/\/images\.unsplash\.com\/[^"'\s?]+/g);
            if (matches) {
                images = images.concat(matches);
            }
        }
    }
    return images;
}

const images = [...new Set(findImages('./src'))];
console.log(`Found ${images.length} unique images`);
const checks = images.map(async (img) => {
    try {
        const res = await fetch(img);
        console.log(`${res.status} ${img}`);
    } catch(err) {
        console.log(`Error ${img}: ${err}`);
    }
});

Promise.all(checks);
