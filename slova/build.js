const fs = require('fs');
const pathLib = require('path');
const Mustache = require('mustache');
const PostsManager = require('./PostsManager');

const postsManager = new PostsManager('./pages');

const start = async (themeDir, outputDir) => {

    let pages = postsManager.readPages();



    return console.log(pages);






    let mainTemplate = fs.readFileSync(pathLib.join(themeDir, 'tree.html')).toString();

    let view = {
        title: 'Spirit Blog',
        author: 'Spirit',
        description: 'My super blog',
        isHome: true,
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