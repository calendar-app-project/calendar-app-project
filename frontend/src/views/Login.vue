<template>
  <Form @submit="onSubmit" :validation-schema="schema">
     <div class="container mb-4 w-25">
        <div class="userIcon">
          <font-awesome-icon icon="circle-user"  size="5x" color="lightgray"/>
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
        <div class="loginErr" v-if="loginErr">로그인에 실패하였습니다.</div>
        <button type="submit" class="btn btn-secondary mb-3">로그인</button>
     </div>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';
import { object, string }  from 'yup';
import { loginUser } from '../api/index';

export default {
  components: {
    Form,
    Field,
  },
  data() {
    return {
      loginErr :false,
    }
    },
  computed: {
    schema() {
      return object({
        id: string().required('아이디를 입력해주세요.'),
        password: string().required('비밀번호를 입력해주세요.').matches(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])(?=.{8,})/,'영문자, 숫자, 특수문자를 조합하여 최소8자리를 입력해주세요.')
      });
    },
  },
  methods: {
      async onSubmit(userData, actions) {
        try {
           const res = await loginUser(userData);
           if(res.data.resultData.isMatch && res.data.userId){
              console.log(res);
              await this.$store.dispatch('user/login', res.data.userId);
              this.$router.push({name: 'Main'});
              }else {
                 actions.setFieldError('id', '아이디 또는 비밀번호가 일치하지 않습니다.');
                 actions.setFieldError('password', '아이디 또는 비밀번호가 일치하지 않습니다.');
              }
        }catch(err) {
          console.log(err);
           }
      }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}
.userIcon {
    margin: 50px 0;
}
.field {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 25px;
    min-width: 180px;
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
    max-width: 190px;
    
}
.btn {
    font-size: 13px;
    margin-top: 50px;
    min-width: 65px;
}

</style>