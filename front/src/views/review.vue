<template>
  <main class="content_wrap">
    <div class="title">
      <h1>진료후기 게시판</h1>
    </div>
    <div class="review_wrap">
      <div class="srch_sel_wrap">
        <div class="search_bar">
          <input v-model="keyword" class="search_input" type="text" placeholder="담당의 검색" 
                  @keyup.enter="getNReviewList(sortNCase)">
          <button class="search_btn" type="submit" @click="getNReviewList(sortNCase)"><i class="fa-solid fa-search"></i></button>
        </div>
        <div class="sel_wrap">
          <div class="sel" :class="{ active: optionsActive }" tabindex="0" @click="toggleOptions">
            <span class="sel_txt">{{ sortNCase }}</span>
            <i class="fa-solid fa-chevron-down arrow_down"></i>
          </div>
          <div class="sel_list_wrap">
            <div class="sel_list" :style="{ display: optionsActive ? 'block' : 'none' }" >
              <div v-for="(option, index) in options" :key="index" class="sel_opt" :class="{ 'selected': option === sortNCase }" @click="handleClick(option, index, $event)">
                <span>{{ option }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="board_format">
        <table>    
          <thead>
            <tr>
              <th>No</th>
              <th class="board_title">진료명</th>
              <th>담당의</th>
              <th>작성일</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(review, i) in pageReviewList" :key="i" @click="movetonreview(review.rvw_no)">
              <td>{{ review.rvw_no }}</td>
              <td class="ellipsis">{{ review.RVW_TITLE }}</td>
              <td>{{ review.DOC_NM }}</td>
              <td>{{ formatDateTime(review.RVW_DATE) }}</td>
              <td>{{ review.RVW_COUNT }}</td>
            </tr>
          </tbody>
        </table>
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-center">
            <ul v-for="i in pageCnt" :key="i" class="pagination justify-content-center">
              <a href="#top" style="text-decoration: none;">
                <li v-if="i != pageNum + 1" class="page-item page-link" @click="setPage(i)">{{ i }}</li>
                <li v-else class="page-item page-link active" @click="setPage(i)">{{ i }}</li>
              </a>
            </ul>
          </ul>
        </nav>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nreviewList: [],
      sortNCase: "최근 순",
      options: ['최근 순','오래된 순','조회수 높은 순','조회수 낮은 순'],
      keyword: '',
      pageReviewList: [],  // 한 페이지에 보여줄 굿즈 리스트를 잘라 담을 새 리스트
      pageNum: 0,
      pageCnt: 0,
      onePageCnt: 10,
      optionsActive: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.getNReviewList();
  },
  methods: {
    handleClick(option, param, event) {
      this.handleSelect(option);
      this.sortList(param, event);
    },
    setPage(page) {
      this.pageReviewList = []
      this.pageNum = page - 1;
      this.sliceList()
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt
      this.pageReviewList = this.nreviewList.slice(start, start + this.onePageCnt);
    },
    async getNReviewList(sortNCaseNum) {
      let keyword = 'none'
      if (this.keyword != '') {
        keyword = this.keyword;
      }
      try {
        const response = await axios.get(`http://localhost:3000/review/review/${sortNCaseNum}/${keyword}`);
        this.nreviewList = response.data;
        //console.log(this.nreviewList);
        this.pageCnt = Math.ceil(this.nreviewList.length / this.onePageCnt)
        this.setPage(1)
      } catch (error) {
        console.error(error);
      }
    },
    sortList(sortNum, event) {
      event.preventDefault();
      if (sortNum == 0) {
          this.sortNCase = "최근 순"
      } else if (sortNum == 1) {
          this.sortNCase = "오래된 순"
      }
      else if (sortNum == 2) {
          this.sortNCase = "조회수 높은 순"
      }
      else if (sortNum == 3) {
          this.sortNCase = "조회수 낮은 순"
      }
      this.getNReviewList(sortNum);
        // .then(() => {
        //     this.$router.push({ path: '/review' });
        // })
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
    movetonreview(RVW_NO) {
      window.location.href = window.location.pathname + '/reviewdetail?rvw_no=' + RVW_NO;
    },
    handleSelect(item) {
      this.sortNCase = item;
      this.optionsActive = false;
    },
    toggleOptions() {
      this.optionsActive = !this.optionsActive;
    },
  }
};
</script>
<style src="../assets/css/board.css" scoped></style>
<style src="../assets/css/profileInput.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.review_wrap {
  width: fit-content;
  margin: 0 auto;
}


</style>