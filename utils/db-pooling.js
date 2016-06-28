var mysql = require('mysql');

var env = {
    connectionLimit : 10,
    host : '114.215.157.230',
    user : 'slj',
    port : '3306',
    password : 'Jianghu521530!)',
    database : 'ds_video'
};

var pool  = mysql.createPool(env);


module.exports = pool;
