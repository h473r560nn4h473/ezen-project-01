<template>
  <main>
    <div class="title">
      <h1>의료진 마이페이지</h1>
    </div>
      <div class="wrap pet">
        <div class="top_wrap">
        <h2 class="top"><i class="fa-solid fa-user"></i>&nbsp;의사 정보</h2>
        </div>
        <div class="content_wrap">
          <table>
            <tr>
              <th><div class="bar"></div>아이디</th>
              <td>{{ doctor.doc_id }}</td>
            </tr>
            <tr>
              <th><div class="bar"></div>이름</th>
              <h4>{{ doctor.doc_nm }}</h4>
            </tr>
            <tr>
              <th><div class="bar"></div>나이</th>
              <h4>{{ doctor.doc_age }}</h4>
            </tr>
            <tr>
              <th><div class="bar"></div>전화번호</th>
              <h4>{{ doctor.doc_ph }}</h4>
            </tr>
            <tr>
              <th><div class="bar"></div>이메일</th>
              <h4>{{ doctor.doc_eml }}</h4>
            </tr>
            <tr>
              <th><div class="bar"></div>약력</th>
              <h4>{{ doctor.doc_bio }}</h4>
            </tr>
            <tr>
              <th><div class="bar"></div>전공</th>
              <h4>{{ doctor.doc_mj }}</h4>
            </tr>
            <tr>
              <th><div class="bar"></div>성별</th>
              <h4>{{ doctor.doc_sex }}</h4>
            </tr>
          </table>
        </div>
        <div class="btn_area">
          <a href="http://localhost:8080/docpage/docupdate">
            <button class="btn_small">수정하기</button>
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
      doctor: {
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
        const response = await axios.get(`http://localhost:3000/mypage/docpage/${this.user.user_id}`);
        this.doctor = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    docReview() {
			console.log("의사진료기록페이지")
			this.$router.push('/docpage/docreview');
		},
    docQna() {
			console.log("의사qna페이지")
			this.$router.push('/docpage/docqna');
		},
    docReservation() {
			console.log("의사예약관리페이지")
			this.$router.push('/docpage/docreservation');
		},
  },
};
</script>
  
<style src="../assets/css/boardContent.css" scoped />
<style scoped>
@import "../assets/css/global.css";

.content_wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0;
}

th {
  min-width: 110px;
}
</style>