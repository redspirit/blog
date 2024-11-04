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

const mergeObjects = (target, source) => {
    const result = { ...target };
    for (const key in source) {
        if (source[key] !== null && source[key] !== undefined) {
            result[key] = source[key];
        }
    }
    return result;
}

const sortCollection = (arr, key, order = 'asc') => {
    return arr.sort((a, b) => {
        if (order === 'asc') {
            return a[key] - b[key];
        } else {
            return b[key] - a[key];
        }
    });
}

const objectDefaults = (objA, objB) => {
    for (const key in objB) {
        if (typeof objA[key] === 'undefined' || objA[key] === undefined) {
            objA[key] = objB[key];
        }
    }
    return objA;
}

module.exports = {
    copyDirectoryRecursive,
    mergeObjects,
    sortCollection,
    objectDefaults,
}