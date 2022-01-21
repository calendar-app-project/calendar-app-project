// 모듈 불러오기
var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
const axios = require('axios');
var bodyParser = require('body-parser');
var localStorage = require('localStorage');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var db = mysql.createConnection({
	host : 'localhost',
	port : 3307,
	user : 'root',
	password : '1111',
	database : 'project'
});
db.connect();

// 1. 일정 등록
router.post('/:id', function(req, res) {
	//var getValue = localStorage.getItem('test');
	//console.log(localStorage);
	var id = req.params.id;
	var title = req.body.title;
	var year = req.body.year;
	var month = req.body.month;
	var date = req.body.clickedDate;
	var start_hour = req.body.startHour;
	var start_minute = req.body.startMinute;
	var end_hour = req.body.endHour;
	var end_minute = req.body.endMinute;
	var memo = req.body.memo;

	/* 시간 관련 값들은 입력 x시 00으로 자동으로 들어가는 게 나을 것 같아서 메모만 구분함*/
	// 1. 메모에 입력 값이 없을 때(default값인 no memo로 등록)
	if (memo == '') { // TodoForm.vue
		var resultData = {}; // 등록 성공 여부
		var sql = 'insert into Schedule(year, month, date, title, start_hour, start_minute, end_hour, end_minute, id) values(?, ?, ?, ?, ?, ?, ?, ?, ?)';
		db.query(sql, [year, month, date, title, start_hour, start_minute, end_hour, end_minute, id], function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.status(500);
			} else {
				resultData.addSchedule = true; // 일정 등록 성공
				
				// 자동등록 post_id와 'no memo' 만 받아오기(나머지는 프론트에서 처음 받은 값과 일치해서 그대로 다시 돌려줘도 됨)
				var sql2 = 'select post_id, memo from Schedule where id=? and title=?';
				db.query(sql2, [id, title], function(err, rows2, fields) {
					if(err) {
						console.log(err);
						res.status(500);
					} else {
						addData = {}; // 보내줄 데이터
						addData.post_id = rows2[0].post_id;
						addData.month = month;
						addData.date = date;
						addData.title = title;
						addData.start_hour = start_hour;
						addData.start_minute = start_minute;
						addData.end_hour = end_hour;
						addData.end_minute = end_minute;
						addData.memo = rows2[0].memo;
						res.status(200).json({
							addData,
							resultData,
							medssage : "add todo success"});
					}
				}); // sql문
			} // if-else문
		}); // sql문
	} else { // 2. 메모에 입력 값이 있을 때
		var resultData = {};
		var sql3 = 'insert into Schedule(year, month, date, title, start_hour, start_minute, end_hour, end_minute, memo, id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		db.query(sql3, [year, month, date, title, start_hour, start_minute, end_hour, end_minute, memo, id], function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.status(500);
			} else {
				resultData.addSchedule = true; // 일정 등록 성공

				var sql4 = 'select post_id from Schedule where id=? and title=?'; // 자동등록 post_id만 받아오기
				db.query(sql4, [id, title], function(err, rows2, fields) {
					if(err) {
						console.log(err);
						res.status(500);
					} else {
						addData = {}; // 보내줄 데이터
						addData.post_id = rows2[0].post_id;
						addData.month = month;
						addData.date = date;
						addData.title = title;
						addData.start_hour = start_hour;
						addData.start_minute = start_minute;
						addData.end_hour = end_hour;
						addData.end_minute = end_minute;
						addData.memo = memo;
						res.status(200).json({
							addData,
							resultData,
							message : "add todo success"});
					}
				}); // sql문
			} // if-else문
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

// 3. 일정 수정
router.put('/:post_id', function(req, res) {
	var post_id = req.params.post_id;
	var title = req.body.title;
	var start_hour = req.body.startHour;
	var start_minute = req.body.startMinute;
	var end_hour = req.body.endHour;
	var end_minute = req.body.endMinute;
	var memo = req.body.memo;

	var resultData = {}; // 수정 성공 여부
	var sql = 'update Schedule SET title=?, start_hour=?, start_minute=?, end_hour=?, end_minute=?, memo=? where post_id=?';
	db.query(sql, [title, start_hour, start_minute, end_hour, end_minute, memo, post_id], function(err, rows, fields) {
		if(err) {
			console.log(err);
			res.status(500);
		} else {
			resultData.editTodo = true; // 일정 수정 성공
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

// 5. 일정 검색
router.get('/:id/:title', function(req, res) {
	var id = req.params.id;
	var title = req.params.title;
	var search_title = "%"+title+"%"; // 최종적으로 검색할 변수

	var resultData = {}; // 검색 성공 여부
	var array = [];

	var sql = 'select post_id, year, month, date, title from Schedule where id=? and title like ?';
	db.query(sql, [id, search_title], function(err, rows, fields) {
		if(err) {
			console.log(err);
			res.status(500);
		} else {
			if(rows[0]!=undefined) {
				for(var i=0; i<rows.length; i++) {
					array[i] = rows[i];
				}
				resultData.searchTodo = true; // 일정 검색 성공
				res.status(200).json({
					resultData,
					array,
					message : "search todo data success"});
			} else {
				// 검색 결과가 없을 시
				resultData.searchTodo = false
				res.status(200).json({
					resultData,
					message : "no search data found"});
			}
		}
	}); // sql문
});

module.exports = router;