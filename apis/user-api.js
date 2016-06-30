var pool = require('../utils/db-pooling.js');


exports.registerUser = function (req, res, next) {
  res.setHeader('content-type', 'application/json;charset=utf-8');
  res.charSet('utf-8');

  var httpStatusCode = 0;

  console.log('req.boby -> ' + req.body);

  var user = new User(req.body["id"],req.body["nickName"],req.body["password"],req.body["headImage"],req.body["phone"],req.body["gender"],req.body["platformId"],req.body["platformName"]);

  console.log('User -> ' + user.nickName);

  // 判断用户手机号是否已经注册

  var selectUserSql = 'select * from tb_user tu where tu.`status` = 1 ';

  var values = [];

  if (user.phone != '') {

    selectUserSql += 'AND tu.phone = ? '
	values.push(user.phone);

  }

  if (user.platformId != '') {

    selectUserSql += 'AND tu.platformId = ? '
	values.push(user.platformId);
  }

  console.log('sql -> ' + selectUserSql);

  var resultJson ;

  pool.query(selectUserSql,values, function(err, rows, fields) {
      if (err){
          console.log(err);
          throw err;
      }

      
	  
      if (rows[0]) {
      	console.log('rows[0] -> ' + rows[0]["id"]);
		console.log('用户已经存在');
		resultJson = {
      	

          message : '用户已经存在',
          statusCode : 200,
          content : rows[0],
          request : req.url

      	};
      	httpStatusCode = 200;
      	res.send(httpStatusCode, resultJson);
      	return next();

      }else {

      	   	httpStatusCode = 201;
      } 

      console.log('httpStatusCode -> ' + httpStatusCode);

  if (httpStatusCode != 200) {

  	// 注册新用户
  	console.log('注册用户');
 	
 		var installSql = 'insert into  `tb_user` ( `phone`, `password`, `headImage`, `status`, `gender`, `platformId`, `platformName`, `nickName`) values (? , ?, ?, 1, ?, ?, ?, ?)';
    	
 		var values = [user.phone, user.phone, user.headImage, user.gender, user.platformId, user.platformName, user.nickName];

	    pool.query(installSql, values, function(err, rows, fields) {
	      if (err){
	          console.log(err);
	          throw err;
	      }

	      console.log('affectedRows  ' + rows.affectedRows);

	      if (rows.affectedRows > 0) {
			
			console.log('用户注册成功');

			user.id = rows.insertId;

			resultJson = {
	      	

	          message : '用户注册成功',
	          statusCode : 201,
	          content : user,
	          request : req.url

	      	};
	      	httpStatusCode = 201;
	      	res.send(httpStatusCode, resultJson);
	      	return next();

	      }
	      
	  });

	  }
      
  });

  


};
 

function User(id, nickName, password, headImage, phone, gender, platformId, platformName){
　　	this.id=id;
	this.nickName=nickName;
	this.password=password;
	this.headImage=headImage;
	this.phone=phone;
	this.gender=gender;
	this.platformId=platformId;
	this.platformName=platformName;
}