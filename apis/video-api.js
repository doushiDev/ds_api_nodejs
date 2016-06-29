
var pool = require('../utils/db-pooling.js');

exports.getVideosByType = function (req, res, next) {

  res.setHeader('content-type', 'application/json;charset=utf-8');
  res.charSet('utf-8');

  var sql = 'select distinct v.title, v.id, v.url as videoUrl, v.pic, v.type, v.createTime as pushTime, (select count(*) from `tb_user_video` tub WHERE tub.`status` = 1 AND tub.userId = ? AND tub.videoId = v.id) as isCollectStatus from `tb_video` v where v.title != "" '

  var values = [Number(req.params.userId)];

  if (Number(req.params.videoId) != 0) {

      sql += ' AND id < ? '
      values.push(Number(req.params.videoId))
  }

  if (Number(req.params.type) != 0) {

      sql += ' AND type = ? '

      values.push(Number(req.params.type))

  }

  sql += ' ORDER BY id DESC LIMIT ? '

  values.push(Number(req.params.count))

  console.log("q sql => " + sql);

  console.log("q values => " + values);

  pool.query(sql,values, function(err, rows, fields) {
      if (err){
          console.log(err);
          throw err;
      }

      for (var i = 0; i < rows.length; i++) {
          rows[i]["id"] = rows[i]["id"]+ '';
          rows[i]["title"] =  new Buffer(rows[i]["title"], 'base64').toString();
      }

      var resultJson = {

          message : '获取 '+ rows.length + '条数据',
          statusCode : 200,
          content : rows,
          request : req.url

      };

      res.send(200, resultJson);
      return next();
  });

};