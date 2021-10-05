var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
const axios = require('axios');

var db = mysql.createConnection({
	host : 'localhost',
	port : 3307,
	user : 'root',
	password : '1111',
	database : 'project'
});
db.connect();

// 로그인
router.post('/login', function(req, res) {
	var id = req.body.id;
	var password = req.body.password;
	var sql = 'select * from User where id=?';
	db.query(sql, [id], function(err, rows, fields){
		if(rows[0]!=undefined) { // 아이디가 존재할 때
			if(id == rows[0].id && password == rows[0].password) {
				req.session.is_logined = true;
				req.session.nickname = rows[0].id;
				req.session.save(function(){
					res.json({message:"로그인에 성공하였습니다.(세션 연결)"});
				});
				//res.json({message:"로그인에 성공하였습니다."});
			} else {
				res.json({message:"비밀번호가 일치하지 않습니다."});
			}
		} else { // 아이디가 존재하지 않을 때
			res.json({message:"존재하지 않는 아이디입니다."});
		}
	});
});

// 회원가입
router.post('/join', function(req, res){
	var id = req.body.id;
	var password = req.body.password;
	var sql = 'select id from User where id=?';
	db.query(sql, [id], function(err, rows, fields){
		if(rows[0]!=undefined) { // 아이디가 이미 존재할 때
			res.json({message:"이미 사용중인 아이디입니다"});
		} else {
			var sql2 = 'insert into User(id, password) values(?, ?)';
			db.query(sql2, [id, password], function(err, rows, fields){
				res.json({message:"회원가입에 성공하였습니다"});
			});
		}
	});
});

/*
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
});*/

module.exports = router;