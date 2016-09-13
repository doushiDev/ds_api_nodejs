var pool = require('../utils/db-pooling.js');

var async = require('async');


exports.addUserFavoriteVideo1 = function (req, res, next) {

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

    async.eachSeries(tasks, function (item, callback) {
        console.log(item + " ==> " + sqls[item]);

        pool.getConnection(function (err, connection) {
            if (err) {
                throw err;
            }


            connection.query(sqls[item], function (err, res) {
                console.log(res);
                callback(err, res);
            });


        });


    }, function (err) {
        console.log("err: " + err);
    });


};


// 收藏视频
exports.addUserFavoriteVideo = function (req, res, next) {

    console.log('addUserFavoriteVideo api');

    res.setHeader('content-type', 'application/json;charset=utf-8');
    res.charSet('utf-8');

    console.log('req.boby -> ' + req.body);


    var selectUVSql = 'select uv.id, uv.userId,  uv.videoId,  uv.status FROM tb_user_video uv WHERE uv.userId = ?  and uv.videoId = ?';

    var selectUVValues = [req.body['userId'], req.body['videoId']];

    console.log("q selectUVSql => " + selectUVSql);

    console.log("q selectUVValues => " + selectUVValues);


    var resultJson;

    pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }

        connection.query(selectUVSql, selectUVValues, function (err, rows, fields) {
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
                    connection.release();
                    res.send(400, resultJson);

                } else {
                    var updateSql = 'update tb_user_video uv set  uv.status = 1  where uv.userId = ? and uv.videoId = ?';
                    var updateValues = [Number(req.body['userId']), Number(req.body['videoId'])];


                    connection.beginTransaction(function (err) {

                        connection.query(updateSql, updateValues, function (err, rows, fields) {

                            if (err) {
                                return connection.rollback(function () {
                                    console.log(err);
                                    resultJson = {
                                        error: 'err',
                                        error_code: 400,
                                        error_detail: err.message + '',
                                        request: req.url
                                    };
                                    res.send(400, resultJson);
                                    connection.release();
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

                                    connection.commit(function (err) {

                                        if (err) {
                                            return connection.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        connection.release();
                                    });

                                } else {
                                    resultJson = {
                                        error: '收藏失败',
                                        error_code: 400,
                                        error_detail: '收藏失败',
                                        request: req.url
                                    };
                                    res.send(400, resultJson);

                                }
                            }

                        });
                    });

                    connection.release();

                }

            } else {

                var installSql = 'insert into tb_user_video (userId, videoId, status) values (?, ?,?)';
                var installValues = [req.body['userId'], req.body['videoId'], 1];

                connection.beginTransaction(function (err) {
                    connection.query(installSql, installValues, function (err, rows, fields) {

                        if (err) {
                            console.log(err);
                            resultJson = {
                                error: 'err',
                                error_code: 400,
                                error_detail: err.message + '',
                                request: req.url
                            };
                            res.send(400, resultJson);
                            connection.release();
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

                                connection.commit(function (err) {

                                    if (err) {
                                        return connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    connection.release();
                                });
                            } else {
                                resultJson = {
                                    error: '收藏失败',
                                    error_code: 400,
                                    error_detail: '收藏失败',
                                    request: req.url
                                };
                                res.send(400, resultJson);
                                connection.release();
                            }
                        }
                    });
                });


            }
            return next();
        });
    });
};


// 取消收藏视频
exports.deleteByUserIdAndVideoId = function (req, res, next) {

    console.log('deleteByUserIdAndVideoId api');

    res.setHeader('content-type', 'application/json;charset=utf-8');
    res.charSet('utf-8');

    console.log('req.params.videoId -> ' + req.params.videoId);
    console.log('req.params.userId -> ' + Number(req.params.userId));


    var updateSql = 'update tb_user_video uv set  uv.status = 0  where uv.userId = ? and uv.videoId = ?';
    var updateValues = [Number(req.params.userId), Number(req.params.videoId)];


    var resultJson;

    pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }

        connection.beginTransaction(function (err) {

            connection.query(updateSql, updateValues, function (err, rows, fields) {

                if (err) {
                    return connection.rollback(function () {
                        console.log(err);
                        resultJson = {
                            error: 'err',
                            error_code: 400,
                            error_detail: err.message + '',
                            request: req.url
                        };
                        connection.release();
                        res.send(400, resultJson);
                        throw err;
                    });

                } else {
                    console.log('修改收藏状态');

                    console.log(rows)

                    if (rows.changedRows > 0) {

                        console.log('update deleteByUserIdAndVideoId');
                        // rows[0]['status'] == 1;

                        resultJson = {
                            message: '取消收藏成功',
                            statusCode: 200,
                            content: "取消收藏成功",
                            request: req.url
                        };


                        connection.commit(function (err) {

                            if (err) {
                                return connection.rollback(function () {
                                    throw err;
                                });
                            }
                            connection.release();
                        });

                        res.send(200, resultJson);


                    } else {
                        resultJson = {
                            error: '取消收藏失败',
                            error_code: 400,
                            error_detail: '取消收藏失败',
                            request: req.url
                        };
                        connection.release();
                        res.send(400, resultJson);
                    }
                }

            });
        });
    });
};


// 获取用户收藏视频集合
exports.getVideosByUserId = function (req, res, next) {

    console.log('getVideosByUserId api');

    res.setHeader('content-type', 'application/json;charset=utf-8');
    res.charSet('utf-8');

    var sql = ' select v.id,v.title,v.url as videoUrl ,v.pic,v.type,v.createTime as pushTime ,(select count(*) from `tb_user_video` tub WHERE tub.`status` = 1 AND tub.userId = ? AND tub.videoId = v.id) as isCollectStatus from `tb_video` v ,tb_user_video uv where uv.videoId = v.id and uv.userId = ? AND uv.status = 1 ORDER BY uv.createDate desc  limit ?, ?'

    var values = [Number(req.params.userId), Number(req.params.userId)];

    if (Number(req.params.pageNum) == 0) {
        values.push(Number(req.params.pageNum))
    } else {
        values.push(Number(req.params.pageNum * req.params.count))

    }

    values.push(Number(req.params.count))

    console.log("q sql => " + sql);

    console.log("q values => " + values);

    pool.query(sql, values, function (err, rows, fields) {
        if (err) {
            console.log(err);
            throw err;
        }

        for (var i = 0; i < rows.length; i++) {
            rows[i]["id"] = rows[i]["id"] + '';
            if (rows[i]["id"] > 76384) {
                rows[i]["title"] = new Buffer(rows[i]["title"], 'base64').toString();
                rows[i]["title"] = rows[i]["title"].replace('逗比', '').replace('\#', '');

            } else {
                rows[i]["title"] = rows[i]["title"].replace('逗比', '').replace('\#', '');
            }
        }

        var resultJson = {

            message: '获取 ' + rows.length + '条数据',
            statusCode: 200,
            content: rows,
            request: req.url

        };

        res.send(200, resultJson);
        return next();
    });

};
