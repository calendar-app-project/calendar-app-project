// 모듈 불러오기
var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
const axios = require('axios');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
	host : 'localhost',
	port : 3306,
	user : 'root',
	password : '1111',
	database : 'project'
});
db.connect();

// 1. 일정 등록
router.post('/:id', function(req, res) {
	var id = req.params.id;
	var title = req.body.title;
	var year = req.body.year;
	var month = req.body.month;
	var date = req.body.clickedDate;
	var start_hour = req.body.start_hour;
	var start_minute = req.body.start_minute;
	var end_hour = req.body.end_hour;
	var end_minute = req.body.end_minute;
	var memo = req.body.memo;

	/* 시간 관련 값들은 입력 x시 00으로 자동으로 들어가는 게 나을 것 같아서 메모만 구분함*/
	// 1. 메모에 입력 값이 없을 때(default값인 no memo로 등록됨)
	if (memo == '') { // TodoForm.vue
		var resultData = {}; // 등록 성공 여부
		var sql = 'insert into Schedule(year, month, date, title, start_hour, start_minute, end_hour, end_minute, id) values(?, ?, ?, ?, ?, ?, ?, ?, ?)';
		db.query(sql, [year, month, date, title, start_hour, start_minute, end_hour, end_minute, id], function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.status(500);
			} else {
				resultData.addSchedule = true; // 일정 등록 성공
				res.status(200).json({
					resultData,
					message : "add todo success"});
			}
		}); // sql문
	} else { // 2. 메모에 입력 값이 있을 때
		var resultData = {};
		var sql2 = 'insert into Schedule(year, month, date, title, start_hour, start_minute, end_hour, end_minute, memo, id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		db.query(sql2, [year, month, date, title, start_hour, start_minute, end_hour, end_minute, memo, id], function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.status(500);
			} else {
				resultData.addSchedule = true;
				res.status(200).json({
					resultData,
					message : "add todo success"});
			}
		}); // sql문
	} // if-else문
});

// 2. 일정 조회
router.get('/:id/:year/:month', function(req, res) {
	var id = req.params.id;
	var year = req.params.year;
	var month = req.params.month;

	var resultData = {}; // 조회 성공 여부
	var array = []; // 받아온 데이터 저장(한 사용자-일정 여러 개일 수 있기 때문에 배열 사용)

	var sql = 'select post_id, month, date, title, start_hour, start_minute, end_hour, end_minute, memo from Schedule where id=? and year=? and month=?';
	db.query(sql, [id, year, month], function(err, rows, fields) {
		if(err) {
			console.log(err);
			res.status(500);
		} else {
			if(rows[0]!=undefined) {
				for(var i=0; i<rows.length; i++) {
					array[i] = rows[i];
				}
				resultData.showSchedule = true; // 일정 조회 성공
				res.status(200).json({
					resultData,
					array, // array[0].title 이런 식으로 값 사용 가능
					message : "show todo data success"});
			} else {
				// 회원이 아직 아무것도 등록하지 않은 상태
				resultData.showSchedule = false
				res.status(200).json({
					resultData,
					message : "no schedules registered yet"});
			}
		}
	}); // sql문
});

// 3. 일정 편집
router.patch('/:post_id', function(req, res) {
	var post_id = req.params.post_id;
	var title = req.body.title;
	var start_hour = req.body.startHour;
	var start_minute = req.body.startMinute;
	var end_hour = req.body.endHour;
	var end_minute = req.body.endMinute;
	var memo = req.body.memo;

	var resultData = {}; // 편집 성공 여부
	var sql = 'update Schedule SET title=?, start_hour=?, start_minute=?, end_hour=?, end_minute=?, memo=? where post_id=?';
	db.query(sql, [title, start_hour, start_minute, end_hour, end_minute, memo, post_id], function(err, rows, fields) {
		if(err) {
			console.log(err);
			res.status(500);
		} else {
			resultData.editTodo = true; // 일정 편집 성공
			res.status(200).json({
				resultData,
				message : "edit todo data success"});
		}
	}); // sql문
});

// 4. 일정 삭제
router.delete('/:post_id', function(req, res) {
	var post_id = req.params.post_id;

	var resultData = {}; // 삭제 성공 여부
	var sql = 'delete from Schedule where post_id=?';
	db.query(sql, [post_id], function(err, rows, fields) {
		if(err) {
			console.log(err);
			res.status(500);
		} else {
			resultData.deleteTodo = true; // 일정 삭제 성공
			res.status(200).json({
				resultData,
				message : "delete todo data success"});
		}
	}); // sql문
});

/* 달력 조회
router.get('/:month', function(req, res) {
	console.log(req.params.month);
	res.json({message : "success"});

	var id = req.session.nickname;
	var month = req.params.month;

	// 채울 부분
	var resultData = {};
	var sql = 'select * from Schedule where id=? and month=?';
	db.query(sql, [id, month], function(err, rows, fields) {
		if(err) {
			console.log(err);
			res.status(500);
		} else {
			var result = rows[0]; // 받아온 전체 데이터(백엔드에서 분류? / 변수 수정)
			var resultData.showCalendar = true; // 달력 조회 성공 여부
			res.status(200).json({
				result; // result : result인지 확인 필요
				resultData,
				message : "show calendar data success"}); // 달력 조회 성공
		}
	});
});
*/

module.exports = router;