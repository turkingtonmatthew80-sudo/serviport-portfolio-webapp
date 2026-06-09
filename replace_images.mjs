import fs from 'fs';
import path from 'path';

function replaceImages(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceImages(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // photo-1586528116311-ad8ed7c663c0  -> Ship / Cargo
            if (content.includes('photo-1586528116311-ad8ed7c663c0')) {
                content = content.replace(/photo-1586528116311-ad8ed7c663c0/g, 'photo-1494412574643-ff11b0a5c1c3');
                modified = true;
            }

            // photo-1586528116311-ad8ed7c80a74 -> Ship / Cargo
            if (content.includes('photo-1586528116311-ad8ed7c80a74')) {
                content = content.replace(/photo-1586528116311-ad8ed7c80a74/g, 'photo-1493246507139-91e8fad9978e');
                modified = true;
            }

            // photo-1559297292-0b2a75225e -> Port/Containers
            if (content.includes('photo-1559297292-0b2a75225e')) {
                if (file.includes('CareersPage')) {
                     content = content.replace(/photo-1559297292-0b2a75225e/g, 'photo-1560250097-0b93528c311a');
                } else {
                     content = content.replace(/photo-1559297292-0b2a75225e/g, 'photo-1578575437130-527eed3abbec');
                }
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceImages('./src');
