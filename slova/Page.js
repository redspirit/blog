const path = require('path');
const yaml = require('yaml');
const moment = require('moment');
const markdown = require('markdown-it')(); // https://www.npmjs.com/package/markdown-it
const HTMLParser = require('node-html-parser');
const { readFileSync, statSync } = require('fs');
const { dateTimeFormat } = require('./config');

const META_SEPARATOR = /\+{4,}/g;

class Page {
    fileName = null;
    meta = null;
    url = null;
    title = null;
    description = null;
    contentMd = null;
    contentHtml = null;
    visible = true;
    dateTime = null;
    isEmpty = false;
    isPage = false;
    isHome = false;
    isCategory = false;

    static PAGE_TYPES = {
        PAGE: 'page',
        CATEGORY: 'category',
        HOME: 'home',
    };

    constructor(filePath, pageType) {
        if (filePath) {
            this.isPage = Page.PAGE_TYPES.PAGE;
            this.loadFile(filePath);
        } else {
            this.isEmpty = true;
            if (pageType === Page.PAGE_TYPES.HOME) {
                this.url = 'index';
                this.isHome = true;
            }
            if (pageType === Page.PAGE_TYPES.CATEGORY) this.isCategory = true;
        }
    }

    loadFile (filePath) {
        let filenameComponents = path.parse(filePath);
        let fileName = filenameComponents.name;
        let fileDirAbs = path.join(filenameComponents.dir, fileName);
        let fileDir = fileDirAbs.split(path.sep).slice(1).join('/'); // remove first "pages/"
        let fileContent = readFileSync(filePath).toString();
        let fileStat = statSync(filePath);

        if(!fileContent) {
            this.isEmpty = true;
            console.warn(`File ${filePath} is empty!`);
            return;
        }

        let document = fileContent;
        let meta = {};
        let match = META_SEPARATOR.exec(fileContent);
        if (match) {
            let yml = fileContent.substring(0, match.index);
            document = fileContent.substring(match.index + match[0].length);
            meta = yaml.parse(yml);
        }

        this.fileName = fileDir + filenameComponents.ext;
        this.meta = meta;
        this.contentMd = document;
        this.contentHtml = markdown.render(document);

        let dom = HTMLParser.parse(this.contentHtml);
        let headerText = dom.querySelector('h1')?.innerText || dom.querySelector('h2')?.innerText;

        this.url = meta.url || fileDir;
        this.title = meta.title || headerText || fileName;
        this.description = meta.description || '';
        this.visible = typeof meta.visible === 'undefined' ? true : !!meta.visible;
        this.dateTime = meta.date ? moment(meta.date, dateTimeFormat) : moment(fileStat.birthtime);
    }

    getView () {
        return {
            fileName: this.fileName,
            meta: this.meta,
            url: this.url,
            title: this.title,
            description: this.description,
            html: this.contentHtml,
            visible: this.visible,
            dateTime: this.dateTime,
            isEmpty: this.isEmpty,
            isPage: this.isPage,
            isHome: this.isHome,
            isCategory: this.isCategory,
        }
    }
}

module.exports = Page;