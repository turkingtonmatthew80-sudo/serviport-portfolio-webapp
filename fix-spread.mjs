import fs from 'fs';
import path from 'path';

function traverse(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes('...doc.data()') || content.includes('doc.data().status')) {
                content = content.replace(/\.\.\.doc\.data\(\)/g, '...(doc.data() as any)');
                content = content.replace(/doc\.data\(\)\.status/g, '(doc.data() as any).status');
                fs.writeFileSync(fullPath, content);
            }
        }
    });
}
traverse('./src/pages');
