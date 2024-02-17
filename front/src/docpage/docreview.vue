<template>
  <main>
    <div class="board_format">
      <div class="title">
        <h1>진료후기 내역</h1>
      </div>
      <div class="merge">
        <table class="tbList">
          <thead>
            <tr>
              <th>No</th>
              <th>동물등록번호</th>
              <th>담당의</th>
              <th>진료명</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(review, i) in pageReviewList"
              :key="i"
              @click="movetodreview(review.rvw_no)"
            >
              <td>{{ review.rvw_no }}</td>
              <td>{{ review.PET_NO }}</td>
              <td>{{ review.DOC_NM }}</td>
              <td class="ellipsis">{{ review.RVW_TITLE }}</td>
              <td>{{ formatDateTime(review.RVW_DATE) }}</td>
              <td>{{ review.RVW_COUNT }}</td>
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
            <tr v-for="review in pageReviewList" :key="review.rvw_no">
              <td class="board_btn_wrap">
                <button
                  class="board_btn del_btn"
                  @click="confirmDeleteReview(review)"
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
        <div class="btn_area">
            <button class="btn_small" @click="DReviewWrite">작성</button>
          </div>
      </nav>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      reviewList: [],
      sortRCase: "최근 순",
      keyword: "",
      pageReviewList: [], // 한 페이지에 보여줄 굿즈 리스트를 잘라 담을 새 리스트
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
    this.getReviewList();
  },
  methods: {
    setPage(page) {
      this.pageReviewList = [];
      this.pageNum = page - 1;
      this.sliceList();
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt;
      this.pageReviewList = this.reviewList.slice(
        start,
        start + this.onePageCnt
      );
      console.log(this.pageReviewList);
    },
    async getReviewList() {
      try {
        const response = await axios.get(
          `http://localhost:3000/mypage/docpage/docreview/${this.user.user_id}`
        );
        this.reviewList = response.data;
        this.pageCnt = Math.ceil(this.reviewList.length / this.onePageCnt);
        this.reviewList.sort(function (a, b) {
          return b.rvw_no - a.rvw_no;
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
    confirmDeleteReview(review) {
      this.$swal({
        title: `진료기록을 삭제하시겠습니까?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.value) {
          this.deleteReview(review);
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
    async deleteReview(review) {
      console.log("삭제 버튼 클릭 - 진료기록:", review);
      try {
        const response = await axios.delete(
          `http://localhost:3000/mypage/docpage/docreview/${review.rvw_no}`
        );
        console.log("진료기록 삭제 성공:", response.data);
        this.reviewList = this.reviewList.filter(
          (r) => r.RVW_NO !== review.RVW_NO
        );
      } catch (error) {
        console.error("진료기록 삭제 실패:", error);
      }
    },
    DReviewWrite() {
      //console.log("의사진료기록페이지")
      this.$router.push("/docpage/docreview/write");
    },
    movetodreview(RVW_NO) {
      window.location.href =
        window.location.pathname + "/reviewdetail?rvw_no=" + RVW_NO;
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
