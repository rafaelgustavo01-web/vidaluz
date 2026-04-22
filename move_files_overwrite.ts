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
    
    // Copy the file instead of move in case the user wants to keep a backup,
    // wait I will just move them so we clean up the root.
    fs.copyFileSync(oldPath, newPath);
    fs.unlinkSync(oldPath);
    console.log(`Moved and overwrote ${file}`);
    moved++;
  }
}
console.log(`Successfully moved ${moved} original files.`);
