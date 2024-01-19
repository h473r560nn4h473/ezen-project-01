<template>
  <main>
    <div class="board_format">
      <div class="title">
        <h1>문의내역</h1>
      </div>
      <div class="merge">
        <table class="tbList">
          <thead>
            <tr>
              <th>No</th>
              <th>회원명</th>
              <th>글 제목</th>
              <th>작성일</th>
              <th>담당의</th>
              <th>답변 상태</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(qna, i) in pageQnaList"
              :key="i"
              @click="movetodqna(qna.QNA_NO)"
            >
              <td>{{ qna.QNA_NO }}</td>
              <td>{{ qna.USER_NM }}</td>
              <td class="ellipsis">{{ qna.QNA_TITLE }}</td>
              <td>{{ formatDateTime(qna.QNA_DATE) }}</td>
              <td>{{ qna.DOC_NM }}</td>
              <td>{{ getQnaState(qna) }}</td>
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
            <tr v-for="qna in pageQnaList" :key="qna.QNA_NO">
              <td class="board_btn_wrap">
                <button
                  class="board_btn del_btn"
                  @click="confirmDeleteQna(qna.QNA_NO)"
                >
                  삭제
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
      qnaList: [],
      sortQCase: "최근 순",
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
  mounted() {},
  created() {
    this.getQnaList();
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
      console.log(this.pageQnaList);
    },
    async getQnaList() {
      try {
        const response = await axios.get(
          `http://localhost:3000/mypage/docpage/docqna/${this.user.user_id}`
        );
        this.qnaList = response.data;
        this.pageCnt = Math.ceil(this.qnaList.length / this.onePageCnt);
        this.qnaList.sort(function (a, b) {
          return b.QNA_NO - a.QNA_NO;
        });
        this.setPage(1);
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
    getQnaState(qna) {
      if (qna.QNA_ANSWER !== null && qna.qna_state === 1) {
        return "답변완료";
      } else {
        return " ";
      }
    },
    confirmDeleteQna(qna) {
      this.$swal({
        title: `문의내역을 삭제하시겠습니까?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.value) {
          this.deleteQna(qna);
          this.$swal({
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
          `http://localhost:3000/mypage/docpage/docqna/${qna}`
        );
        console.log("진료기록 삭제 성공:", response.data);
        this.qnaList = this.qnaList.filter((q) => q.QNA_NO !== qna.QNA_NO);
      } catch (error) {
        console.error("진료기록 삭제 실패:", error);
      }
    },
    movetodqna(QNA_NO) {
      window.location.href =
        window.location.pathname + "/qnadetail?qna_no=" + QNA_NO;
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
