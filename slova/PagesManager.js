const { join } = require('path');
const { readdirSync, statSync } = require('fs');
const Page = require('./Page');

class PagesManager {
    constructor(postsDir) {
        this.postsDir = postsDir;
        this.pages = this.#readPages();
    }

    #findFiles(dir, extn, files, result, regex) {
        files = files || readdirSync(dir);
        result = result || [];
        regex = regex || new RegExp(`\\${extn}$`)

        for (let i = 0; i < files.length; i++) {
            let file = join(dir, files[i]);
            if (statSync(file).isDirectory()) {
                try {
                    result = this.#findFiles(file, extn, readdirSync(file), result, regex);
                } catch (error) {}
            } else {
                if (regex.test(file)) {
                    result.push(file);
                }
            }
        }
        return result;
    }

    #readPages() {
        let pages = this.#findFiles(this.postsDir, '.md');
        return pages.map(pageFile => {
            return new Page(pageFile);
        });
    }

    findByFileName(name) {
        let res = this.pages.filter(page => {
            return page.fileName = name;
        });
        return res ? res[0] : null;
    }

    getAllPages() {
        let homePage = new Page(null, Page.PAGE_TYPES.HOME); // add home page
        return [...this.pages, homePage];
    }
}

module.exports = PagesManager;