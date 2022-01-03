import axios from 'axios'

//로그인 api
function loginUser(userData) {
    return axios.post('/api/user/login', userData)
}

//회원가입 api
function joinUser(userData) {
    return axios.post('/api/user/join', userData)
}

//로그아웃 api
function logoutUser() {
    return axios.get('/api/user/logout')
}

//회원탈퇴 api
function leaveUser(userData) {
    return axios.post('/api/user/leave', userData)
}

//일정 등록 api
function addTodo(id, userData) {
    return axios.post('/api/calendar/'+ id, userData)
}

//일정 조회 api
function getTodo(id, year, month) {
    return axios.get('/api/calendar/' + id +'/' + year + '/' + month)
}

//일정 수정 api
function editTodo(postId, userData) {
    return axios.put('/api/calendar/'+ postId, userData)
}

//일정 삭제 api
function deleteTodo(postId) {
    return axios.delete('/api/calendar/' + postId)
}

//일정 검색 api
function searchTodo(id, title){
    return axios.get('/api/calendar/' + id + '/' + title)
}
export {  loginUser, joinUser, logoutUser, leaveUser, 
    addTodo, getTodo, editTodo, deleteTodo, searchTodo };
