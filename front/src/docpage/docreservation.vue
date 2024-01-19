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
              <th>예약번호</th>
              <th>예약자명</th>
              <th>제목</th>
              <th>내용</th>
              <th>예약시간</th>
              <th>담당의</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(docreservation, i) in pagedocReservationList" :key="i" @click="movetocontent(docreservation.RES_NO)">
              <td>{{ docreservation.RES_NO }}</td>
              <td>{{ docreservation.USER_NM }}</td>
              <td class="ellipsis">{{ docreservation.RES_TITLE }}</td>
              <td class="ellipsis">{{ docreservation.RES_CONTENT }}</td>
              <td>
                {{ formatDate(docreservation.RES_DATE) }} <br />
                {{ docreservation.RES_TIME }}
              </td>
              <td>{{ docreservation.DOC_NM }}</td>
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
            <tr
              v-for="docreservation in pagedocReservationList"
              :key="docreservation.RES_NO"
            >
              <td class="board_btn_wrap">
                <button
                  class="board_btn del_btn"
                  @click="confirmDeletedocReservation(docreservation)"
                >
                  취소
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <ul
            v-for="i in pageCnt"
            :key="i"
            class="pagination justify-content-center"
          >
            <a href="#top" style="text-decoration: none">
              <li
                v-if="i != pageNum + 1"
                class="page-item page-link"
                @click="setPage(i)"
              >
                {{ i }}
              </li>
              <li v-else class="page-item page-link active" @click="setPage(i)">
                {{ i }}
              </li>
            </a>
          </ul>
        </ul>
      </nav>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      docreservationList: [],
      sortCase: "최근 예약번호 순",
      keyword: "",
      pagedocReservationList: [],
      pageNum: 0,
      pageCnt: 0,
      onePageCnt: 10,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {},
  created() {
    this.getdocReservationList();
  },
  methods: {
    setPage(page) {
      this.pagedocReservationList = [];
      this.pageNum = page - 1;
      this.sliceList();
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt;
      this.pagedocReservationList = this.docreservationList.slice(
        start,
        start + this.onePageCnt
      );
    },
    async getdocReservationList() {
      try {
        const response = await axios.get(
          `http://localhost:3000/mypage/docpage/docreservation/${this.user.user_id}`
        );
        this.docreservationList = response.data;
        this.pageCnt = Math.ceil(
          this.docreservationList.length / this.onePageCnt
        );
        this.docreservationList.sort(function (a, b) {
          return b.RES_NO - a.RES_NO;
        });
        console.log(this.docreservationList);
        this.setPage(1);
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(dateTime) {
      const date = new Date(dateTime);
      const formattedDate = date.toLocaleDateString("ko-KR"); // 날짜만 표시
      return formattedDate;
    },
    confirmDeletedocReservation(docreservation) {
      this.$swal({
        title: `예약내역을 삭제하시겠습니까?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.value) {
          this.deletedocReservation(docreservation);
          this.$swal({
            position: "top",
            icon: "success",
            title: "삭제되었습니다",
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            this.$router.go(this.$router.currentRoute);
          });
        }
      });
    },
    async deletedocReservation(docreservation) {
      console.log("삭제 버튼 클릭 - 예약내역:", docreservation);
      try {
        const response = await axios.delete(
          `http://localhost:3000/mypage/docpage/docreservation/${docreservation.RES_NO}`
        );
        console.log("예약내역 삭제 성공:", response.data);
        this.docreservationList = this.docreservationList.filter(
          (re) => re.RES_NO !== docreservation.RES_NO
        );
      } catch (error) {
        console.error("예약내역 삭제 실패:", error);
      }
    },
    movetocontent(RES_NO) {
            window.location.href = window.location.pathname + '/resdetail?RES_NO=' + RES_NO
        },
  },
};
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

.tbList .res_title {
  max-width: 141px;
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
