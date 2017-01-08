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

    conn.query('select * from tag',function(err,result){
		
		
		locals.list = result;
        locals.title="博客标签管理";
        res.render('tags/tag_table',locals);
		//加载模板

	});
});

router.get('/add', function(req, res, next) {
       res.render('news/add',{title:"博客标签管理"});
});


router.get('/doAdd', function(req, res, next) {
    var sql = "insert into tag(t_id,t_name,t_state,t_addtime) values(?,?,?,?)";
    var params = [req.query.t_id,req.query.t_name,req.query.t_state,req.query.t_addtime];
    console.log(params);
    conn.query(sql,params,function(err,result){
        if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
        //result.affectedRows(影响行数)
        
		if(result.affectedRows>0){

		locals.info = '添加成功！';
        locals.title="标签列表";
	    res.render('tags/info',locals);
      
	
	}else{
		
		    locals.info = '添加失败！';
            locals.title="标签列表";
	       res.render('tags/info',locals);
        }
    });
});

router.get('/delete', function(req, res, next) {
         var sql = "delete from tag where t_id=?";
		 var params = [req.query.t_id];
		 console.log(params);
		  conn.query(sql,params,function(err,result){
          if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		 //result.affectedRows(影响行数)
        if(result.affectedRows>0){
			 conn.query('select * from tag',function(err,result){
				 
		   locals.list = result;
            locals.title="博客标签管理";
	       res.render('tags/tag_table',locals);
           
            
	});
			
			
        }else{
			
					 
		   locals.info = '添加失败！';
            locals.title="标签列表";
	       res.render('tags/info',locals);
       
        }
    });
});


//加载新闻修改表单
router.get("/update",function(req,res,next){
	conn.query('select * from tag where t_id='+req.query.t_id,function(err,result){
		
		  if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		console.log(result);
		
				 
		   locals.vo = result[0];
            locals.title="标签信息管理";
	       res.render('tags/updatetag',locals);
		
	});
   
});

//进行新闻修改操作
router.get('/doUpdate', function(req, res, next) {
         var sql = "update tag set t_name=?,t_state=?,t_addtime=?where t_id=?";
		 var params = [req.query.t_name,req.query.t_state,req.query.t_addtime,req.query.t_id];
		 console.log(params);
		  conn.query(sql,params,function(err,result){
          if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		console.log(req.query.id+"ddddddddddd");
		 //result.affectedRows(影响行数)
        if(result.affectedRows>0){
			
			locals.info = '修改成功！';
            locals.title="标签列表";
	       res.render('tags/info',locals);
           
          
	     
		   
		   
        }else{
			
			locals.info = '修改失败！';
            locals.title="标签信息管理";
	       res.render('tags/info',locals);
        }
    });
});


module.exports = router;
