// 모듈 불러오기
var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
const axios = require('axios');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// + delete문 기존 오류 추후 해결
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
	var id = req.params.id;
	var year = req.body.year; // 만약 오류 발생한다면, clieckedDate.year 이게 잘못된 코드일 가능성도 있음
	var month = req.body.month;
	var date = req.body.clickedDate;
	var title = req.body.title; // 안 적어놨길래! title 추가 필요

	// 아래는 값이 없을 시  DB 등록 전 따로 처리 필요
	var start_hour = req.body.start_hour;
	var start_minute = req.body.start_minute;
	var end_hour = req.body.end_hour;
	var end_minute = req.body.end_minute;
	var memo = req.body.memo;

	var result = {}; // 성공 여부

	
	// ? 부분에 프론트에서 오는 빈 데이터?로 한 번만 바꿔주세요. 만약 잘 안되면 내쪽에서 수정함
	// (어떤 형태로 오는지 백 엔드 쪽이서는 지금 확인 불가, 우선 주석 처리)
	if(start_hour == null && start_minute == null && end_hour == null && end_minute == null && memo == null) {
		let resultData = {}; // 성공 여부
		// 1. 시작 시간, 끝나는 시간, 메모 전부 입력 값이 없을 때
		var sql = 'insert into Schedule(year, month, date, title, id) values(?, ?, ?, ?, ?)';
		db.query(sql, [year, month, date, title, id], function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.status(500);
			} else {
				resultData.addSchedule = true; // 등록 성공 여부 = true
				res.status(200).json({
					resultData,
					message : "add schedule success"}); // 일정 등록 성공
			}
		}); // sql문
	} else if(start_hour == null && start_minute == null && end_hour == null && end_minute == null) {
		// 2. 시작 시간, 끝나는 시간에 입력 값이 없을 때
		let resultData = {}; // 성공 여부
		var sql2 = 'insert into Schedule(year, month, date, title, memo, id) values(?, ?, ?, ?, ?, ?)';
		db.query(sql2, [year, month, date, title, memo, id], function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.status(500);
			} else {
				resultData.addSchedule = true;
				res.status(200).json({
					resultData,
					message : "add schedule success"});
			}
		}); // sql문
	} else if(memo == null) {
		let resultData = {}; // 성공 여부
		// 3. 메모에만 입력 값이 없을 때
		var sql3 = 'insert into Schedule(year, month, date, title, start_hour, start_minute, end_hour, end_minute, id) values(?, ?, ?, ?, ?, ?, ?, ?, ?)';
		db.query(sql3, [year, month, date, title, start_hour, start_minute, end_hour, end_minute, id], function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.status(500);
			} else {
				resultData.addSchedule = true;
				res.status(200).json({
					resultData,
					message : "add schedule success"});
			}
		}); // sql문
	} else {
		let resultData = {}; // 성공 여부
		// 4. 시작 시간, 끝나는 시간, 메모 전부 입력 값이 있을 때(전부 입력한 경우)
		var sql4 = 'insert into Schedule(year, month, date, title, start_hour, start_minute, end_hour, end_minute, memo, id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
		db.query(sql4, [year, month, date, title, start_hour, start_minute, end_hour, end_minute, memo, id], function(err, rows, fields) {
			if(err) {
				console.log(err);
				res.status(500);
			} else {
				resultData.addSchedule = true; // 등록 성공 여부 = true
				res.status(200).json({
					resultData,
					message : "add schedule success"}); // 일정 등록 성공
			}
		}); // sql문
	} // if문
	
});

// 2. 일정 조회
router.get('/:id/:year/:month', function(req, res) {
	var id = req.params.id;
	var year = req.params.year;
	var month = req.params.month;

	var result = {}; // 성공 여부
	var array = []; // 받아온 데이터 저장(한 사용자의 일정이 여러 개일 수 있기 떄문에 객체x, 배열 사용)

	// 나중에 특정한 하나의 일정을 편집/삭제할 수 있기 때문에 post_id(일정 한 개 당 고유한 값)도 받아와야 함
	var sql = 'select post_id, month, date, title, start_hour, start_minute, end_hour, end_minute, memo from Schedule where id=? and year=? and month=?';
	db.query(sql, [id, year, month], function(err, rows, fields) {
		if(err) {
			console.log(err);
			res.status(500);
		} else {
			if(rows[0]!=undefined) {
				//var j=0;
				for(var i=0; i<rows.length; i++) {
					array[i] = rows[i];
				}
				result.showSchedule = true; // 일정 조회 성공 여부
				res.status(200).json({
					result,
					array, // 프론트에서는 array[0].title 이런 식으로 값 하나하나씩 사용 가능
					// * 시작 시간, 끝나는 시간, 메모 등 default 값으로 오는 것 또한
					// 프론트에서 정확히 어떤 형식으로 오는지 확인을 못해서 우선은 처리를 안 했음
					// 만약 백에서 처리하는 게 맞다 싶으면 코드 받은 뒤 내가 수정함!
					message : "show schedule data success"}); // 일정 조회 성공
					console.log(res);
			} else {
				// 회원이 아직 아무것도 등록하지 않은 상태(혹시 몰라 result와 message만 넘겨줌)
				result.showSchedule = false
				res.status(200).json({
					result,
					message : "no schedules registered yet"});
			}
		}
	});
});

/* 3. 일정 편집
router.patch('/:id/:date/:post_id', function(req, res) { // post?
});

// 4. 일정 삭제
router.get('/:id/:date/:post_id', function(req, res) { // delete
});
*/

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