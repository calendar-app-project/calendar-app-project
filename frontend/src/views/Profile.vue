<template>
    <div class="container">
        <div class="userIcon">
            <font-awesome-icon icon="circle-user" size="5x" color="lightgray"/>
        </div>
        <div class="profile">
            <h3>안녕하세요,</h3>
            <p>{{ userId +'님!' }}</p>
        </div>
        <div class="buttons">
            <button class="btn btn-outline-secondary" @click="goHome">홈으로</button>
            <button class="btn btn-outline-secondary" @click="leave"> 회원탈퇴</button>
        </div>
        <transition name = "show">
            <div class="confirmInfo" :class="{ 'animation': isLeave}">
                <label class="form-label">비밀번호를 입력하세요.</label>
                <form @submit.prevent="confirmPwd(password)" class="form">
                    <div class="form-group">
                        <input type="password" class="pwdInputField form-control" :class="{'is-invalid': notMatch }" v-model="password"/>
                        <div class="invalid-feedback">비밀번호가 일치하지 않습니다.</div>
                    </div>
                    <button type="submit" class="btn btn-secondary confirmPwd">확인</button>
                </form>
            </div>
        </transition>
    </div>
</template>

<script>
import { leaveUser } from '../api/index';

export default ({
    data() {
        return {
            isLeave: false,
            password: '',
            notMatch: false,
        }
    },
    computed: {
        userId() {
            return this.$store.state.user.userId;
        },
    },
    methods: {
        goHome() {
            return this.$router.push({name: 'Main'});
        },
        leave() {
            this.isLeave = true;
        },
        async confirmPwd(password) {
            try {
                const res = await leaveUser({password});
                if(res.data.resultData.isPwdMatch){
                    await this.$store.dispatch('user/leave');
                    this.goHome();
                }else {
                    this.notMatch = true;
                }
            }catch(err) {
                console.log(err);
            }
        }

    }
})
</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
}
.userIcon {
    margin: 30px 0;
}
.profile > p{
    font-size: 18px;
    margin-top: 10px;
}
.buttons {
    margin-top: 100px;
}
.btn {
    font-size: 13px;
    margin: 10px;
}
.confirmInfo {
    margin-top: 40px;
    opacity: 0;
}
.confirmInfo > .form-label {
    font-size: 14px;
    margin: 5px;
}
.animation{
    opacity: 1;
    transition: .8s;
}
.form {
   display: flex;
   align-items: baseline;
}
.confirmPwd {
    min-width: 55px;
}
.invalid-feedback {
    font-size: 12px;
}
</style>