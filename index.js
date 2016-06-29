var restify = require('restify');

var videoApi = require('./apis/video-api');

var port = 8792;

var version = 'v2.0';

var server = restify.createServer({
    name: 'ds_api',
    version: 'v2.0.0'
});

server.use(restify.bodyParser());


// video-api
server.get(version+'/rest/video/getVideosByType/:videoId/:count/:type/:userId', videoApi.getVideosByType);


server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
