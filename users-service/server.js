const restify = require('restify');

const server = restify.createServer();

const port = process.env.PORT || 80;

server.listen(port, function () {
    console.log('%s is listening on %s', server.name, server.url);
});