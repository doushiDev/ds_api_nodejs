var pool = require('../utils/db-pooling.js');


// 获取视频集合
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


// 根据视频id获取详情
exports.getVideosById = function (req, res, next) {

  console.log('getVideosById api');

  res.setHeader('content-type', 'application/json;charset=utf-8');
  res.charSet('utf-8');

  var sql = 'select v.id,v.title,v.url as videoUrl ,v.pic,v.type,v.createTime as pushTime,(select count(*) from `tb_user_video` tub WHERE tub.`status` = 1 AND tub.userId = ? AND tub.videoId = v.id) as isCollectStatus from `tb_video` v where  v.id = ? ';

  var values = [Number(req.params.userId), Number(req.params.videoId)];
 
  console.log("q sql => " + sql);

  console.log("q values => " + values);

  pool.query(sql,values, function(err, rows, fields) {
      if (err){
          console.log(err);
          throw err;
      }

      
          rows[0]["id"] = rows[0]["id"]+ '';
          rows[0]["title"] =  new Buffer(rows[0]["title"], 'base64').toString();
  

      var resultJson = {

          message : '获取数据成功',
          statusCode : 200,
          content : rows[0],
          request : req.url

      };

      res.send(200, resultJson);
      return next();
  });

};


// / 根据Banner视频
exports.getVideosByBanner = function (req, res, next) {

  console.log('getVideosByBanner api');

  res.setHeader('content-type', 'application/json;charset=utf-8');
  res.charSet('utf-8');

  var sql = 'select v.id,v.title,v.url as videoUrl ,v.pic,v.type,v.createTime as pushTime,(select count(*) from `tb_user_video` tub WHERE tub.`status` = 1 AND tub.userId = 1 AND tub.videoId = v.id) as isCollectStatus FROM `tb_video` AS v JOIN (SELECT ROUND(RAND() * (SELECT MAX(id) FROM `tb_video`)) AS id) AS v1 WHERE v.id >= v1.id ORDER BY v.id ASC LIMIT 5';

  var values = [];
 
  console.log("q sql => " + sql);

  console.log("q values => " + values);

  pool.query(sql,values, function(err, rows, fields) {
      if (err){
          console.log(err);
          throw err;
      }

      for (var i = 0; i < rows.length; i++) {
          rows[i]["id"] = rows[i]["id"]+ '';
          if (rows[i]["id"] > 76384) {
             rows[i]["title"] =  new Buffer(rows[i]["title"], 'base64').toString();
          }
      }
           

      var resultJson = {

          message : '获取数据成功',
          statusCode : 200,
          content : rows,
          request : req.url

      };

      res.send(200, resultJson);
      return next();
  });

};

// / 根据排行榜视频
exports.getVideoTaxis = function (req, res, next) {

  console.log('getVideoTaxis api');

  res.setHeader('content-type', 'application/json;charset=utf-8');
  res.charSet('utf-8');

  var sql = 'select v.id,v.title,v.url as videoUrl ,v.pic,v.type,v.createTime as pushTime,(select count(*) from `tb_user_video` tub WHERE tub.`status` = 1 AND tub.userId = 1 AND tub.videoId = v.id) as isCollectStatus FROM `tb_video` AS v JOIN (SELECT ROUND(RAND() * (SELECT MAX(id) FROM `tb_video`)) AS id) AS v1 WHERE v.id >= v1.id ORDER BY v.id ASC LIMIT 25';

  var values = [];
 
  console.log("q sql => " + sql);

  console.log("q values => " + values);

  pool.query(sql,values, function(err, rows, fields) {
      if (err){
          console.log(err);
          throw err;
      }

      for (var i = 0; i < rows.length; i++) {
          rows[i]["id"] = rows[i]["id"]+ '';

          if (rows[i]["id"] > 76384) {
             rows[i]["title"] =  new Buffer(rows[i]["title"], 'base64').toString();
          }

      }
           

      var resultJson = {

          message : '获取数据成功',
          statusCode : 200,
          content : rows,
          request : req.url

      };

      res.send(200, resultJson);
      return next();
  });

};

