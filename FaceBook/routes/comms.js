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

    conn.query('select * from comm',function(err,result){
		
	conn.query('select * from user',function(err,uu){
	
	conn.query('select * from article',function(err,aa){	
		

		
		locals.list = result;
		locals.list_user = uu;
		locals.list_article = aa;
        locals.title="评论信息管理";
        res.render('comms/comm_table',locals);
		//加载模板
        });
	  });
	});
});

router.get('/add', function(req, res, next) {
	
		
       res.render('news/add',{title:"会员信息管理"});
});






router.post('/doAdd', function(req, res, next) {
	
	
	conn.query('select userId from user where username=?',[req.body.username],function(err,u_result){
	console.log(u_result[0].userId);
	conn.query('select a_id from article where title=?',[req.body.a_name],function(err,a_result){
		
	console.log(a_result[0].a_id);
	
	
    var sql = "insert into comm(d_id,d_userid,d_articleid,d_username,d_message,d_time) values(?,?,?,?,?,?)";
    var params = [req.body.d_id,u_result[0].userId,a_result[0].a_id,req.body.d_username,req.body.d_message,req.body.d_time];
    console.log(params);
    conn.query(sql,params,function(err,result){
        if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
        //result.affectedRows(影响行数)
        
		if(result.affectedRows>0){

		 conn.query('select * from comm',function(err,result){
			 
		locals.list = result;
        locals.title="评论信息管理";
        res.render('comms/comm_table',locals);
		//加载模板
        
       
      	
		});
      
	
	}else{
		
		locals.info = '添加失败！';
        locals.title="评论信息管理";
        res.render('comms/info',locals);
		//加载模板
        }
		
		    });
        });
		
		
    });
});

router.get('/delete', function(req, res, next) {
         var sql = "delete from comm where d_id=?";
		 var params = [req.query.d_id];
		 console.log(params);
		  conn.query(sql,params,function(err,result){
          if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		 //result.affectedRows(影响行数)
        if(result.affectedRows>0){
			 conn.query('select * from comm',function(err,result){
		      locals.list = result;
              locals.title="评论信息管理";
              res.render('comms/comm_table',locals);
		      //加载模板
	});
			
			
        }else{
			 locals.info ='删除失败！';
              locals.title="评论信息管理";
              res.render('comms/info',locals);
		      //加载模板
			
        }
    });
});


//加载新闻修改表单
router.get("/update",function(req,res,next){
	conn.query('select * from comm where d_id='+req.query.d_id,function(err,result){
		
		  if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		console.log(result);
		
		      locals.vo =result[0];
              locals.title="评论信息管理";
              res.render('comms/updatecomm',locals);
		      //加载模板
		
	});
   
});

//进行新闻修改操作
router.get('/doUpdate', function(req, res, next) {
         var sql = "update comm set d_userid=?,d_articleid=?,d_username=?,d_message=?,d_time=? where d_id=?";
		 var params = [req.query.d_userid,req.query.d_articleid,req.query.d_username,req.query.d_message,req.query.d_time,req.query.d_id];
		 console.log(params);
		  conn.query(sql,params,function(err,result){
          if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		console.log(req.query.id+"ddddddddddd");
		 //result.affectedRows(影响行数)
        if(result.affectedRows>0){
           
		    conn.query('select * from comm',function(err,result){
				
				locals.list =result;
              locals.title="评论信息管理";
              res.render('comms/comm_table',locals);
		      //加载模板
          
          
	      });
		   
		   
        }else{
			
			  locals.info ='修改失败！';
              locals.title="评论信息管理";
              res.render('comms/info',locals);
		      //加载模板
        }
    });
});


module.exports = router;
