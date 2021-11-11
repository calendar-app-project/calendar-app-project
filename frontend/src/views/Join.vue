<template>
<div>
  <template v-if="isModal">
    <ModalView @close-modal="isModal=false">
      <template v-slot:header>
        <p>회원가입 완료!</p>
      </template>
      <template v-slot:body>
        <p>로그인 후 이용하시길 바랍니다.</p>
      </template>
      <template v-slot:footer>
        <button class="modal-default-button btn-secondary btn-sm" @click="goToLoginPage">
                    로그인 하기
        </button>
      </template>
    </ModalView>
  </template>
  <Form v-else @submit="onSubmit" :validation-schema="schema">
     <div class="container mb-4 w-25">
        <div class="userIcon">
          <font-awesome-icon icon="user-circle"  size="5x" color="lightgray"/>
        </div>
        <Field name="id" type="id"  v-slot="{ field, errorMessage, meta }">
          <div class="field">
            <label for="id" class="form-label">아이디</label>
            <input class="form-control" v-bind="field" :class="{ 'is-invalid': !meta.valid && errorMessage }"/>
            <span class="errMsg" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
          </div>
        </Field>
        <Field name="password" type="password"  v-slot="{ field, errorMessage, meta }">
          <div class="field">
            <label for="pwd" class="form-label">비밀번호</label>
            <input class="form-control" type="password" v-bind="field" :class="{ 'is-invalid': !meta.valid && errorMessage }"/>
            <span class="errMsg" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
          </div>
        </Field>
        <Field name="repassword" type="password"  v-slot="{ field, errorMessage, meta }">
          <div class="field">
            <label for="repwd" class="form-label">비밀번호 확인</label>
            <input class="form-control" type="password" v-bind="field" :class="{ 'is-invalid': !meta.valid && errorMessage }"/>
            <span class="errMsg" v-if="errorMessage && !meta.valid">{{ errorMessage }}</span>
          </div>
        </Field>
        <button type="submit" class="join-btn btn-secondary btn">회원가입</button>
     </div>
  </Form>
</div>
</template>

<script>
import { Form, Field } from 'vee-validate';
import { object, string, ref }  from 'yup';
import { joinUser } from '../api/index';
import ModalView from '../components/LoginModal.vue';

export default {
  components: {
    Form,
    Field,
    ModalView
  },
  data() {
    const schema = object({
        id: string().required('아이디를 입력해주세요.'),
        password: string().required('비밀번호를 입력해주세요.').matches(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])(?=.{8,})/,'영문자, 숫자, 특수문자를 조합하여 최소8자리를 입력해주세요.'),
        repassword: string().required('비밀번호를 입력해주세요.').oneOf([ref('password')], '비밀번호가 일치하지 않습니다.')
    });

    return {
      schema,
      isModal: false,
    };

  },
  methods: {
      async onSubmit(userData, actions) {
        try{
          const res = await joinUser(userData);
          if(res.data.message === "join success"){
            console.log(res); // 프론트에서 console log 확인하려고 추가해놓았음!
            this.isModal = true;

          }if(res.data.message === "id fail"){
            actions.setFieldError('id', '이미 사용중인 아이디 입니다.');
          }
        }catch(err) {
          console.log(err);
        }
    },
    goToLoginPage(){
            return this.$router.push({name: 'Login'});
    }
  }
}
</script>

<style scoped>
.container {
  padding-top: 40px;
  align-items: center;  
}
.userIcon {
    margin: 50px 0;
}
.field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 25px;
}
.form-label {
    font-weight: 600;
    font-size: 14px;
    color: darkslategray;  
}
.errMsg {
    font-size: 12px;
    color:rgb(209, 29, 29);
    margin-top: 5px;
}

.join-btn {
    font-size: 13px;
    margin-top: 50px;
}

.modal-default-button {
  border: 0;
  outline: 0;
}
</style>
