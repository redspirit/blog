const fs = require('fs');
const pathLib = require('path');
const Mustache = require('mustache');

const MAIN_FILE = 'main.html';

class Renderer {
    constructor(themeDir) {
        Mustache.escape = text => text; // disable html escaping globally
        this.templateContent = fs.readFileSync(pathLib.join(themeDir, MAIN_FILE)).toString();
        this.view = {
            include: function () {
                return function (file, render) {
                    let filePath = pathLib.join(themeDir, file.trim());
                    // todo сделать проверку существования шаблона
                    return render(fs.readFileSync(filePath).toString());
                }
            },
            getPosts: function () {
                console.log('>> getPosts', this);
                return function (text, render) {
                    return 'TEST'
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