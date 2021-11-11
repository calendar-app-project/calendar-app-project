// 모듈 불러오기
var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
const crypto = require('crypto'); // 비밀번호 암호화 모듈
const axios = require('axios');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DB 연결
var db = mysql.createConnection({
	host : 'localhost',
	port : 3307,
	user : 'root',
	password : '1111',
	database : 'project'
});
db.connect();

// 1. 로그인
router.post('/login', function(req, res) {
	var id = req.body.id;
	var password = req.body.password;
	var sql = 'select * from User where id=?';
	db.query(sql, [id], function(err, rows, fields){
		if(err){
			console.log(err);
			res.status(500);
		} else {
			if(rows[0]!=undefined) { // 아이디가 존재할 때

				const salt = rows[0].salt; // DB에서 salt값 받아옴(salt : 비밀번호 암호화 시 사용되는 값)
				crypto.pbkdf2(password, salt, 256, 64, "sha512", function(err, key) {
					if(err) {
						console.log("pbkdf2 err : " + err);
						return;
					} else {
						const hash = key.toString("base64"); // hash = 비밀번호 값
						if(id == rows[0].id && hash == rows[0].password) { // 아이디, 비밀번호 일치(로그인 성공)
							req.session.is_logined = true;
							req.session.nickname = rows[0].id;
							req.session.save(function(){
								res.status(200).json({
									userId: id,
									message:"login success"});
							});
						} else { // 비밀번호 틀렸을 때
							res.status(400).json({message:"password fail"});
						}
					}
				}); // crypto
			} else { // 아이디가 존재하지 않을 때
				res.status(400).json({message:"id fail"});
			}
		}
	});
});

// 2. 회원가입
router.post('/join', function(req, res){
	var id = req.body.id;
	var password = req.body.password;
	var sql = 'select id from User where id=?';
	db.query(sql, [id], function(err, rows, fields){
		if(err){
			console.log(err);
			res.status(500);
		} else {
			if(rows[0]!=undefined) { // 아이디가 이미 존재할 때
				res.status(400).json({ message:"id fail"});
			} else {
				// 비밀번호 암호화 후 DB에 회원 정보 등록
				crypto.randomBytes(64, function(err, buf) {
					if(err) {
						console.log("randomBytes err : " + err);
						return;
					} else {
						const salt = buf.toString("base64");
						crypto.pbkdf2(password, salt, 256, 64, "sha512", function(err, key) {
							if(err) {
								console.log("pbkdf2 err : " + err);
								return;
							} else {
								const hash = key.toString("base64");
								var sql2 = 'insert into User(id, password, salt) values(?, ?, ?)';
								db.query(sql2, [id, hash, salt], function(err, rows, fields){ // 회원 등록
									if(err) {
										console.log(err);
										res.status(500);
									} else { // 회원 가입 성공
										res.status(200).json({message:"join success"});
									}
								});
							}
						});
					}
				}); // crypto
			}
		}
	});
});

// 3. 회원탈퇴
router.post('/leave', function(req, res) {
	var id = req.session.nickname;
	var password = req.body.password;
	var sql = 'select * from User where id=?';
	db.query(sql, [id], function(err, rows, fields) {
		if(err){
			console.log(err);
			res.status(500);
		} else {
			const salt = rows[0].salt; // DB에서 salt값 받아옴
			crypto.pbkdf2(password, salt, 256, 64, "sha512", function(err, key) {
				if(err) {
					console.log("pbkdf2 err : " + err);
					return;
				} else {
					const hash = key.toString("base64");
					if(hash == rows[0].password) {
						var sql2 = 'delete from User where id=? && password=?';
						db.query(sql2, [id, hash], function(err, rows, fields) { // 회원 정보 삭제
							if(err) {
								console.log(err);
								res.status(500);
							} else { // 회원 탈퇴 성공
								req.session.destroy(function(err){
									res.status(200).json({message:"leave success"});
								});
							}
						});
					} else { // 회원 탈퇴 실패(비밀번호가 틀린 경우)
						res.status(400).json({message:"password fail"});
					}
				}
			}); // crypto
		}
		});
});

// 4. 로그아웃
router.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		res.redirect('/'); // 필수
	});
});

module.exports = router;