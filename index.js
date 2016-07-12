var restify = require('restify');

var videoApi = require('./apis/video-api');
var userApi = require('./apis/user-api');
var userVidelApi = require('./apis/user-video-api')


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
server.post(version + '/rest/userAndVideo/addUserFavoriteVideo', userVidelApi.addUserFavoriteVideo);

// user-video 取消收藏
server.del(version + '/rest/userAndVideo/deleteByUserIdAndVideoId/:videoId/:userId', userVidelApi.deleteByUserIdAndVideoId);


// 配置静态文件 Swagger
server.get(/\/public\/?.*/, restify.serveStatic({
	directory: __dirname
}));

server.get(/\/public\/?.*\/?.*/, restify.serveStatic({
	directory: __dirname
}));




server.listen(port, function() {
	console.log('%s listening at %s', server.name, server.url);
});
