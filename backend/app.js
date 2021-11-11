// 모듈 불러오기
var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session'); // session 객체
var mysqlstore = require("express-mysql-session")(session);
var path = require('path');
const axios = require('axios');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// express -> bodyParser

// var cookieParser = require('cookie-parser');
// app.use(cookieParser());

// session 사용
app.use(session({
	key: "session_cookie_name", // 쿠키 name
	secret: "session_cookie_secret",
	resave: false,
	saveUninitialized: true,
	// cookie : { maxAge : 30000 }, // 30초
	store: new mysqlstore({
		host : 'localhost',
		port : 3307,
		user : 'root',
		password : '1111',
		database : 'project'
		})
}));

// 회원 관리 라우팅
var userRouter = require('./routes/user');
app.use(express.static(path.join(__dirname, 'pub')));
app.use('/api/user', userRouter);

// 3000번 port listening
app.listen(3000, function(){
	console.log('Connected 3000 port!');
});

/*app.get('/', function(req, res){
	if (req.session.is_logined) {
		res.render('main_view', {user_id:req.session.nickname});
	} else {
		res.redirect('/user/login');
	}
});

app.post('/api/user/login', (req, res) => {
    res.json({
        state: 200,
        message: 'Hello World'
    })
});*/

// conn.end();