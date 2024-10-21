const { readFileSync, statSync } = require('fs');
const path = require('path');
const yaml = require('yaml');
const moment = require('moment');
const markdown = require('markdown-it')(); // https://www.npmjs.com/package/markdown-it
const HTMLParser = require('node-html-parser');
const { dateTimeFormat } = require('./config');

const META_SEPARATOR = /\+{4,}/g;

class BlogPost {
    meta = null;
    url = null;
    title = null;
    description = null;
    contentMd = null;
    contentHtml = null;
    visible = true;
    dateTime = null;
    category = null;
    isEmpty = false;

    constructor(filePath) {
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
        this.category = null;
    }

    getView() {
        return {
            meta: this.meta,
            url: this.url,
            title: this.title,
            description: this.description,
            html: this.contentHtml,
            visible: this.visible,
            dateTime: this.dateTime,
            category: this.category,
            isEmpty: this.isEmpty,
        }
    }
}

module.exports = BlogPost;