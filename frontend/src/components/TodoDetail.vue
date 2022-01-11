<template>
    <form class="todoDetail">
        <div class="mb-3">
            <label for="title" class="form-label">일정</label>
            <input v-if="editStatus" type="text" class="form-control" id="title" v-model="title"/>
            <p v-else type="text" id="title">{{ title }}</p>
        </div>
        <div class="mb-3">
            <label for="startTime" class="form-label">시작 시간</label>
            <div class="times" v-if="editStatus">
                <input type="text" class="form-control time" id="startHour" v-model="startHour"/>
                <input type="text" class="form-control time" id="startMinute" v-model="startMinute"/>
            </div>
            <div class="times" v-else>
                <p type="text" id="startHour">{{ startHour+':' }}</p>
                <p type="text" id="startMinute">{{ startMinute }}</p>
            </div>
        </div>
        <div class="mb-3">
            <label for="endTime" class="form-label">종료 시간</label>
            <div class="times" v-if="editStatus">
                <input type="text" class="form-control time" id="endHour" v-model="endHour"/>
                <input type="text" class="form-control time" id="endMinute" v-model="endMinute"/>
            </div>
            <div class="times" v-else>
                <p type="text" id="endHour">{{ endHour+':' }}</p>
                <p type="text" id="endMinute">{{ endMinute }}</p>
            </div>
        </div>
        <div class="mb-3">
            <label for="memo" class="form-label">메모</label>
            <textarea v-if="editStatus" type="text" class="form-control" id="memo" rows="3" v-model="memo"/>
            <p type="text" v-else id="memo">{{ memo }}</p>
        </div>
        <div v-if="editStatus">
            <button type="submit" class="btn btn-secondary" :class="{'disabled':!title}" @click.prevent="edit()">등록하기</button>
        </div>
        <div v-else class="btns">
            <button type="submit" class="btn btn-secondary" @click="goToEdit()">수정하기</button>
            <button type="submit" class="btn btn-secondary" @click.prevent="del()">삭제하기</button>
        </div>
    </form>
</template>

<script>
export default ({
    props: ['todoInfo'],
    data() {
        return {
            editStatus:false,
            title: this.todoInfo.title,
            startHour: this.todoInfo.start_hour,
            startMinute: this.todoInfo.start_minute,
            endHour: this.todoInfo.end_hour,
            endMinute: this.todoInfo.end_minute,
            memo: this.todoInfo.memo
        }
    },
    methods: {
        goToEdit(){
            this.editStatus = !this.editStatus;
        },
        convertTime(time) {
            time = Number(time);
            if(time % 10 === time){
                return String(time).padStart(2,'0');
            }
            if(time){
                return String(time).padStart(2,'0');
            }
            else{
                return String(time);
            }
        },
        async edit(){
            try{
                const userData = {
                    title: this.title,
                    startHour: this.convertTime(this.startHour),
                    startMinute: this.convertTime(this.startMinute),
                    endHour: this.convertTime(this.endHour),
                    endMinute: this.convertTime(this.endMinute),
                    memo: this.memo
                }
                const editData = {
                    post_id: this.todoInfo.post_id,
                    date: this.todoInfo.date,
                    ...userData
                }
                await this.$store.dispatch('todo/editSchedule', editData);
                this.$emit('close-modal');
            }catch(err) {
                console.log(err);
            }
        },
        async del(){
            try{
                await this.$store.dispatch('todo/deleteSchedule', this.todoInfo.post_id);
                this.$emit('close-modal');
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