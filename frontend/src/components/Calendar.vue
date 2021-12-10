<template>
    <div class="main">
        <h4>{{ currentYear +'년 '+ `${currentMonth+1}` + '월' }}</h4>
        <ModalView v-if="modalStatus">
            <template v-slot:body>
                <AddToDoContent/>
            </template>
        </ModalView>
        <div class="calendar">
            <div class="moveMth" @click="getDates(-1)">
                <font-awesome-icon type="button" icon="chevron-left" size="lg"/>
            </div>
            <table class="table table-bordered rounded">
                <thead class="table-secondary">
                    <tr>
                        <th scope="col" v-for="day in days" :key="day">{{ day }}</th>
                    </tr>
                </thead>
                <tbody class="table-primary">
                    <tr height="100" v-for="(weeks, FirstIdx) in dates" :key="FirstIdx">
                        <td width="120" height="120" scope="row" v-for="(date, SecondIdx) in weeks" :key="SecondIdx"
                            :class="{'today': isToday() && (date === this.date) && (SecondIdx > this.lastMonthLastDay) && (SecondIdx < this.nextMonthFirstDay),
                                 'prev-or-next-month': (FirstIdx===0 && SecondIdx <= this.lastMonthLastDay) && (this.lastMonthLastDay!==6) ||
                                                       (FirstIdx === dates.length-1 && SecondIdx >= this.nextMonthFirstDay) && (this.nextMonthFirstDay!==0) }"
                            @click="showToDoModal(date)">
                            <div>{{ date }}</div>
                            <div v-for="(todo,idx) in todos" :key="idx">
                                <span class="badge rounded-pill bg-light text-dark"
                                      v-if="todo.date === date && 
                                            !(FirstIdx === 0 && SecondIdx <= this.lastMonthLastDay) && 
                                            !(FirstIdx === dates.length-1 && SecondIdx >= this.nextMonthFirstDay)">
                                    {{ todo.title }}
                                </span>
                            </div> 
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="moveMth" @click="getDates(1)">
                <font-awesome-icon type="button" icon="chevron-right" size="lg"/>
            </div>
        </div>
    </div>
</template>

<script>
import AddToDoContent from './TodoList.vue';
import ModalView from './Modal.vue';
import { mapState, mapMutations } from 'vuex';

export default ({
    components: {
        ModalView,
        AddToDoContent
    },
    
    created() {
            this.today = new Date();
            this.year = this.today.getFullYear();
            this.month = this.today.getMonth();
            this.date = this.today.getDate();
            this.currentMonth = this.month;
            this.currentYear = this.year;
            this.getDates();
    },
    data() {
        return {
            days: [
                '일',
                '월',
                '화',
                '수',
                '목',
                '금',
                '토'
            ],
            today:0,
            dates: [],
            week:[],
            year:0,
            month:0,
            date:0,
            currentYear:0,
            currentMonth:0,
            currentDate:0,
            lastMonthLastDate:0,
            lastMonthLastDay:0,
            thisMonthLastDate:0,
            nextMonthFirstDay:0,
        }
    },
    computed: {
        ...mapState("todo", ['todos','modalStatus','clickedDate']),
    },
    methods: {
        ...mapMutations("todo", ["showModal", "updateDate","updateClickedDate", "deleteTodos"]),
        getFirstAndLastDate(month, year){
            const lastMonthLastDate = new Date(year, month, 0).getDate();
            const lastMonthLastDay = new Date(year, month, 0).getDay();
            const thisMonthLastDate = new Date(year, month+1, 0).getDate();
            const nextMonthFirstDay = new Date(year,month+1).getDay();
            return [this.lastMonthLastDate=lastMonthLastDate, this.lastMonthLastDay=lastMonthLastDay, 
            this.thisMonthLastDate=thisMonthLastDate, this.nextMonthFirstDay=nextMonthFirstDay];
        },
        isToday(){
            if(this.currentMonth === this.month && this.currentYear === this.year){
                return true;
            }else{
                return false;
            }
        },
        checkLength(){
            if(this.week.length === 7){
                this.dates.push(this.week);
                this.week =[];
            }
        },
        getPrevMonth(prevLastDate, prevLastDay){
            if(prevLastDay!==6){
                for(let date = prevLastDate-prevLastDay; date <= prevLastDate; date++){
                    this.week.push(date);
                    this.checkLength();
                }
            }
        },
        getThisMonth(thisMonthLastDate){
                for(let date = 1; date<=thisMonthLastDate; date++){
                    this.week.push(date);
                    this.checkLength();
                }
        },
        getNextMonth(nextMonthFirstDay){
            if(nextMonthFirstDay!==0){
                for(let date = 1 ; date <= 7-nextMonthFirstDay; date++){
                    this.week.push(date);
                    this.checkLength();
                }
           }
        },
        getDates(param=0){

            this.dates =[];
        
            if(param === 1){
                this.currentMonth++;
                if(this.currentMonth === 12){
                    this.currentMonth = 0;
                    this.currentYear++;
                }
            }
            if(param === -1){
                this.currentMonth--;
                if(this.currentMonth === -1){
                    this.currentMonth = 11;
                    this.currentYear--;
                }
            }

            const [lastMonthLastDate, lastMonthLastDay, thisMonthLastDate, nextMonthFirstDay] = 
            this.getFirstAndLastDate(this.currentMonth, this.currentYear);

            //지난 달
            this.getPrevMonth(lastMonthLastDate,lastMonthLastDay);
            //이번 달
            this.getThisMonth(thisMonthLastDate);
            //다음 달
            this.getNextMonth(nextMonthFirstDay);
            
            if(this.$store.state.user.userId){
                this.updateDate({
                        year: this.currentYear,
                        month: this.currentMonth + 1
                        });
                //todo 요청
                this.deleteTodos();
                this.getSchedule();
            }
            
            return this.dates;
        },
        getSchedule(){
            this.$store.dispatch('todo/getSchedule');
        },
        showToDoModal(date){
            if(this.$store.state.user.userId){
                this.updateClickedDate(date);
                this.showModal();
            }
        },
    },
})
</script>

<style lang="scss" scoped>/*
@import '../scss/main.scss';*/

.main {
    margin: 40px 0;
}
.calendar {
    display: flex;
    align-items: center;
}
.main > h4 {
    margin: 30px 0;
}
.table {
    border: 1px solid lightgray;    
}
.moveMth {
    color: gray;
    margin: 0 50px;
}
.moveMth:active {
    color: lightgrey;
}
.prev-or-next-month {
    color: grey;
    opacity: 0.4;
}
.today {
    color:mediumspringgreen;
    font-weight: 600;
}
</style>