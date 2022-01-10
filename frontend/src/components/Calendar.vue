<template>
    <div class="main">
        <ModalView v-if="modalStatus" @close-modal="modalStatus=false">
            <template v-slot:body>
                <AddToDoContent/>
            </template>
        </ModalView>
        <div class="moveMth" @click="getDates(-1)">
            <font-awesome-icon type="button" icon="chevron-left" size="lg"/>
        </div>
        <div class="calendar">
            <div class="title">
            <p id="month">{{ matchCurrentMonth }}</p>
            <p id="year">{{ currentYear }}</p>
            </div>
            <table class="table table-responsive">
                <thead>
                    <tr>
                        <th scope="col" v-for="day in days" :key="day">{{ day }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(weeks, FirstIdx) in dates" :key="FirstIdx">
                        <td scope="row" v-for="(date, SecondIdx) in weeks" :key="SecondIdx"
                            :class="{'today': isToday(date, dates, FirstIdx, SecondIdx),
                                     'prev-or-next-month': isPrevOrNextMth(dates, FirstIdx, SecondIdx)}"
                            class="date"
                            @click="showToDoModal(date)">
                            <div>{{ date }}</div>
                            <div v-for="(todo,idx) in getListOfTodo(date)" :key="idx" v-show="idx<=2 && !isPrevOrNextMth(dates,FirstIdx,SecondIdx)">
                                 <span class="badge rounded-pill" :class="{ 'blinking': searchData.postId===todo.post_id }">
                                        <div class="badge-text">{{ todo.title }}</div>
                                 </span>
                            </div>
                            <span v-show="getListOfTodo(date).length>3 && !isPrevOrNextMth(dates,FirstIdx,SecondIdx)" class="badge more-todo rounded-pill text-white">
                                     +{{ getListOfTodo(date).length-3 }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="moveMth" @click="getDates(1)">
            <font-awesome-icon type="button" icon="chevron-right" size="lg"/>
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
                'SUN',
                'MON',
                'TUE',
                'WED',
                'THU',
                'FRI',
                'SAT'
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
            modalStatus:false
        }
    },
    watch: {
        clickedDate(){
            if(this.modalStatus===false){
                this.deleteClickedDate();
            }
        }
    },
    computed: {
        ...mapState("todo", ['todos','modalStatus','clickedDate','searchData']),
        matchCurrentMonth(){
            const Month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return Month[this.currentMonth];
        }
    },
    methods: {
        ...mapMutations("todo", ["toggleModal", "setDate","setClickedDate", "deleteTodosPerMth",'resetSearchData','deleteClickedDate']),
        getFirstAndLastDate(month, year){
            const lastMonthLastDate = new Date(year, month, 0).getDate();
            const lastMonthLastDay = new Date(year, month, 0).getDay();
            const thisMonthLastDate = new Date(year, month+1, 0).getDate();
            const nextMonthFirstDay = new Date(year,month+1).getDay();
            return [this.lastMonthLastDate=lastMonthLastDate, this.lastMonthLastDay=lastMonthLastDay, 
            this.thisMonthLastDate=thisMonthLastDate, this.nextMonthFirstDay=nextMonthFirstDay];
        },
        isToday(date, dates, FirstIdx, SecondIdx){
            if(!(this.isPrevOrNextMth(dates, FirstIdx, SecondIdx))
                && date === this.date
                && this.currentMonth === this.month
                && this.currentYear === this.year)
                {
                    return true;
                }else{
                    return false;
            }
        },
        isPrevOrNextMth(dates, FirstIdx, SecondIdx){
            if((FirstIdx===0 && SecondIdx <= this.lastMonthLastDay && (this.lastMonthLastDay!==6))
                || ((FirstIdx === dates.length-1 && SecondIdx >= this.nextMonthFirstDay) && (this.nextMonthFirstDay!==0))) 
                {
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

            if(this.searchData.postId!==0){
                this.currentYear = this.searchData.year;
                this.currentMonth = this.searchData.month-1;
            }
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
                this.setDate({
                        year: this.currentYear,
                        month: this.currentMonth + 1
                });
                //todo 요청
                this.deleteTodosPerMth();
                this.getSchedule();
                
                if(this.searchData.postId!==0){
                    setTimeout(() =>
                        this.resetSearchData(), 3000);
                }
            }
            return this.dates;
        },
        getSchedule(){
            this.$store.dispatch('todo/getSchedule');
        },
        showToDoModal(date){
            if(this.$store.state.user.userId){
                this.setClickedDate(date);
                this.toggleModal();
            }
        },
        getListOfTodo(date) {
            let list =[];
            list = this.todos.filter(todo => todo.date === date);
            return list;
        }
    },
})
</script>

<style lang="scss" scoped>
@import '../scss/main.scss';

.main {
    display: flex;
    width: 100%;
    margin-top: 70px;
    text-align: center;
    align-items: center;
    justify-content:center;
    @media (max-width: 550px){
       width: 500px;
   }
}
.calendar {
    display: flex;
    flex-direction: column;
    flex-basis: 60%;
}
.title{
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
    color:$primary;
    $calendar-title-font-size: 55px;
    
    #year {
        margin-left: 10px;
        font-size:$calendar-title-font-size;
        margin-bottom: 0;
    }
    #month {
        font-size:$calendar-title-font-size * 0.7;
        margin-bottom: 0;
    }
    @media (min-width:800px) and (max-width:1200px){
        #year {
            font-size: $calendar-title-font-size * 0.85;
        }
        #month {
            font-size: $calendar-title-font-size * 0.65;
        }
        
    }
    @media (max-width:800px){
        #year {
            font-size: $calendar-title-font-size * 0.7;
        }
        #month {
            font-size: $calendar-title-font-size * 0.5;
        }
    }
    
}
.date {
    cursor: pointer;
}
.moveMth {
    color: $primary;
    opacity: .7;
    font-size: 20px;
    margin: 0 50px;
}
.moveMth:active {
    color: lightgrey;
}
.prev-or-next-month {
    opacity: 0.4;
    pointer-events: none;
}
.badge-text {
    overflow: hidden;
    text-overflow: ellipsis;
}
.today {
    color: #ff5e00f1;
    font-weight: 700;
}
thead {
    background-color: $primary;
    color:$table-head-font-color;
    th:first-child {
        border-radius: 20px 0 0 0;
    }
    th:last-child {
        border-radius: 0 20px 0 0;
    }
}
tbody {
    text-align: start;
    color: $font-color;
    td {
        position: relative;
        min-width: 9vw;
        max-width: 11vw;
        height: 140px;
    }
}
.more-todo {
    position: absolute;
    bottom: 3px;
    font-size: 11px;
    background-color: $secondary;
}
 .blinking{
    animation:blink .5s ease-in-out 2 alternate;
    background-color: rgba(68, 165, 101, 0.726);
 }
    @keyframes blink{
         0% {opacity:0;}
         100% {opacity:1;}
    }

    
</style>