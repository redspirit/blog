const PostsManager = require('./PostsManager');
const Renderer = require('./Renderer');

const postsManager = new PostsManager('./pages');

const start = async (themeDir, outputDir) => {

    let pages = postsManager.readPages();

    let renderer = new Renderer(themeDir);

    pages.forEach(page => {
        renderer.setPage(page);
        console.log(renderer.getStatic());
    });

}

start('./themes/light', './dist').catch(console.error);