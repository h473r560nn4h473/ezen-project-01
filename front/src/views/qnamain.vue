<template>
  <main class="content_wrap">
      <div class="title">
        <h1>QnA 게시판</h1>
      </div>
      <div class="review_wrap">
        <div class="srch_sel_wrap">
          <div class="search_bar">
            <input v-model="keyword" class="search_input" type="text" placeholder="담당의 검색" @keyup.enter="getQnaList(sortNCase)">
            <button class="search_btn" type="submit" @click="getQnaList(sortNCase)"><i class="fa-solid fa-search"></i></button>
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
                        <th class="board_title">제목</th>
                        <th>작성자</th>
                        <th>담당의</th>
                        <th>작성일</th>
                        <th>비밀글</th>
                        <th>답변상태</th>
                    </tr>
                </thead>
                <tbody> <!--가져온 정보의 게시글 번호-->
                    <tr v-for="item in pageQnaList" :key="item.QNA_NO"
                    @click="item.IS_SECRET === 0 ? movetocontent(item.QNA_NO) : movetoSecret(item.QNA_NO, item.USER_NO, item.DOC_ID)">
            
                        <td>{{ item.QNA_NO }}</td> <!-- 글번호 -->
                        <td class="ellipsis">{{ item.QNA_TITLE }}</td>
                        <td>{{ item.USER_NM }}</td>
                        <td>{{  item.DOC_NM }}</td>
                        <td>{{ formatDateTime(item.QNA_DATE)}}</td>
                        <td><i v-if="item.IS_SECRET == 1" class="fa fa-lock"></i></td>
                        <td v-if="item.QNA_ANSWER != null">답변 완료</td>
                        <td v-else></td>
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
              <div class="btn_area">
                <button v-if="user.user_id == ''" class="btn_small" @click="login">작성</button>
                <button v-else class="btn_small" @click="write_qna">작성</button>
              </div>
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
        qnaList: [], //현재 게시판과 페이지에 맞는 글 리스트
        sortNCase: "최근 순",
        options: ['최근 순','오래된 순'],
        keyword: '',
        pageQnaList: [],
        pageNum: 0,
        pageCnt: 0,
        onePageCnt: 10, //한페이지에 보여지는 정보 갯수
        optionsActive: false
      }
    },
    computed: {
        user() {
            return this.$store.state.user; // 로그인 확인
        },
  
    },
    created() {
      this.getQnaList();
    },
    methods: {
      handleClick(option, param, event) {
        this.handleSelect(option);
        this.sortList(param, event);
      },
      setPage(page) {
        this.pageQnaList = []
        this.pageNum = page - 1;
        this.sliceList()
      },  
      sliceList() {
        const start = 0 + this.pageNum * this.onePageCnt
        this.pageQnaList = this.qnaList.slice(start, start + this.onePageCnt);
      },
      async getQnaList(sortNCaseNum) {
        let keyword = 'none'
        if (this.keyword != '') {
          keyword = this.keyword;
        }
        try {
          const response = await axios.get(`http://localhost:3000/qna/qna_list/${sortNCaseNum}/${keyword}`);
          this.qnaList = response.data;
          console.log(this.qnaList);
          this.pageCnt = Math.ceil(this.qnaList.length / this.onePageCnt)
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
        this.getQnaList(sortNum);
          
      },
      write_qna() {
            this.$router.push({ path: '/qnawrite' });
      },
      login() {
            this.$swal({
  
                title: '로그인 하신 후에 작성하실 수 있습니다.',
                showConfirmButton: true,
            })
                .then(() => {
                    window.location.href = "http://localhost:8080/login";
                })
      },
       movetocontent(QNA_NO) {
        window.location.href = window.location.pathname + '/qnaDetail?QNA_NO=' + QNA_NO
      },
      movetoSecret(qnaNo, itemNo, docId) {
        if (this.user.user_tp == 1 || itemNo == this.user.user_no || docId == this.user.user_id) {
          window.location.href = window.location.pathname + '/qnaDetail?QNA_NO=' + qnaNo
        } else {
          this.$swal("비밀글입니다")
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
  
  .pagination:not(:last-child) {
    margin-right: 10px;
  }
  
  .page-link {
    color: var(--color-sub-dark);
    border: 1px solid var(--color-lightgray);
    border-radius: 12px;
  }
  
  .page-link.active {
    color: var(--color-white);
    background-color: var(--color-sub-dark);
  }
  </style>