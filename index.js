var restify = require('restify');

var videoApi = require('./apis/video-api');
var userApi = require('./apis/user-api');


var port = 8792;

var version = 'v2.0';

var server = restify.createServer({
    name: 'ds_api',
    version: 'v2.0.0'
});

server.use(restify.bodyParser());


// video-api
server.get(version + '/rest/video/getVideosByType/:videoId/:count/:type/:userId', videoApi.getVideosByType);

server.get(version + '/rest/video/getVideosById/:videoId/:userId', videoApi.getVideosById);

server.get(version + '/rest/video/getVideosByBanner/:userId', videoApi.getVideosByBanner);

server.get(version + '/rest/video/getVideoTaxis/:userId', videoApi.getVideoTaxis);

// user-api
server.post(version + '/rest/user/registerUser', userApi.registerUser);

server.get(version + '/rest/user/loginUser/:phone/:password', userApi.loginUser);

// user-video
server.post(version + '/rest/userAndVideo/addUserFavoriteVideo', userApi.registerUser);




server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
