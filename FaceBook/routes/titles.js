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
    
	conn.query('select * from user',function(err,rr){
	
	conn.query('select * from tag',function(err,t_res){
		
		locals.list = result;
		locals.list_user = rr;
		locals.list_tag = t_res;
        locals.title="文章信息管理";
        res.render('titles/article_table',locals);
		//加载模板
    

	

	});

	});
 
	 });
});




router.post('/doAdd', function(req, res, next) {
	

	conn.query('select userId from user where username=?',[req.body.username],function(err,u_result){
	console.log(u_result[0].userId);
	conn.query('select t_id from tag where t_name=?',[req.body.t_name],function(err,t_result){
		
	console.log(t_result[0].t_id);	    
	var sql = "insert into article(a_id,user_id,tag_id,title,author,address,abstracts,message,time,click_num,booleanrec) values(?,?,?,?,?,?,?,?,?,?,?)";
    var params = [req.body.a_id,u_result[0].userId,t_result[0].t_id,req.body.title,req.body.author,req.body.address,req.body.abstracts,req.body.message,req.body.time,req.body.click_num,req.body.booleanrec];
    console.log(params);
    conn.query(sql,params,function(err,result){
        if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
        //result.affectedRows(影响行数)
        
		if(result.affectedRows>0){

		 conn.query('select * from article',function(err,result){
			 
			 
	    locals.list = result;
        locals.title="文章信息管理";
        res.render('titles/article_table',locals);
		//加载模板
		});
      
	
	}else{
		   		 
	    locals.info = '添加失败！';
        locals.title="文章信息管理";
        res.render('titles/info',locals);
		//加载模板
        }
    });	
		









          });
		
       });
   });

router.get('/delete', function(req, res, next) {
         var sql = "delete from article where a_id=?";
		 var params = [req.query.a_id];
		 console.log(params);
		  conn.query(sql,params,function(err,result){
          if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		 //result.affectedRows(影响行数)
        if(result.affectedRows>0){
			
           conn.query('select * from article',function(err,result){
			   
		locals.list = result;
        locals.title="文章信息管理";
        res.render('titles/article_table',locals);
		//加载模板
    

	
	});
			
			
        }else{
			locals.info = '删除失败！';
            locals.title="文章信息管理";
            res.render('titles/info',locals);
		//加载模板
        }
    });
});


//加载新闻修改表单
router.get("/update",function(req,res,next){
	conn.query('select * from article where a_id='+req.query.a_id,function(err,result){
		
		  if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		console.log(result);
		
		    locals.vo = result[0];
            locals.title="文章信息管理";
            res.render('titles/updatetitle',locals);
		//加载模板
		
	});
   
});

// article(a_id,user_id,tag_id,title,author,address,abstracts,message,time,click_num,booleanrec

//进行新闻修改操作
router.get('/doUpdate', function(req, res, next) {
         var sql = "update article set user_id=?,tag_id=?,title=?,author=?,address=?,abstracts=?,message=?,time=?,click_num=?,booleanrec=? where a_id=?";
		 var params =  [req.query.user_id,req.query.tag_id,req.query.title,req.query.author,req.query.address,req.query.abstracts,req.query.message,req.query.time,req.query.click_num,req.query.booleanrec,req.query.a_id];
		 console.log(params);
		 console.log(req.query.a_id+"ddddddddddd");
		  conn.query(sql,params,function(err,result){
          if(err){
            console.log('[insert error:]'+err.message);
            return;
        }
		console.log(req.query.a_id+"ggggggggg");
		 //result.affectedRows(影响行数)
        if(result.affectedRows>0){
           
		    conn.query('select * from article',function(err,result){
				
				
		    locals.list = result;
            locals.title="文章信息管理";
            res.render('titles/article_table',locals);
		//加载模板
          
          
	      });
		   
		   
        }else{
			locals.info = '修改失败！';
            locals.title="文章信息管理";
            res.render('titles/info',locals);
		//加载模板
        }
    });
});


module.exports = router;
