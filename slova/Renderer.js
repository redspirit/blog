const fs = require('fs');
const Listok = require('listok');

const MAIN_FILE = 'main.html';

class Renderer {
    constructor (themeDir) {
        this.listok = new Listok(themeDir);

        this.view = {
            getPosts: () => {
                return '';
            }
        }
    }

    setPage (page) {
        Object.assign(this.view, page.getView());
    }

    getStatic () {
        return this.listok.renderFile(MAIN_FILE, this.view);
    }

    saveStatic (fileName) {
        return fs.writeSync(fileName, this.getStatic());
    }
}

module.exports = Renderer;