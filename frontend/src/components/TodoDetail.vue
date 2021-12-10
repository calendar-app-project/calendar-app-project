<template>
    <form class="todoDetail">
        <div class="mb-3">
            <label for="title" class="form-label">일정</label>
            <input v-if="editStatus" type="text" class="form-control" id="title" v-model="userData.title"/>
            <p v-else type="text" id="title">{{ userData.title }}</p>
        </div>
        <div class="mb-3">
            <label for="startTime" class="form-label">시작 시간</label>
            <div class="times" v-if="editStatus">
                <input type="text" class="form-control time" id="startHour" v-model="userData.startHour"/>
                <input type="text" class="form-control time" id="startMinute" v-model="userData.startMinute"/>
            </div>
            <div class="times" v-else>
                <p type="text" id="startHour">{{ userData.startHour+':' }}</p>
                <p type="text" id="startMinute">{{ userData.startMinute }}</p>
            </div>
        </div>
        <div class="mb-3">
            <label for="endTime" class="form-label">종료 시간</label>
            <div class="times" v-if="editStatus">
                <input type="text" class="form-control time" id="endHour" v-model="userData.endHour"/>
                <input type="text" class="form-control time" id="endMinute" v-model="userData.endMinute"/>
            </div>
            <div class="times" v-else>
                <p type="text" id="endHour">{{ userData.endHour+':' }}</p>
                <p type="text" id="endMinute">{{ userData.endMinute }}</p>
            </div>
        </div>
        <div class="mb-3">
            <label for="memo" class="form-label">메모</label>
            <textarea v-if="editStatus" type="text" class="form-control" id="memo" rows="3" v-model="userData.memo"/>
            <p type="text" v-else id="memo">{{ userData.memo }}</p>
        </div>
        <div v-if="editStatus">
            <button type="submit" class="btn btn-secondary" @click="edit()">등록하기</button>
        </div>
        <div v-else class="btns">
            <button type="submit" class="btn btn-secondary" @click="goToEdit()">수정하기</button>
            <button type="submit" class="btn btn-secondary" @click="del()">삭제하기</button>
        </div>
    </form>
</template>

<script>
import { editTodo,deleteTodo } from '../api/index';

export default ({
    props: ['todoInfo'],
    data() {
        return {
            editStatus:false,
            userData : {
            title: this.todoInfo.title,
            startHour: this.todoInfo.start_hour,
            startMinute: this.todoInfo.start_minute,
            endHour: this.todoInfo.end_hour,
            endMinute: this.todoInfo.end_minute,
            memo: this.todoInfo.memo
            },
        }
    },
    methods: {
        goToEdit(){
            this.editStatus = !this.editStatus;
        },
        async edit(){
            try{
                console.log('edit된 userData 전송 전:', this.userData);
                const res = await editTodo(this.todoInfo.post_id, this.userData);
                console.log(res);
               /* 백엔드 코드 받은 뒤 주석 해제
               if(res.data.resultData) {
                    console.log('일정 수정 완료');
                } */
            }catch(err) {
                console.log(err);
            }
        },
        async del(){
            try{
                const res = await deleteTodo(this.todoInfo.post_id);
                console.log(res);
                /* 백엔드 코드 받은 뒤 주석 해제
                if(res.data.resultData) {
                    console.log('일정 삭제 완료');
                }*/
            }catch(err){
                console.log(err);
            }
        }
    }
})
</script>

<style scoped>
.mb-3 {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
label {
    font-size: 14px;
    font-weight: 600;
}
.times {
    display: flex;
}
.times > .time {
    margin-right: 7px;
}
.times > input:last-child {
    margin-right: 0px;
}
.btn {
    font-size: 13px;
}
.btns {
    display: flex;
    justify-content: center;
}
.btns > .btn {
    margin: 10px;
}
</style>