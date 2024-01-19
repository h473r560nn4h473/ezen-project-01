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
              <th>진료명</th>
              <th>진료내용</th>
              <th>담당의</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="review in reviewList" :key="review.RVW_TITLE" @click="movetocontent(review.rvw_no) ">
              <td>{{ review.rvw_no }}</td>
              <td class="ellipsis">{{ review.RVW_TITLE }}</td>
              <td class="ellipsis">{{ review.RVW_CONTENT }}</td>
              <td>{{ review.DOC_NM }}</td> 
              <td>{{ formatDateTime(review.RVW_DATE) }}</td>
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
            <tr v-for="review in reviewList" :key="review.RVW_NO">
              <td class="board_btn_wrap"><button class="board_btn del_btn" @click="confirmDeleteContent(review.rvw_no)">삭제</button></td>
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
            reviewList: [],
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    created() {
        this.getReviewList();
    },
    methods: {
        async getReviewList() {
            try {
                const response = await axios.get(`http://localhost:3000/mypage/getMyReview/${this.user.user_no}`);
                this.reviewList = response.data;
                console.log(this.reviewList);
                this.reviewList.sort(function (a, b) {
                  return b.rvw_no - a.rvw_no;
                });
            } catch (error) {
                console.error(error);
            }
        },
        movetocontent(RVW_NO) {
            window.location.href = "http://localhost:8080/mypage/myreview" + '/reviewcontent?rvw_no=' + RVW_NO
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
        confirmDeleteContent(RVW_NO) {
          this.$swal({
            title: `${RVW_NO}번 후기을 삭제하시겠습니까?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '예',
            cancelButtonText: '아니오',
          }).then(result => {
            if(result.value) {
              this.deleteContent(RVW_NO);
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
        deleteContent(RVW_NO) {
          axios({
            url: "http://localhost:3000/mypage/review/delete",
            method: "POST",
            data: {
              rvw_no: RVW_NO
            },
          }).then(res => {
            this.content = res.data;
            console.log(res.data)
          }).catch(err => {
            alert(err);
          });
        }
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