import axios from 'axios'

//로그인 api
function loginUser(userData) {
    return axios.post('/api/user/login', userData)
}

//회원가입 api
function joinUser(userData) {
    return axios.post('/api/user/join', userData)
}

function logoutUser() {
    return axios.get('/api/user/logout')
}

function leaveUser(userData) {
    return axios.delete('/api/user/leave', userData)
}

export {  loginUser, joinUser, logoutUser, leaveUser };
