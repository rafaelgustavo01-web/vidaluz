import * as fs from 'fs';
import * as path from 'path';

const rootDir = process.cwd();
const targetDir = path.join(rootDir, 'public', 'assets');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(rootDir);
let moved = 0;
for (const file of files) {
  if (file.endsWith('.jpg')) {
    const oldPath = path.join(rootDir, file);
    const newPath = path.join(targetDir, file);
    fs.renameSync(oldPath, newPath);
    console.log(`Moved ${file}`);
    moved++;
  }
}
console.log(`Successfully moved ${moved} files.`);
