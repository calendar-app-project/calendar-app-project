<template>
  <div class="container mb-4 w-25">
      <div class="userIcon">
        <font-awesome-icon icon="user-circle"  size="5x" color="lightgray"/>
      </div>
      <div class="field">
        <label for="id" class="form-label">아이디</label>
        <input name="id" v-model="id" type="id" class="form-control" :class="{ 'is-invalid': idError }" />
        <span class="errMsg">{{ idError }}</span>
      </div>
      <div class="field">
        <label for="pwd" class="form-label">비밀번호</label>
        <input name="password" v-model="password" type="password" class="form-control" :class="{ 'is-invalid': passwordError }" />
        <span class="errMsg">{{ passwordError }}</span>
      </div>
      <button type="submit" class="btn btn-secondary mb-3" @click="onSubmit">로그인</button>
  </div>
</template>

<script>
import { useForm, useField } from 'vee-validate'
import { object, string }  from 'yup'
import { loginUser } from '../api/index'

export default {
   
  setup() {
    //validation 스키마 정의
    const schema = object({
      id: string().required('아이디를 입력해주세요.'),
      password: string().required('비밀번호를 입력해주세요.').matches(/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])(?=.{8,})/,'영문자, 숫자, 특수문자를 조합하여 최소8자리를 입력해주세요.')
    });
    //form context 생성
    const { handleSubmit } = useForm({
        validationSchema: schema,
    });

    const { value: id, errorMessage: idError } = useField('id');
    const { value: password, errorMessage: passwordError } = useField('password');
    const onSubmit = handleSubmit(async userData => {
       try{
           const res = await loginUser(userData);
           console.log(res);
       }catch(err){
           console.log(err);
       }
    });

    return {
      id,
      idError,
      password,
      passwordError,
      onSubmit,
    }
  },
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

.btn {
    font-size: 13px;
    margin-top: 50px;
}

</style>