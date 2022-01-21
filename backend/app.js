// 모듈 불러오기
var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session'); // session 객체
var mysqlstore = require("express-mysql-session")(session);
var passport = require('./passport.js');
var bodyParser = require('body-parser');
var path = require('path');
const history = require('connect-history-api-fallback');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// const axios = require('axios');
// var cookieParser = require('cookie-parser');
// app.use(cookieParser());

// session use
app.use(session({
	key: "session_cookie_name", // 세션 ID의 키 이름(쿠키 name)
	secret: "session_cookie_secret", // 세션 ID 서명
	resave: false,
	saveUninitialized: false, // 로그인 기준으로 세션 생성
	store: new mysqlstore({
		host : 'localhost',
		port : 3306,
		user : 'root',
		password : '1111',
		database : 'project'
		})
}));
app.use(passport.initialize()); // passport setting
app.use(passport.session());

// 회원 관리 & 일정 관리 라우팅
var userRouter = require('./routes/user'); // 회원 관리
var calendarRouter = require('./routes/calendar'); // 일정 관리
var calendarRouter = require('./routes/calendar');
app.use('/api/user', userRouter);
app.use('/api/calendar', calendarRouter);

app.use(history()); //미들웨어 실행 순서 중요!!!!!!
app.use(express.static(path.join(__dirname, 'pub')));

// 3000번 port listening
app.listen(3000, function(){
	console.log('Connected 3000 port!');
});

// conn.end();