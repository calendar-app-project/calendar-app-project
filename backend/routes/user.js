var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');

var db = mysql.createConnection({
	host : 'localhost',
	port : 3307,
	user : 'root',
	password : '1111',
	database : 'project'
});
db.connect();

app.set('view engine', 'jade');
app.set('views', './views');

const axios = require('axios');

// 로그인

router.get('/login', function(req, res) {
	res.render('login_view');
}); // localhost:3000/user/login


router.post('/login', function(req, res) {
	var id = req.body.id;
	var password = req.body.password;
	var sql = 'select * from User where id=?';
	db.query(sql, [id], function(err, rows, fields){
		if(rows[0]!=undefined) {
			if(id == rows[0].id && password == rows[0].password) {
				req.session.is_logined = true;
				req.session.nickname = rows[0].id;
				req.session.save(function(){
					res.redirect('/');
				});
			} else {
				res.render('login_view', {guide:'비밀번호가 틀렸습니다.'})
			}
		} else {
			res.render('login_view', {guide:'존재하지 않는 아이디입니다.'});
		}
	})
})
router.post('/login', function(req, res) {
	console.log("req:", req.body);
	res.json({message:"test"});
});

// 회원가입
router.get('/join', function(req, res) {
	res.render('join_view',{guide:'영소문자 / 숫자 / 특수문자를 조합하여 입력해주세요'});
});

router.post('/join', function(req, res){
	var id = req.body.id;
	var password = req.body.password;
	var repassword = req.body.repassword;
	var password_standard = /^.*(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$/;

	if (password != repassword) {
		res.render('join_view', {guide:'비밀번호가 일치하지 않습니다.'});
	} else {
		if (!password_standard.test(password)) {
			res.render('join_view', {guide:'비밀번호 기준을 만족하지 못했습니다.(영소문자 / 숫자 / 특수문자 조합)'})
		} else {
			var sql = 'select id from User where id=?';
			db.query(sql, [id], function(err, rows, fields){
				if(rows[0]!=undefined) {
					res.render('join_view', {guide:'이미 사용중인 아이디입니다.'});
				} else {
					var sql2 = 'insert into User(id, password) values(?, ?)';
					db.query(sql2, [id, password], function(err, rows, fields){
						if(err) {
							console.log(err);
							res.status(404).send('회원가입에 실패하였습니다.');
						} else {
							res.redirect('/');
						}
					});
				}
			});
		}
	}
});

// 유저 정보(프로필) 조회
router.get('/profile', function(req,res) {
	res.render('user_view', {user_id:req.session.nickname, guide:'회원탈퇴를 원하시면 비밀번호를 입력해주세요.'});
});

// 회원탈퇴
router.post('/profile', function(req,res) {
	var id = req.session.nickname;
	var password = req.body.password;
	var sql = 'select password from user where id=?'
	db.query(sql, [id], function(err, rows, fields){
		if(password == rows[0].password) {
			var sql2 = 'delete from User where id=? && password=?';
			db.query(sql2, [id,password], function(err, rows, fields){
				if(err) {
					console.log(err);
				} else {
					req.session.destroy(function(err){
						res.redirect('/');
					})
				}
			});
		} else {
			res.render('user_view', {guide:'비밀번호가 일치하지 않습니다.'});
		}
	});
});

// 로그아웃
router.get('/logout', function(req, res) {
	req.session.destroy(function(err){
		res.redirect('/');
	})
});

module.exports = router;