<template>
  <main>
    <div class="title">
      <h1>마이페이지</h1>
    </div>
    <div class="wrap pet">
      <div class="top_wrap">
        <h2 class="top"><i class="fa-solid fa-paw"></i>&nbsp;펫 정보</h2>
      </div>
      <div class="content_wrap">
        <table>
          <tr>
            <th><div class="bar"></div>이름</th>
            <td>{{ loginUser.pet_nm }}</td>
          </tr>
          <tr>
            <th><div class="bar"></div>나이</th>
            <td>{{ loginUser.pet_age }}</td>
          </tr>
          <tr>
            <th><div class="bar"></div>성별</th>
            <td v-if="loginUser.pet_sex == 1">암컷</td>
            <td v-else>수컷</td>
          </tr>
          <tr>
            <th><div class="bar"></div>종류</th>
            <td>{{ loginUser.pet_type }}</td>
          </tr>
          <tr v-if="loginUser.pet_wgt == undefined">
          </tr>
          <tr v-else>
            <th><div class="bar"></div>몸무게</th>
            <td>{{ loginUser.pet_wgt }}</td>
          </tr>
        </table>
        <div class="img_frame">
          <img v-if="loginUser.pet_img" :src="require(`../../../back/uploads/uploadPet/` + `${loginUser.pet_img}`)" alt="반려동물 사진">
          <img v-else src='../assets/imgempty.svg' alt="null">
        </div>
      </div>
      <div class="btn_area">
        <button class="btn_small" @click="toPetUpdate">수정하기</button>
      </div>
      <div class="top_wrap">
        <h2 class="top"><i class="fa-solid fa-user"></i>&nbsp;회원 정보</h2>
      </div>
      <div class="content_wrap">
        <table>
          <tr>
            <th><div class="bar"></div>이름</th>
            <td>{{ loginUser.user_nm }}</td>
          </tr>
          <tr>
            <th><div class="bar"></div>아이디</th>
            <td>{{ loginUser.user_id }}</td>
          </tr>
          <tr>
            <th><div class="bar"></div>전화번호</th>
            <td v-if="loginUser.user_ph">{{ loginUser.user_ph }}</td>
            <td v-else >전화번호를 수정해주세요</td>
          </tr>
        </table>
      </div>
      <div class="btn_area">
        <button class="btn_small" @click="toMypageUpdate">수정하기</button>
        <button class="btn_small" @click="confirmDeleteUser(user)">탈퇴하기</button>
      </div>
    </div>
  </main>
</template>
  
<script>
import axios from 'axios';

export default {
  // el: "#app",

  data() {
    return {
      // num: 0,
      loginUser: {},
      userlist:[],
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
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
    confirmDeleteUser(user) {
      this.$swal({
        icon : 'question',
        title: `탈퇴하시겠습니까?`,
        showCancelButton: true,
        confirmButtonText: '탈퇴',
        cancelButtonText: '취소',
        reverseButtons: false
      }).then(result => {
        if (result.value) {
          this.deleteUser(user);
          this.$swal({
            icon: 'success',
            title: '탈퇴되었습니다.',
            showConfirmButton: false,
            timer: 1500
          })
          .then(()=> {
            this.$router.push({ path:'/login' });
          })
        }
      });
    },
    async deleteUser(user) {
      console.log('삭제 버튼 클릭 - 사용자 정보: ', user);
      try {
        const response = await axios.delete(`http://localhost:3000/mypage/mypage/userlist/${user.user_no}`);
        console.log('사용자 삭제 성공:', response.data);
      } catch(error) {
        console.error('사용자 삭제 실패:', error);
      }
    },
    async getUser() {
      try {
        const response = await axios.get(`http://localhost:3000/mypage/mypage/${this.user.user_no}`);
        this.loginUser = response.data[0];
        
      } catch (error) {
        console.error(error);
      }
    },
    toPetUpdate() {
      this.$router.push({ path: '/mypage/petupdate' })
    },
    toMypageUpdate() {
      this.$router.push({ path: '/mypage/mypageupdate' })
    }
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