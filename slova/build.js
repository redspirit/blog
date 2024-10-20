const fs = require('fs');
const pathLib = require('path');
const Mustache = require('mustache');

const getPages = () => {

}

const start = async (themeDir, outputDir) => {
    let mainTemplate = fs.readFileSync(pathLib.join(themeDir, 'main.html')).toString();

    let view = {
        title: 'Spirit Blog',
        author: 'Spirit',
        description: 'My super blog',
        include: function () {
            return function (file, render) {
                let filePath = pathLib.join(themeDir, file.trim());
                return render(fs.readFileSync(filePath).toString());
            }
        }
    }

    const html = Mustache.render(mainTemplate, view);

    console.log(html);
}

start('./themes/light', './dist').catch(console.error);