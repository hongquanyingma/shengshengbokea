
var express = require('express');
var router = express.Router();
var locals = new Object();

/* 网站后台首页 */
router.get('/', function(req, res, next) {
  //判断是否登录
  if(!req.cookies.adminuser){
      res.redirect("/login");   
  }
  res.render("login",{adminuser:'小飞雨'});
});

//加载登录表单
router.get('/login', function(req, res, next) {
  res.render("login");
});

//执行登录验证
router.post('/doLogin', function(req, res, next) {
  //执行登录判断
  var username = req.body.username;
  var pwd = req.body.pwd;
  console.log(username+pwd+"...");
  
  if(username == "小飞雨"&& pwd == "123"){
	  
	  //写cookie信息
  res.cookie('adminuser', '小飞雨', { maxAge: 3600000, httpOnly: true });
  res.redirect("/users"); 
     return; 
     
  }else{
	   locals.msg = "您输入有误，请重新输入";
	   res.render("loginoff",locals);
  }
  
   
});

//执行退出
router.get('/logout', function(req, res, next) {
  //清除指定cookie信息
  res.clearCookie('adminuser', { path: '/' });
  res.render("admin/index/login");
});

module.exports = router;