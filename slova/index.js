const StaticServer = require('static-server');
const { server, destinationDir, themeDir } = require('./config');
const build = require('./build');

if (server.enabled) {
    // run http static server
    let serv = new StaticServer({
        rootPath: destinationDir,
        port: server.port,
    });
    serv.start(() => {
        console.log('Server listening to', server.port);
    });
}

build.start(themeDir, destinationDir).then((result) => {
    console.log('Build is ok');
}, (error) => {
    console.log('Build error', error);
});