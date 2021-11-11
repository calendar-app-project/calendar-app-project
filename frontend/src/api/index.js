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

export {  loginUser, joinUser, logoutUser, leaveUser };
