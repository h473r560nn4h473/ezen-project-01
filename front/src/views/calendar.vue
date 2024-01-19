<template>
  <main class="content_wrap">
    <div class="title">
      <h1>진료예약하기</h1>
    </div>
    <div class="wrap">
      <div class="schedules">
        <div class="calendar">
          <div class="date">
            <a href="#" v-on:click="onClickPrev(currentMonth, $event)"><i class="fa-solid fa-caret-left"></i></a>
            <span class="year_month">
              <span>{{ currentYear }}년</span>
              <span>{{ currentMonth }}월</span>
            </span>
            <a href="#" v-on:click="onClickNext(currentMonth, $event)"><i class="fa-solid fa-caret-right"></i></a>
          </div>
          <table class="table">
            <thead>
              <tr>
                <td class="weekNames" v-for="(weekName, index) in weekNames" v-bind:key="index">
                  {{ weekName }}
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in currentCalendarMatrix" :key="index">
                <td v-for="(day, index2) in row" :key="index2" class="day">
                  <div v-if="isToday(currentYear, currentMonth, day)" class="today">
                    <span>{{ day }}</span>
                  </div>
                  <div v-else-if="pointDay(currentYear, currentMonth, day)" class="booked">
                    <span>{{ day }}</span>
                  </div>
                  <div v-else>
                    <span>{{ day }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="btn_wrap">
          <div class="annotation"><span class="circle"></span><span>&nbsp;: 예약됨</span></div>
          <button class="btn_small" @click="showModal = true">&#43;&nbsp;&nbsp;예약하기</button>
        </div>
        <div class="bg" @click="showModal = false" v-show="showModal"></div>
        <div class="schedules_modal" v-show="showModal">
          <div class="modal_content">
            <h2><span class="close" @click="showModal = false">&times;</span> 예약 등록</h2>
            <div class="input_row">
              <div><span class="bar"></span>제목 :</div>
              <input v-model="reservation.res_nm" class="calendar_input" placeholder="10자 이내" />
            </div>
            <div class="input_row">
              <div><span class="bar"></span>내용 :</div>
              <textarea v-model="reservation.res_cont" class="calendar_input" placeholder="100자 이내"></textarea>
            </div>
            <div class="input_row">
              <div><span class="bar"></span>펫 동물등록번호 :</div>
              <input class="pet_no" v-model="petno.pet_no" disabled />
            </div>
            <div class="input_row">
              <div><span class="bar"></span>예약날짜 :</div>
              <input class="calendar_select" type="date" data-placeholder="날짜 선택" required aria-required="true" v-model="reservation.res_sdd" />
            </div>
            <div class="input_row">
              <div><span class="bar"></span>예약시간 :</div>
              <select id="mySelect" v-model="reservation.res_stm">
                <option value="" hidden selected>예약시간 선택</option>
                <option v-for="(time, index) in times" :key="index" :value="time" :disabled=" isTimeDisabled(time)">
                {{ time }}
                </option>
              </select>
            </div>
            <div class="btn_wrap">
              <button type="submit" @click="createCalendarCheck()" class="btn_small">예약하기</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import axios from 'axios';
export default {	
  name:'',
  components:{},
  data() {
    return {
      petno: {},
      //doc_nm: this.$route.query.doc_nm,
      doc_id: {},
      showModal: false,
      showModal2: false,
      calendarList: [],
      reservation: {
        res_nm: '',
        res_cont: '',
        res_petno: '',
        res_sdd: '',
        res_stm: '',
      },
      //isOptionDisabled: false,
      times: ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "12:00 - 13:00", "13:00 - 14:00",
        "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00",],
      // weekNames: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      weekNames: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      // weekNames: ["월", "화", "수", "목", "금", "토", "일"],
      rootYear: 1904,
      rootDayOfWeekIndex: 4, // 2000년 1월 1일은 토요일
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,
      currentDay: new Date().getDate(),
      currentMonthStartWeekIndex: null,
      currentCalendarMatrix: [],
      endOfDay: null,
      memoDatas: [],
      Rdate: [],
      Rtime: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.init();
    if (this.user.user_no === '') {
      this.$swal('로그인해주세요');
      this.$router.push({ path: '/login' });
    } else {
      this.getCalendar();
      this.getDocId();
      this.getPetNo();
    }
  },
  methods: {
    isTimeDisabled(time) {
      for(let i = 0; i<this.calendarList.length; i++) {
        if( this.reservation.res_sdd === this.Rdate[i] && time === this.Rtime[i]) {
          return true;
        } 
      }
      return false;
    },
    formatDate(dateTimeString) {
      const date = new Date(dateTimeString);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1을 해주고 두 자리로 표시
      const day = String(date.getDate()).padStart(2, '0'); // 일을 두 자리로 표시

      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
    init: function () {
      this.currentMonthStartWeekIndex = this.getStartWeek(this.currentYear, this.currentMonth);
      this.endOfDay = this.getEndOfDay(this.currentYear, this.currentMonth);
      this.initCalendar();
    },
    initCalendar: function () {
      this.currentCalendarMatrix = [];
      let day = 1;
      for (let i = 0; i < 6; i++) {
        let calendarRow = [];
        for (let j = 0; j < 7; j++) {
          if (i == 0 && j < this.currentMonthStartWeekIndex) {
            calendarRow.push("");
          }
          else if (day <= this.endOfDay) {
            calendarRow.push(day);
            day++;
          }
          else {
            calendarRow.push("");
          }
        }
        this.currentCalendarMatrix.push(calendarRow);
      }
    },
    getEndOfDay: function (year, month) {
      switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31;
        // break;
        case 4:
        case 6:
        case 9:
        case 11:
          return 30;
        // break;
        case 2:
          if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
            return 29;
          }
          else {
            return 28;
          }
        // break;
        default:
          //console.log("unknown month " + month);
          return 0;
        // break;
      }
    },
    getStartWeek: function (targetYear, targetMonth) {
      let year = this.rootYear;
      let month = 1;
      let sumOfDay = this.rootDayOfWeekIndex;
      // eslint-disable-next-line
      while (true) {
        if (targetYear > year) {
          for (let i = 0; i < 12; i++) {
            sumOfDay += this.getEndOfDay(year, month + i);
          }
          year++;
        }
        else if (targetYear == year) {
          if (targetMonth > month) {
            sumOfDay += this.getEndOfDay(year, month);
            month++;
          }
          else if (targetMonth == month) {
            return (sumOfDay) % 7;
          }
        }
      }
    },
    onClickPrev: function (month, event) {
      event.preventDefault();
      month--;
      if (month <= 0) {
        this.currentMonth = 12;
        this.currentYear -= 1;
      }
      else {
        this.currentMonth -= 1;
      }
      this.init();
    },
    onClickNext: function (month, event) {
      event.preventDefault();
      month++;
      if (month > 12) {
        this.currentMonth = 1;
        this.currentYear += 1;
      }
      else {
        this.currentMonth += 1;
      }
      this.init();
    },
    isToday: function (year, month, day) {
      let date = new Date();
      return year == date.getFullYear() && month == date.getMonth() + 1 && day == date.getDate();
    },
    async getPetNo() {
      try {
        const response = await axios.get(`http://localhost:3000/auth/getPetNo/${this.user.user_no}`);
        this.petno = response.data[0];
        //console.log(this.petno);
      } catch (error) {
        console.error(error);
      }
    },
    async getCalendar() {
      try {
        const doc_nm = this.$route.query.doc_nm;
        const response = await axios.get(`http://localhost:3000/reservation/reservation_list/${doc_nm}`);
        this.calendarList = response.data;
        for( let i =0; i<this.calendarList.length; i++) {
          this.Rdate[i] = this.formatDate(this.calendarList[i].RES_DATE);
          this.Rtime[i] = this.calendarList[i].RES_TIME;
        }
        console.log(this.Rtime);
        console.log(this.Rdate)
      } catch (error) {
        console.error(error);
      }
    },
    async getDocId() {
      try {
        const doc_nm = this.$route.query.doc_nm;
        const response = await axios.get(`http://localhost:3000/auth/getDocId/${doc_nm}`);
        this.doc_id = response.data[0];
        //console.log(this.doc_id);
      } catch (error) {
        console.error(error)
      }
    },
      pointDay(year, month, day) {
      const targetDate = new Date(year, month - 1, day); // year와 month는 1씩 빼줘서 인덱스에 맞춤
      for (const cal of this.calendarList) {
        const calDate = new Date(cal.RES_DATE);
        if (this.isSameDay(targetDate, calDate)) {
          return true;
        }
      }
      return false
    },
    isSameDay(date1, date2) {
      return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
      )
    },
    createCalendarCheck() {
      if (!this.reservation.res_nm || !this.reservation.res_cont || !this.reservation.res_sdd || !this.reservation.res_stm) {
        this.$alert("입력 항목을 모두 작성해주세요");
      } else {
        this.createCalendar();
      }
    },
    async createCalendar() {
      try {
        const result = await this.$swal.fire({
          html: `<div style="font-weight: 700; font-size:22px; margin-top:50px">예약하시겠습니까?</div>`,
          confirmButtonText: `<div>예약</div>`,
          confirmButtonColor: `var(--color-orange)`,
          showCancelButton: true,
          cancelButtonText: `<div>취소</div>`
        })
        if (result.isConfirmed) {
          //const doc_nm = this.$route.query.doc_nm;
          await axios({
            url: 'http://localhost:3000/reservation/reservation_create',
            method: 'POST',
            data: {
              res_nm: this.reservation.res_nm,
              res_sdd: this.reservation.res_sdd,
              res_stm: this.reservation.res_stm,
              res_cont: this.reservation.res_cont,
              res_petno: this.petno.pet_no,
              doc_id: this.doc_id.DOC_ID,
            }
          })
            .then((response) => {
              if (response.data.message === 'success') {
                this.$swal({
                  icon: 'success',
                  title: '등록이 완료되었습니다.',
                  showConfirmButton: false,
                  timer: 1500
                });
                location.href = `http://localhost:8080/mypage/myreservation`
              } else if (response.data.message === 'already_exist_reservation') {
                this.$alert('이미 예약이 있습니다.');
                // history.go(-1);
              } else {
                this.$alert('등록 실패');
              }
            })
            .catch((error) => {
              console.error('등록 에러', error);
              this.$swal({
                icon: 'error',
                title: '등록 중 오류가 발생되었습니다!',
                showConfirmButton: true,
              })
            });
        } else {
          this.$swal({
            icon: 'error',
            title: '취소되었습니다',
            showConfirmButton: false,
            timer: 1500
          })
        }
      } catch (error) {
        console.error('Promise 처리 중 에러', error);
      }
    }
  }
}
</script>
<style src="../assets/css/profileInput.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.schedules {
  -webkit-user-select: none;
  -moz-user-select: -moz-none;
  -ms-user-select: none;
  user-select: none;
}

