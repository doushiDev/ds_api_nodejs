var pool = require('../utils/db-pooling.js');

var async = require('async');





exports.addUserFavoriteVideo1 = function(req, res, next) {

    console.log('addUserFavoriteVideo1 api');

    res.setHeader('content-type', 'application/json;charset=utf-8');
    res.charSet('utf-8');

    console.log('req.boby -> ' + req.body);

    var sqls = {

        'selectUVSql': 'select uv.id, uv.userId,  uv.videoId,  uv.status FROM tb_user_video uv WHERE uv.userId = ?  and uv.videoId = ?',
        'updateSql': 'update tb_user_video uv set  uv.status = 1  where uv.userId = ? and uv.videoId = ?',
        'installSql': 'insert into tb_user_video (userId, videoId, status) values (?, ?,?)'

    };

    var selectUVValues = [req.body['userId'], req.body['videoId']];
    var updateValues = [req.body['userId'], req.body['videoId']];
    var installValues = [req.body['userId'], req.body['videoId'], 1];


    var tasks = ['selectUVSql', 'updateSql', 'installSql'];

    async.eachSeries(tasks, function(item, callback) {
        console.log(item + " ==> " + sqls[item]);

        pool.getConnection(function(err, connection) {
            if (err) {
                throw err;
            }

            

            connection.query(sqls[item], function(err, res) {
                console.log(res);
                callback(err, res);
            });



        });




    }, function(err) {
        console.log("err: " + err);
    });



};


// 收藏视频
exports.addUserFavoriteVideo = function(req, res, next) {

    console.log('addUserFavoriteVideo api');

    res.setHeader('content-type', 'application/json;charset=utf-8');
    res.charSet('utf-8');

    console.log('req.boby -> ' + req.body);



    var selectUVSql = 'select uv.id, uv.userId,  uv.videoId,  uv.status FROM tb_user_video uv WHERE uv.userId = ?  and uv.videoId = ?';

    var selectUVValues = [req.body['userId'], req.body['videoId']];

    console.log("q selectUVSql => " + selectUVSql);

    console.log("q selectUVValues => " + selectUVValues);


    var resultJson;

    pool.getConnection(function(err, connection) {
        if (err) {
            throw err;
        }

        connection.query(selectUVSql, selectUVValues, function(err, rows, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            if (rows[0]) {

                if (rows[0]['status'] == 1) {

                    console.log('此视频已经收藏');

                    resultJson = {
                        error: '此视频已经收藏',
                        error_code: 400,
                        error_detail: '此视频已经收藏',
                        request: req.url
                    };
                    res.send(400, resultJson);

                } else {
                    var updateSql = 'update tb_user_video uv set  uv.status = 1  where uv.userId = ? and uv.videoId = ?';
                    var updateValues = [req.body['userId'], req.body['videoId']];


                    connection.beginTransaction(function(err) {

                        connection.query(updateSql, updateValues, function(err, rows, fields) {

                            if (err) {
                                return connection.rollback(function() {
                                    console.log(err);
                                    resultJson = {
                                        error: 'err',
                                        error_code: 400,
                                        error_detail: err.message + '',
                                        request: req.url
                                    };
                                    res.send(400, resultJson);
                                    throw err;
                                });

                            } else {
                                console.log('修改收藏状态');

                                console.log(rows)

                                if (rows.changedRows > 0) {

                                    console.log('update install');
                                    // rows[0]['status'] == 1;

                                    resultJson = {
                                        message: '收藏成功',
                                        statusCode: 201,
                                        content: req.body,
                                        request: req.url
                                    };

                                    res.send(201, resultJson);

                                    connection.commit(function(err) {

                                        if (err) {
                                            return connection.rollback(function() {
                                                throw err;
                                            });
                                        }
                                        connection.release();
                                    });

                                } else {
                                    res.send(400, '收藏失败');
                                }
                            }

                        });
                    });



                }

            } else {

                var installSql = 'insert into tb_user_video (userId, videoId, status) values (?, ?,?)';
                var installValues = [req.body['userId'], req.body['videoId'], 1];

                connection.beginTransaction(function(err) {
                    connection.query(installSql, installValues, function(err, rows, fields) {

                        if (err) {
                            console.log(err);
                            resultJson = {
                                error: 'err',
                                error_code: 400,
                                error_detail: err.message + '',
                                request: req.url
                            };
                            res.send(400, resultJson);
                            throw err;
                        } else {
                            console.log('添加收藏记录');

                            console.log(rows)

                            if (rows.insertId > 0) {
                                console.log('install success')
                                req.body['status'] == 1;
                                resultJson = {
                                    message: '收藏成功',
                                    statusCode: 201,
                                    content: req.body,
                                    request: req.url
                                };
                                // resqd.endas();
                                res.send(201, resultJson);

                                connection.commit(function(err) {

                                    if (err) {
                                        return connection.rollback(function() {
                                            throw err;
                                        });
                                    }
                                    connection.release();
                                });
                            } else {
                                res.send(400, '收藏失败');
                            }
                        }
                    });
                });


            }
            return next();
        });
    });


};
