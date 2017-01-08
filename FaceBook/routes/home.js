var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var location = require('location');
var locals = new Object();
var conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'facebook',
    password:'',
    port:3306
});
conn.connect();

//中间件过滤（登录验证）
router.use(function(req, res, next) {
  //判断是否登录
  if(!req.cookies.adminuser){
      res.redirect("/login");   
  }
  locals.adminuser = req.cookies.adminuser;
  next();
});




/* GET users listing. */
router.get('/', function(req, res, next) {

    conn.query('select * from article',function(err,result){
		
		locals.list = result;
       // locals.title="会员信息管理";
       //res.render('news/user_table',locals); //加载模板

	//});
	res.render('homes/Home',locals); //加载模板
   });
});






module.exports = router;
