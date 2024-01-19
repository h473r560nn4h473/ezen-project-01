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
            <h1>문의사항 관리</h1>
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
              </div>
              <input
                v-model="keyword"
                class="form-control me-2"
                type="text"
                placeholder="검색"
                @keyup.enter="getQnaList(sortCaseNum, this.setSearchNum)"
              />
              <button
                class="btn btn-secondary"
                type="submit"
                @click="getQnaList(sortCaseNum, this.setSearchNum)"
              >
                <i class="fa fa-search"></i>
              </button>
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
                        >최근 순</a
                      >
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click="sortList(1)"
                        >오래된 순</a
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </caption>
        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">회원번호</th>
            <th scope="col">회원명</th>
            <th scope="col">글 제목</th>
            <th scope="col">작성일</th>
            <th scope="col">담당의</th>
            <th scope="col">답변 상태</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(qna, i) in pageQnaList" :key="i">
            <th scope="row" style="display: none">
              {{ pageNum * onePageCnt + i + 1 }}
            </th>
            <td>{{ qna.USER_NO }}</td>
            <td>{{ qna.USER_NM }}</td>
            <td>{{ qna.QNA_TITLE }}</td>
            <td>{{ formatDateTime(qna.QNA_DATE) }}</td>
            <td>{{ qna.DOC_NM }}</td>
            <td>{{ getQnaState(qna) }}</td>
            <td>
              <button
                class="btn btn-outline-danger"
                @click="confirmDeleteQna(qna)"
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
      qnaList: [],
      sortCase: "최근 순",
      keyword: "",
      pageQnaList: [], // 한 페이지에 보여줄 굿즈 리스트를 잘라 담을 새 리스트
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
      // 일단은 로그인 상태 체크
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
    this.getQnaList();
    this.setSearchList(0);
  },
  methods: {
    setPage(page) {
      this.pageQnaList = [];
      this.pageNum = page - 1;
      this.sliceList();
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt;
      this.pageQnaList = this.qnaList.slice(start, start + this.onePageCnt);
    },
    async getQnaList(sortCaseNum, setSearchNum) {
      let keyword = "none";

      if (this.keyword != "") {
        keyword = this.keyword;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/qna/admin/qnalist/${setSearchNum}/${sortCaseNum}/${keyword}`
        );
        this.qnaList = response.data;
        this.pageCnt = Math.ceil(this.qnaList.length / this.onePageCnt);
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
        this.sortCase = "최근 순";
      } else if (sortNum == 1) {
        this.sortCase = "오래된 순";
      }
      this.sortNum = sortNum;
      this.getQnaList(sortNum).then(() => {
        this.$router.push({ path: "/admin/qnaList" });
      });
    },
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const formattedDateTime = date.toLocaleString("ko-KR");
      return formattedDateTime;
    },
    getQnaState(qna) {
      if (qna.QNA_ANSWER !== null && qna.qna_state === 1) {
        return "답변완료";
      } else {
        return "답변대기";
      }
    },
    confirmDeleteQna(qna) {
      this.$swal({
        title: `문의내역을 삭제하시겠습니까?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        reverseButtons: true,
      }).then((result) => {
        if (result.value) {
          this.deleteQna(qna);
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
    async deleteQna(qna) {
      console.log("삭제 버튼 클릭 - 문의내역:", qna);
      try {
        const response = await axios.delete(
          `http://localhost:3000/qna/admin/qnalist/${qna.QNA_NO}`
        );
        console.log("진료기록 삭제 성공:", response.data);
        this.qnaList = this.qnaList.filter((q) => q.QNA_NO !== qna.QNA_NO);
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
