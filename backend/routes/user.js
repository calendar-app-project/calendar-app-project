// 모듈 불러오기
var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
var passport = require('../passport.js');
var bodyParser = require('body-parser');
var crypto = require('crypto'); // 비밀번호 암호화 모듈
var localStorage = require('localStorage');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// const axios = require('axios');

// DB connect
var db = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '1111',
	database : 'project'
});
db.connect();

// 1. 로그인
router.post('/login', function(req, res, next) {

	let resultData ={};

	passport.authenticate('local-login', function(err, user, info) {

		if(err) { // mysql 관련 error일 때
			// return next(err);
			res.status(500);
		}
		if(!user) { // 비밀번호가 틀렸거나 아이디가 존재하지 않을 때
			resultData.isMatch = false;
			res.json({
				resultData,
				message : "login fail"}); // 로그인 실패
		}
		req.logIn(user, function(err) {
			if(err) {
				// return next(err);
				console.log("logIn() error");
			} else { // 로그인이 정상적으로 이루어졌을 때
				resultData.isMatch = true; // 아이디, 비밀번호 일치 여부 = true
				res.status(200).json({
					userId: req.user.username,
					resultData,
					message : "login success"}); // 로그인 성공

				// localStorage에 id 등록
				var user = {
					id: req.user.username
				}
				localStorage.setItem('user_info', JSON.stringify(user));
			}
		}); // logIn() 
	})(req, res, next);
	//next();

});

// 2. 회원가입
router.post('/join', function(req, res){

	var id = req.body.id;
	var password = req.body.password;
	let resultData = {};

	var sql = 'select id from User where id=?';
	db.query(sql, [id], function(err, rows, fields){
		if(err){
			console.log(err);
			res.status(500);
		} else {
			if(rows[0]!=undefined) { // 아이디가 이미 존재할 때
				resultData.duplicatedId = true; // 중복 여부 = true
				res.json({
					resultData,
					message : "id duplicated"}); // 가입 실패(아이디 중복)
			} else { // false
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
									} else {
										resultData.duplicatedId = false; // 중복 여부 = false
										res.status(200).json({
											resultData,
											message : "join success"}); // 가입 성공
									}
								});
							}
						});
					}
				}); // crypto
			}
		}
	}); // sql문

});

// 3. 회원탈퇴
router.delete('/leave', function(req, res) {

	if(req.user!=undefined) { // 세션이 유효할 때
		var id = req.user.username;
		// console.log("세션 활용");
	} else { // 세션이 만료됐을 때(localStorage 활용)
		var getValue = JSON.parse(localStorage.getItem('user_info'));
		var id = getValue.id;
		// console.log("localStorage값");
	}

	var password = req.body.password;
	let resultData = {};

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
									resultData.isPwdMatch = true; // 탈퇴 성공 여부 true
									res.status(200).json({
										resultData,
										message : "leave success"}); // 회원 탈퇴 성공
								});
								// localStorage clear
								localStorage.clear(); // localStorage.removeItem('user_info');
							}
						}); // sql문
					} else { // 회원 탈퇴 실패(비밀번호가 틀린 경우)
						resultData.isPwdMatch = false; // 탈퇴 성공 여부 false
						res.json({
							resultData,
							message : "leave fail"}); // 회원 탈퇴 실패
					}
				}
			}); // crypto
		}
	}); // sql문

});

// 4. 로그아웃
router.get('/logout', function(req, res) {

	req.logout(); // delete req.user
	req.session.destroy(function(err) {
		res.status(200).json({
			message : "logout success"});
	});
	// localStorage clear
	localStorage.clear(); // localStorage.removeItem('user_info');

});

module.exports = router;

// localStorage는 서버가 끊기면 사라짐