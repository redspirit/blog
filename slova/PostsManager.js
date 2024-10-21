const { join } = require('path');
const { readdirSync, statSync } = require('fs');
const BlogPost = require('./BlogPost');

class PostsManager {
    constructor(pagesDir) {
        this.pagesDir = pagesDir;
        this.posts = [];
    }

    readPages() {
        let pages = this.findFiles(this.pagesDir, '.md');
        this.posts = pages.map(pageFile => {
            return new BlogPost(pageFile);
        });
        return this.posts;
    }

    findFiles(dir, extn, files, result, regex) {
        files = files || readdirSync(dir);
        result = result || [];
        regex = regex || new RegExp(`\\${extn}$`)

        for (let i = 0; i < files.length; i++) {
            let file = join(dir, files[i]);
            if (statSync(file).isDirectory()) {
                try {
                    result = this.findFiles(file, extn, readdirSync(file), result, regex);
                } catch (error) {
                    continue;
                }
            } else {
                if (regex.test(file)) {
                    result.push(file);
                }
            }
        }
        return result;
    }
}

module.exports = PostsManager;