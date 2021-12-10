<template>
    <form class="todo-form">
        <div class="mb-3">
            <label for="title" class="form-label">일정</label>
            <input type="text" class="form-control" id="title" v-model="title"/>
        </div>
        <div class="mb-3">
            <label for="startTime" class="form-label">시작 시간</label>
            <div class="times">
                <input type="text" class="form-control time" id="startHour" placeholder="hour" v-model="startHour"/>                    
                <input type="text" class="form-control time" id="startMinute" placeholder="minute" v-model="startMinute"/>
            </div>
        </div>
        <div class="mb-3">
            <label for="endTime" class="form-label">종료 시간</label>
            <div class="times">
                <input type="text" class="form-control time" id="endHour" placeholder="hour" v-model="endHour"/>
                <input type="text" class="form-control time" id="endMinute" placeholder="minute" v-model="endMinute"/>
            </div>
        </div>
        <div class="mb-3">
            <label for="memo" class="form-label">메모</label>
            <textarea class="form-control" id="memo" rows="3" v-model="memo"></textarea>
        </div>
        <button type="submit" class="btn btn-secondary" @click="add()">등록하기</button>
    </form>
</template>

<script>
import { mapState } from 'vuex';
import { addTodo } from '../api/index';

export default ({
    data() {
        return {
            title: '',
            startHour: null,
            startMinute: null,
            endHour: null,
            endMinute: null,
            memo:'',
        }
    },
    computed: {
        ...mapState("todo", ["date","clickedDate"]),
    },
    methods: {
        convertTime(time) {
            time = Number(time);
            if(time % 10 === time){
                return String(time).padStart(2,'0');
            }
            if(time === null){
                return String(time).padStart(2,'0');
            }
            else{
                return String(time);
            }
        },
        async add() {
            try{
                const id = this.$store.state.user.userId;
                const userData = {
                    title: this.title,
                    year: this.date.year,
                    month: this.date.month,
                    clickedDate: this.clickedDate,
                    start_hour: this.convertTime(this.startHour),
                    start_minute: this.convertTime(this.startMinute),
                    end_hour: this.convertTime(this.endHour),
                    end_minute: this.convertTime(this.endMinute),
                    memo: this.memo
                }
                console.log('userData:', userData);
                const res = await addTodo(id, userData);
                console.log(res);
            }catch(err){
                console.log(err);
            }   
        },
    }
})

</script>

<style scoped>
.mb-3 {
    display: flex;
    flex-direction:column;
    align-items: flex-start;
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
label {
    font-size: 14px;
    font-weight: 600;
}
.btn {
    font-size: 13px;
}

</style>