const fse = require('fs-extra');
const path = require('path');
const config = require('./config');
const PagesManager = require('./PagesManager');
const Renderer = require('./Renderer');

const pagesManager = new PagesManager(config.pagesDir);

const copyFromTheme = (sourceDir, destDist, name) => {
    return fse.copySync(path.join(sourceDir, name), path.join(destDist, name));
}

const start = async () => {
    const themeDir = config.themeDir;
    const outputDir = config.destinationDir;

    fse.emptyDirSync(outputDir);
    copyFromTheme(themeDir, outputDir, 'css');
    // todo надо копировать все файлы кроме .html и .htm

    let renderer = new Renderer(themeDir, outputDir);
    renderer.setContext(config.context);
    renderer.generateStatic(pagesManager);


    console.log('Done');
}

module.exports = {
    start
}