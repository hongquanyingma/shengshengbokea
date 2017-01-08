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
//router.use(function(req, res, next) {
  //判断是否登录
  //if(!req.cookies.adminuser){
  //    res.redirect("/login");   
  //}
  //locals.adminuser = req.cookies.adminuser;
 //next();
//});




/* GET users listing. */
router.get('/', function(req, res, next) {
       console.log(req.query.id+"id查询");
    conn.query('select * from article where a_id=?',req.query.id,function(err,result){
  	
	console.log(result+"查询单挑信息");
		locals.list = result;
        
        res.render('comment/comment',locals); //加载模板

	});
});



router.get('/add', function(req, res, next) {
       res.render('news/add',{title:"会员信息管理"});
});


router.get('/doAdd', function(req, res, next) {
    var sql = "insert into user(userId,username,pwd,realname,email,telphone,headphoto) values(?,?,?,?,?,?,?)";
    var params = [req.query.userId,req.query.username,req.query.pwd,req.query.realname,req.query.email,req.query.telphone,req.query.headphoto];
    console.log(params);
    conn.query(sql,params,function(err,result){
        if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
        //result.affectedRows(影响行数)
        
		if(result.affectedRows>0){

		 conn.query('select * from user',function(err,result){
			 
	    locals.list = result;
        locals.title="会员信息管理";
        res.render('news/user_table',locals); //加载模板       
      	
		});
      
	
	}else{
		    locals.info = '添加失败！';
            locals.title="会员信息管理";
            res.render('news/info',locals);
        }
    });
});

router.get('/delete', function(req, res, next) {
         var sql = "delete from user where userId=?";
		 var params = [req.query.userId];
		 console.log(params);
		  conn.query(sql,params,function(err,result){
          if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		 //result.affectedRows(影响行数)
        if(result.affectedRows>0){
			 conn.query('select * from user',function(err,result){
		 locals.list = result;
         locals.title="会员信息管理";
				 
             res.render('news/user_table',locals); //加载模板
	});
			
			
        }else{
			
			locals.info = '删除失败！';
            locals.title="会员信息管理";
            res.render('news/info',locals);
        }
    });
});


//加载新闻修改表单
router.get("/update",function(req,res,next){
	conn.query('select * from user where userId='+req.query.userId,function(err,result){
		
		  if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		console.log(result);
		
		locals.vo = result[0];
        locals.title="会员信息管理";
		res.render('news/updateuser',locals);
		
	});
   
});

//进行新闻修改操作
router.get('/doUpdate', function(req, res, next) {
         var sql = "update user set username=?,pwd=?,realname=?,email=?,telphone=?,headphoto=? where userId=?";
		 var params = [req.query.username,req.query.pwd,req.query.realname,req.query.email,req.query.telphone,req.query.headphoto,req.query.userId];
		 console.log(params);
		  conn.query(sql,params,function(err,result){
          if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		console.log(req.query.id+"ddddddddddd");
		 //result.affectedRows(影响行数)
        if(result.affectedRows>0){
           
		    conn.query('select * from user',function(err,result){
	      
		  locals.list =result;
          locals.title="会员信息管理";
				
          
           res.render('news/user_table', locals); //加载模板
          
	      });
		   
		   
        }else{
			
			  locals.info ='修改失败！';
              locals.title="会员信息管理";
            res.render('news/info',locals);
        }
    });
});


module.exports = router;
