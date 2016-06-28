var restify = require('restify');

var pool = require('./utils/db-pooling.js');

var port = 8792;

var version = '2.0';

var server = restify.createServer({
    name: 'ds_api',
    version: 'v2.0.0'
});

server.use(restify.bodyParser());

// pool.query('SELECT NOW()', function(err, rows, fields) {
//   if (err) throw err;
//
//   console.log('The solution is: ', rows);
// });

server.get('/getVideosByType/:videoId/:count/:type/:userId', function(req, res, next) {

    var sql = 'select  *  from `tb_video` v ORDER BY id DESC LIMIT 10'

    pool.query(sql, function(err, rows, fields) {
        if (err) throw err;

        console.log('The solution is: ', rows);

        res.setHeader('content-type', 'application/json');
        res.send(200, rows);
        return next();
    });
});



server.listen(port, function() {
    console.log('%s listening at %s', server.name, server.url);
});
