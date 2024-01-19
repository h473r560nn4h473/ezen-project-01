<template>
  <main>
    <div class="board_format">
      <div class="title">
        <h1>문의 내역</h1>
      </div>
      <div class="merge">
        <table class="tbList">
          <thead>
            <tr>
              <th>No</th>
              <th>작성일</th>
              <th>제목</th>
              <th>비밀글</th>
              <th>답변상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="qna in qnalist" :key="qna.QNA_NO" @click="movetocontent(qna.QNA_NO) ">
              <td>{{ qna.QNA_NO }}</td>
              <td>{{ formatDateTime(qna.QNA_DATE) }}</td>
              <td class="ellipsis">{{ qna.QNA_TITLE }}</td>
              <td><i v-if="qna.IS_SECRET == 1" class="fa-solid fa-lock"></i></td>
              <td v-if="qna.QNA_ANSWER !== null">답변 완료</td>
              <td v-else></td>
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
            <tr v-for="qna in qnalist" :key="qna.QNA_NO">
              <td class="board_btn_wrap"><button class="board_btn del_btn" @click="confirmDeleteContent(qna.QNA_NO)">삭제</button></td>
             </tr>
          </tbody>
        </table>   
      </div>   
        <nav aria-label="Page navigation example">
          <div class="btn_area">
            <button class="btn_small" @click="write_qna">작성</button>
          </div>
        </nav>       
    </div>
  </main>  
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
      return {
          qnalist: [],
          pageSize: 10,
          cnt: 0,
      }
    },
    computed: {
      user() {
           return this.$store.state.user;
      },
      
    },
    created() {
        this.getQnaList();
    },
    methods: {
        async getQnaList() {
            try {
                const response = await axios.get(`http://localhost:3000/mypage/getMyQna/${this.user.user_no}`);
                this.qnalist = response.data;
                this.qnalist.sort(function (a, b) {
                  return b.QNA_NO - a.QNA_NO;
                });
                console.log(this.qnalist);
            } catch (error) {
                console.error(error);
            }
        },
        movetocontent(QNA_NO) {
            window.location.href = window.location.pathname + '/myqnadetail?QNA_NO=' + QNA_NO
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
        confirmDeleteContent(QNA_NO) {
          this.$swal({
            title: `${QNA_NO}번 질문을 삭제하시겠습니까?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '예',
            cancelButtonText: '아니오',
          }).then(result => {
            if(result.value) {
              this.deleteContent(QNA_NO);
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
        deleteContent(QNA_NO) {
          axios({
            url: "http://localhost:3000/mypage/qna/delete",
            method: "POST",
            data: {
              qna_no: QNA_NO
            },
          }).then(res => {
            this.content = res.data;
            console.log(res.data)
          }).catch(err => {
            alert(err);
          });
        },
        write_qna() {
            this.$router.push({ path: '/qnawrite' });
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