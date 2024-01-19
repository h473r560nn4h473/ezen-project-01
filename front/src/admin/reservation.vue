<template>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
    crossorigin="anonymous"
  />
  <main>
    <div class="container">
      <table class="table caption-top">
        <caption>
          <div class="top_wrap">
            <h1>예약 관리</h1>
            <div class="search_wrap">
              <div class="search_bar">
                <button
                  class="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ setSearch }}
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                  <li>
                    <a class="dropdown-item" href="#" @click="setSearchList(0)"
                      >예약자명</a
                    >
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click="setSearchList(1)"
                      >담당의</a
                    >
                  </li>
                </ul>
                <input
                  v-model="keyword"
                  class="form-control me-2"
                  type="text"
                  placeholder="검색"
                  @keyup.enter="
                    getReservationList(sortCaseNum, this.setSearchNum)
                  "
                />
                <button
                  class="btn btn-secondary"
                  type="submit"
                  @click="getReservationList(sortCaseNum, this.setSearchNum)"
                >
                  <i class="fa-solid fa-search"></i>
                </button>
              </div>
              <div class="dropdown_wrap">
                <div class="dropdown">
                  <button
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {{ sortCase }}
                  </button>
                  <ul
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li>
                      <a class="dropdown-item" href="#" @click="sortList(0)"
                        >최근 예약번호 순</a
                      >
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click="sortList(1)"
                        >오래된 예약번호 순</a
                      >
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click="sortList(2)"
                        >최근 예약시간 순</a
                      >
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click="sortList(3)"
                        >오래된 예약시간 순</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </caption>
        <thead class="table-light">
          <tr>
            <th scope="col" style="display: none">번호</th>
            <th scope="col">예약번호</th>
            <th scope="col">예약자명</th>
            <th scope="col">제목</th>
            <th scope="col">예약시간</th>
            <th scope="col">담당의</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reservation, i) in pageReservationList" :key="i">
            <th scope="row" style="display: none">
              {{ pageNum * onePageCnt + i + 1 }}
            </th>
            <td>{{ reservation.RES_NO }}</td>
            <td>{{ reservation.USER_NM }}</td>
            <td>{{ reservation.RES_TITLE }}</td>
            <td>
              {{ formatDate(reservation.RES_DATE) }} {{ reservation.RES_TIME }}
            </td>
            <td>{{ reservation.DOC_NM }}</td>
            <td>
              <button
                class="btn btn-outline-danger"
                @click="confirmDeleteReservation(reservation)"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
      reservationList: [],
      sortCase: "최근 예약번호 순", //정렬은 조건 클릭시 바로 변경되므로 페이지에 처음 접속했을 때 단지 표시만 해주는 기능
      keyword: "",
      pageReservationList: [],
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
  mounted() {
    if (this.user.user_no == "") {
      this.$swal("관리자 외 접근제한 페이지입니다.");
      this.$router.push({ path: "/login" });
    } else {
      axios({
        url: "http://localhost:3000/auth/admin_check",
        method: "POST",
        data: {
          user_no: this.user.user_no,
        },
      })
        .then((res) => {
          if (res.data.message == "user") {
            this.$swal("관리자 외 접근제한 페이지입니다.");
            this.$router.push({ path: "/" });
          }
        })
        .catch(() => {
          this.$swal("접속 오류");
        });
    }
  },
  created() {
    this.getReservationList();
    this.setSearchList(0); //페이지에 접속/새로고침하여 검색조건을 변경하지 않고 검색할시 값이 없어 undefined 에러가 발생하므로 바로 검색을 누를 경우를 대비해 기본값 0(예약자명)을 준다
  },
  methods: {
    setPage(page) {
      this.pageReservationList = [];
      this.pageNum = page - 1;
      this.sliceList();
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt;
      this.pageReservationList = this.reservationList.slice(
        start,
        start + this.onePageCnt
      );
    },
    async getReservationList(sortCaseNum, setSearchNum) {
      let keyword = "none";

      if (this.keyword != "") {
        keyword = this.keyword;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/reservation/admin/reservationlist/${setSearchNum}/${sortCaseNum}/${keyword}`
        );
        this.reservationList = response.data;
        this.pageCnt = Math.ceil(this.reservationList.length / this.onePageCnt);
        this.setPage(1);
      } catch (error) {
        console.error(error);
      }
    },
    setSearchList(setSearchNum) {
      if (setSearchNum == 0) {
        this.setSearch = "예약자명";
      } else if (setSearchNum == 1) {
        this.setSearch = "담당의";
      }
      this.setSearchNum = setSearchNum;
    },
    sortList(sortNum) {
      if (sortNum == 0) {
        this.sortCase = "최근 예약번호 순";
      } else if (sortNum == 1) {
        this.sortCase = "오래된 예약번호 순";
      } else if (sortNum == 2) {
        this.sortCase = "최근 예약시간 순";
      } else if (sortNum == 3) {
        this.sortCase = "오래된 예약시간 순";
      }
      this.sortNum = sortNum;
      this.getReservationList(this.sortNum, this.setSearchNum).then(() => {
        this.$router.push({ path: "/admin/reservationList" });
      });
    },
    formatDate(dateTime) {
      const date = new Date(dateTime);
      const formattedDate = date.toLocaleDateString("ko-KR"); // 날짜만 표시
      return formattedDate;
    },
    confirmDeleteReservation(reservation) {
      this.$swal({
        title: `문의내역을 삭제하시겠습니까?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          this.deleteReservation(reservation);
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
    async deleteReservation(reservation) {
      console.log("삭제 버튼 클릭 - 문의내역:", reservation);
      try {
        const response = await axios.delete(
          `http://localhost:3000/reservation/admin/reservationlist/${reservation.RES_NO}`
        );
        console.log("진료기록 삭제 성공:", response.data);
        this.reservationList = this.reservationList.filter(
          (re) => re.RES_NO !== reservation.RES_NO
        );
      } catch (error) {
        console.error("진료기록 삭제 실패:", error);
      }
    },
  },
};
</script>
<style src="../assets/css/admin.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";
</style>
