<template>
  <div class="container">
    <div class="mb-3 w-25">
        <label for="id" class="form-label">아이디</label>
        <input type="text" class="form-control" id="id" v-model="user.id">
    </div>
    <div class="mb-3 w-25">
        <label for="pwd" class="form-label">비밀번호</label>
        <input type="text" class="form-control" id="pwd" v-model="user.password">
    </div>
    <button type="submit" class="btn btn-secondary mb-3" :click="login">로그인</button>
</div>
</template>

<script>
import axios from 'axios'
export default ({
    data() {
        return {
            user : {
                id: '',
                password: '' 
            }
        }
    },
    methods: {
        login () {
            axios.post('/user/login', {
                user: this.user
            })
            .then((res)=> console.log(res));
        }
    }
})
</script>

<style scoped>

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  
}

.mb-3 {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
}

.form-label {
    font-weight: 700;
    font-size: 13px;
    text-align: left;
}

.btn {
    font-size: 13px;
    margin-top: 50px;
}

</style>