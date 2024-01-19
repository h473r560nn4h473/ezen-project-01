<template>
  <main>
    <div class="board_format">
      <div class="title">
        <h1>예약 내역</h1>
      </div>
      <div class="merge">
        <table class="tbList">
          <thead>
            <tr>
              <th>No</th>
              <th>예약명</th>
              <th>담당의</th>
              <th>날짜</th>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in resList" :key="res.RES_TITLE">
              <td>{{ res.RES_NO }}</td>
              <td class="ellipsis">{{ res.RES_TITLE }}</td>
              <td>{{ res.DOC_NM }}</td>
              <td>{{ formatDateTime(res.RES_DATE) }}</td>
              <td>{{ res.RES_TIME }}</td>
            </tr> 
          </tbody>
        </table>
        <table class="tbDlt">
          <thead>
            <tr>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in resList" :key="res.RES_NO">
              <td class="board_btn_wrap"><button class="board_btn del_btn" @click="confirmDeleteContent(res.RES_NO)">취소</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      resList: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.getReservationList();
  },
  methods: {
    confirmDeleteContent(RES_NO) {
      this.$swal({
        title: `${RES_NO}번 예약을 취소하시겠습니까?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '예',
        cancelButtonText: '아니오',
      }).then(result => {
        if(result.value) {
          this.deleteContent(RES_NO);
          this.$swal({
            icon: 'success',
            title: '삭제되었습니다',
            showConfirmButton: false,
            timer: 1500
          })
          this.$router.go(0);
        }
      });
    },
    deleteContent(RES_NO) {
      axios({
        url: "http://localhost:3000/mypage/reservation/delete",
        method: "POST",
        data: {
          res_no: RES_NO
        },
      }).then(res => {
        this.content = res.data;
        console.log(res.data)
      }).catch(err => {
        alert(err);
      });
    },
    async getReservationList() {
      try {
        const response = await axios.get(`http://localhost:3000/mypage/getMyReservation/${this.user.user_no}`);
        this.resList = response.data;
        console.log(this.resList);
        this.resList.sort(function (a, b) {
          return b.RES_NO - a.RES_NO;
        });
      } catch (error) {
        console.error(error);
      }
    },
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDateTime = date.toLocaleDateString("ko-KR", options);
      return formattedDateTime;
    },
    
  }
}
</script>

<style src="../assets/css/board.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.merge {
  display: flex;
  justify-content: center;
  align-items: top;
}

.tbList {
  z-index: 100;
  border-radius: 12px 0 0 12px;
}

.tbList thead th:last-child {
  border-radius: 0;
}

.tbList tbody tr {
  cursor: initial;
}

.tbDlt {
  width: 80px;
  z-index: 99;
  border-radius: 0 12px 12px 0;
}

.tbDlt tbody tr {
  cursor: initial;
}

.tbDlt tbody tr:hover {
  box-shadow: none;
  border-radius: inherit;
  background-color: inherit;
}

.tbDlt td {
  border-radius: 0;
}

.tbDlt td:last-child {
  border-radius: 0 0 12px 0;
}

.tbDlt .del_btn {
  border: 1px solid var(--color-red);
  color: var(--color-red);
}

.tbDlt .del_btn:hover {
  background-color: var(--color-red);
  color: var(--color-white);
}
</style>