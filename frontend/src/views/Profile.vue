<template>
    <div class="container">
        <div class="userIcon">
            <font-awesome-icon icon="user-circle"  size="5x" color="lightgray"/>
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
            <div class="mb-3 confirmInfo" :class="{ 'animation': isLeave}">
                <label class="form-label">비밀번호를 입력하세요.</label>
                <div class="passwordInput">
                    <form class="passwordInput" @submit.prevent="confirmPwd(password)">
                        <input name="password" type="password" class="form-control" id="formGroupExampleInput" v-model="password"/>
                        <button type="submit" class="btn btn-secondary confirmPwd">확인</button>
                    </form>
                </div>
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
                if(res.data.message === 'leave success'){
                    await this.$store.dispatch('user/leave');
                    this.goHome();
                } // message나 status값에 따라서 세부적인 구분 필요할 듯!
            }catch(err) {
                console.log(err);
            }
        }

    }
})
</script>

<style scoped>
.container {
    padding-top: 40px;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0;
    
}
.confirmInfo > .form-label {
    font-size: 14px;
}
.animation{
    opacity: 1;
    transition: .8s;
}
.passwordInput {
    display: flex;
}
.passwordInput > .form-control {
    flex-basis: 68%;
    margin: 10px;
}

</style>