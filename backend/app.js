var express = require('express');
var app = express();
var mysql = require('mysql');
var session = require('express-session'); // session 객체
var mysqlstore = require("express-mysql-session")(session);

app.use(session({
	key: "session_cookie_name",
	secret: "session_cookie_secret",
	resave: false,
	saveUninitialized: true,
	store: new mysqlstore({
		host : 'localhost',
		port : 3307,
		user : 'root',
		password : '1111',
		database : 'project'
	})
}));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}))
var cookieparser = require('cookie-parser');
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');

var userRouter = require('./routes/user');
app.use('/user', userRouter);

// 메인 화면
app.get('/', function(req, res){
	if (req.session.is_logined) {
		res.render('main_view', {user_id:req.session.nickname});
	} else {
		res.redirect('/user/login');
	}
});

app.listen(3000, function(){
	console.log('Connected 3000 port!');
});

// conn.end();