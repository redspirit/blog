const path = require('path');
const Listok = require('listok');
const { outputFileSync } = require('fs-extra');

const MAIN_FILE = 'main.html';

class Renderer {
    constructor (themeDir, outputDir) {
        this.listok = new Listok(themeDir);
        this.outputDir = outputDir;
        this.context = {};
    }

    setContext (ctx) {
        this.context = ctx;
    }

    saveStatic (fileName, ctx) {
        // console.log('>>> ./' + fileName);
        // console.log('CTX', ctx);
        let htmlContent = this.listok.renderFile(MAIN_FILE, ctx);
        return outputFileSync(path.join(this.outputDir, fileName), htmlContent);
    }

    generateStatic (pageManager) {
        let pages = pageManager.getAllPages();

        this.context.renderPage = ({name}) => {
            // в name путь до .md файла
            let page = pageManager.findByFileName(name)
            return page ? page.getView() : '';
        }

        pages.forEach(page => {
            let pageCtx = Object.assign(this.context, page.getView());
            this.saveStatic(page.url + '.html',  pageCtx);
        });
    }
}

module.exports = Renderer;