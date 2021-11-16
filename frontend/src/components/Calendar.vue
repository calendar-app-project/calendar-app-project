<template>
    <div class="main">
        <h4>{{ currentYear +'년 '+ `${currentMonth+1}` + '월' }}</h4>
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
                        <td scope="row" v-for="(date, SecondIdx) in weeks" :key="SecondIdx"
                        :class="{'today': isToday() && date === this.date,
                        'prev-or-next-month': FirstIdx===0 && SecondIdx <= this.lastMonthLastDay && this.lastMonthLastDay!==6 ||
                        FirstIdx === dates.length-1 && SecondIdx >= this.nextMonthFirstDay && this.nextMonthFirstDay!==0 }">
                        <div>{{ date }}</div>
                        <div></div></td>
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


export default ({
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
            nextMonthFirstDay:0
        }
    },
    methods: {
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
                if(this.currentMonth+1 === 13){
                    this.currentMonth = 0;
                    this.currentYear++;
                }
            }
            if(param === -1){
                this.currentMonth--;
                if(this.currentMonth === 0){
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
           
            return this.dates;
        },
    },
})
</script>

<style lang="scss" scoped>
@import '../scss/main.scss';

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