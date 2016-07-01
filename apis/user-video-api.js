var pool = require('../utils/db-pooling.js');



// 收藏视频
exports.addUserFavoriteVideo = function(req, res, next) {

    console.log('addUserFavoriteVideo api');

    res.setHeader('content-type', 'application/json;charset=utf-8');
    res.charSet('utf-8');

    console.log('req.boby -> ' + req.body);



    var selectUVSql = 'select uv.id, uv.userId,  uv.videoId,  uv.status FROM tb_user_video uv WHERE uv.userId = ?  and uv.videoId = ?';

    var selectUVValues = [req.body['userId'], req.body['videoId']];

    console.log("q sql => " + sql);

    console.log("q values => " + values);


    var resultJson;

    pool.query(selectUVSql, selectUVValues, function(err, rows, fields) {
            if (err) {
                console.log(err);
                throw err;
            }

            if (rows[0]) {

                if (row[0]['status'] == 1) {

                    console.log('此视频已经收藏');

                    resultJson = {
                        error_code: '此视频已经收藏',
                        error_code: 400,
                        error_detail: '此视频已经收藏',
                        request: req.url
                    };
                } else {

                    console.log('修改收藏状态');

                }

            } else {

                console.log('添加收藏记录');

            }



            res.send(200, resultJson);
            return next();
        }
    });

};