.calendar {
  margin-bottom: 50px;
}

.date {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.date .fa-solid {
  padding: 5px;
  font-size: 20px;
  color: var(--color-sub-dark);
}

.date .fa-caret-left {
  margin-right: 5px;
}

.date .fa-caret-right {
  margin-left: 5px;
}

.year_month {
  font-size: 20px;
  width: 114px;
  display: flex;
  justify-content: space-between;
}

.weekNames {
  text-align: center;
  font-weight: bold;
  color: var(--color-sub-dark);
  padding: 20px 0;
}

.day>div {
  border-radius: 20px;
  width: 40px;
  height: 40px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.today {
  color: var(--color-white);
  background-color: var(--color-sub-dark);
}

.booked {
  color: var(--color-dark);
  border: 1px solid var(--color-orange);
}

.btn_wrap {
  display: flex;
  justify-content: right;
  align-items: center;
}

.annotation {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 1px solid var(--color-orange);
}

.modal_content h2 {
  font-size: 18px;
  display: flex;
  justify-content: left;
  align-items: center;
  margin-bottom: 20px;
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 800;
}

.schedules_modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}

.modal_content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  background-color: #F9F9F9;
  padding: 30px;
  border-radius: 16px;
  border: 2px solid #E1E7F0;
}

.close {
  font-size: var(--font-medium);
  cursor: pointer;
  padding: 5px;
  margin-right: 5px;
}

.input_row {
  margin-bottom: 30px;
}

.calendar_input {
  width: 300px;
}

.pet_no {
  width: 300px !important;
  border: none !important;
  text-align: right;
  font-size: 20px !important;
  font-weight: 500;
  background-color: transparent;
}

.calendar_select {
  width: 118px;
}

select option:disabled {
  color: gray; /* 텍스트 색상을 회색으로 변경 */
  background-color: #f1f1f1; /* 배경 색상을 밝은 회색으로 변경 */
}
</style>