const fs = require('fs');
const path = require('path');

const copyDirectoryRecursive = (sourceDir, destDir, exclude) => {
    fs.mkdirSync(destDir, { recursive: true });
    const files = fs.readdirSync(sourceDir);
    for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);

        if (fs.statSync(sourcePath).isDirectory()) {
            copyDirectoryRecursive(sourcePath, destPath, exclude);
        } else if (!exclude.split(',').includes(path.extname(file).toLowerCase())) {
            fs.copyFileSync(sourcePath, destPath);
        }
    }
}
module.exports = {
    copyDirectoryRecursive
}