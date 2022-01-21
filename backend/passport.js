var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');

// DB connect
var db = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '1111',
	database : 'project'
});
db.connect();

passport.serializeUser(function(user, done) { // 로그인 성공 시 콜백 함수 호출
	// console.log("serializeUser() 호출", user);
	done(null, user); // req.user를 deserializeUser로 보내줌
});

passport.deserializeUser(function(user, done) { // 사용자가 웹 페이지 내에서 이동할 때마다 콜백 함수 호출
	// console.log("deserializeUser() 호출", user); user 인자에는 serializeUser()에서 보낸 user값이 담김
	done(null, user); // 사용자의 정보가 session에 user로 저장
});

// 로그인 기능
passport.use('local-login', new LocalStrategy({
	usernameField: 'id',
	passwordField: 'password',
}, function (id, password, done) {

	var sql = 'select * from User where id=?';
	db.query(sql, [id], function(err, rows, fields) {
		if(err){
			console.log(err);
			return done(err);
		} else {
			if(rows[0]!=undefined) { // 아이디가 존재할 때

				const salt = rows[0].salt; // DB에서 salt값 받아옴(salt : 비밀번호 암호화 시 사용되는 값)
				crypto.pbkdf2(password, salt, 256, 64, "sha512", function(err, key) {
					if(err) {
						console.log("pbkdf2 err : " + err);
						return;
					} else {
						const hash = key.toString("base64"); // hash = 비밀번호 값
						if(id == rows[0].id && hash == rows[0].password) { // 아이디, 비밀번호 일치
							// console.log("로그인 성공");

							// 기존에 로그인된 세션 관리(중복 체크)
							var sql2 = "select json_unquote(json_extract(data, '$.passport.user.username')) as username from sessions where json_unquote(json_extract(data, '$.passport.user.username')) = ?";
							db.query(sql2, [id], function(err, rows2, fields) {
								if(err){
									console.log(err);
									return done(err);
								} else {
									if(rows2[0]!=undefined) {
										var sql3 = "update sessions set data = JSON_SET(data, '$.passport.user.is_duplicated', ?) where json_unquote(json_extract(data, '$.passport.user.username')) = ?";
										db.query(sql3, [true, id], function(err, rows, fields) {
											if(err){
												console.log(err);
												return done(err);
											} else {
												console.log("중복되는 세션 업데이트 완료");
											}
										}); // sql문
									} else {
										console.log("중복되는 세션 없음");
									}
								}
							}); // sql문

							// 세션에 저장될 user
							return done(null, {
								username: rows[0].id,
								is_logined: true,
								is_duplicated: false
							});

						} else { // 비밀번호 틀렸을 때
							// console.log("로그인 실패-비밀번호 불일치");
							return done(null, false);
						}
					}
				}); // crypto
			} else { // 아이디가 존재하지 않을 때
				// console.log("로그인 실패-아이디 존재하지 않음");
				return done(null, false);
			}
		}
	});
}));

module.exports = passport;