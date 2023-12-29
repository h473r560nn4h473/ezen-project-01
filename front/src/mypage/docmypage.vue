<template>
  <main class="mt-3">

    <div class="container">
      <div>
        <h2>의료진 마이페이지</h2>
        <button type="button" class="big_red_btn" @click="docReview">진료기록작성</button>
        <button type="button" class="big_red_btn" @click="docQna">QnA확인및답변작성</button>
        <button type="button" class="big_red_btn" @click="docReservation">예약리스트관리</button>
      </div>
      
        <div>
          <h2>내 정보</h2>
        </div>
          <div class="TopBar">
        <div class="my">

          <div class="detail">
            <p>아이디</p>
            <div>
              <h4>{{ loginUser.doc_id }}</h4>
            </div>
          </div>

          <div class="detail">
            <p>이름</p>
            <div>
              <h4>{{ loginUser.doc_nm }}</h4>
            </div>
          </div>

          <div class="detail">
            <p>나이</p>
            <div>
              <h4>{{ loginUser.doc_age }}</h4>
            </div>
          </div>

          <div class="detail">
            <p>전화번호</p>
            <div>
              <h4>{{ loginUser.doc_ph }}</h4>
            </div>
          </div>
          <div class="detail">
            <p>이메일</p>
            <div>
              <h4>{{ loginUser.doc_eml }}</h4>
            </div>
          </div>

          <div class="detail">
            <p>약력</p>
            <div>
              <h4>{{ loginUser.doc_bio }}</h4>
            </div>
          </div>

          <div class="detail">
            <p>전공</p>
            <div>
              <h4>{{ loginUser.doc_mj }}</h4>
            </div>
          </div>

          <div class="detail">
            <p>성별</p>
            <div>
              <h4>{{ loginUser.doc_sex }}</h4>
            </div>
          </div>

        </div>
          </div>
        <div class="btn">
          <a href="http://localhost:8080/mypage/update">
            <button class="modifybtn">수정하기</button>
          </a>
        </div>
      </div>
  </main>
</template>
  
<script>
import axios from 'axios';

export default {

  data() {
    return {
      loginUser: {
      }
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    if (this.user.user_no == '') {
      alert('로그인해주세요');
      this.$router.push({ path: '/login' });
    }
  },
  created() {
    this.getUser();
  },
  methods: {
    async getUser() {
      try {
        const response = await axios.get(`http://localhost:3000/mypage/mypage/${this.user.user_id}`);
        this.loginUser = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    docReview() {
			console.log("의사진료기록페이지")
			this.$router.push('/mypage/docreview');
		},
    docQna() {
			console.log("의사qna페이지")
			this.$router.push('/mypage/docqna');
		},
    docReservation() {
			console.log("의사예약관리페이지")
			this.$router.push('/mypage/docreservation');
		},
  },
};
</script>
  
<style scoped>
* {
  margin: 0;
  padding: 0;
}

ul,
li {
  list-style: none;
}

a {
  text-decoration: none;
}

@font-face {
  font-family: 'GmarketSansMedium';
  src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

.container {
  margin: 50px 100px;
  font-family: GmarketSansMedium;
}

h2 {
  margin: 20px 0;
}

.TopBar p {
  font-size: 1rem;
}

.TopBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 350px;
  width: 20%;
  padding: 0 50px;
  position: relative;
  left: -1%;
  background-color: #f6f6f6;
  border-radius: 10px;
  border: 2px solid rgb(221, 221, 221);
  overflow: hidden;
}

/* -------------------------------------------------------------------myinfo */

.myinfo {
  margin-top: 30px;
  /* background-color: #fff2c9; */
}

.my p {
  width: 100px;
  font-size: 1rem;
  display: inline-block;
  vertical-align: middle;
  padding: 2px;
  margin: 0px 30px 16px 0px;
  /* border: 1px solid red; */
}

.my .detail {
  display: flex;
}

.btn {
  display: flex;
  margin-top: 40px;
}

.modifybtn {
  width: 120px;
  padding: 6px;
  border-radius: 6px;
  color: #cc8c00;
  border: 1px solid #ffbc2b;
  background-color: #fff2c9;
  font-family: GmarketSansMedium;
  cursor: pointer;
  margin-right: 20px;
}

.detail .de h4 {
  margin-bottom: 10px;
}

.deletebtn {
  width: 120px;
  padding: 6px;
  border-radius: 6px;
  color: #888888;
  border: 1px solid #f0f0f0;
  font-family: GmarketSansMedium;
  cursor: pointer;
}

/* --------------------------------------------------------------------------------------------------------------- */


@media screen and (max-width: 768px) {

  .TopBar {
    display: inline-block;
    align-items: center;
    height: 300px;
    width: 100%;
    padding: 0px;
    background-color: #ffffff;
    border: none;
  }
}
</style>

<style scoped>
.big_red_btn {
	font-size: 14px;
	width: 80px;
	height: 50px;
	background-color: red;
	border: none;
	border-radius: 4px;
	margin: 0 auto;
  display:block;
}
</style>