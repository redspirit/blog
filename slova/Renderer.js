const fs = require('fs');
const pathLib = require('path');
const Mustache = require('mustache');


const MAIN_FILE = 'main.html';

class Renderer {
    constructor(themeDir) {
        this.templateContent = fs.readFileSync(pathLib.join(themeDir, MAIN_FILE)).toString();
        this.view = {
            include: function () {
                return function (file, render) {
                    let filePath = pathLib.join(themeDir, file.trim());
                    return render(fs.readFileSync(filePath).toString());
                }
            }
        }
    }

    setPage(page) {
        Object.assign(this.view, page.getView());
    }

    getStatic() {
        return Mustache.render(this.templateContent, this.view);
    }

}

module.exports = Renderer;