<template>
    <main>
      <div class="title">
        <h1>내 정보 수정</h1>
      </div>
      <div class="wrap">
        <div  v-if="loginUser.user_social_tp == 0" class="input_row">
          <label for="name" class="item"><div class="bar"></div>아이디</label>
          <input type="text" id="name" v-model="loginUser.user_id" />
        </div>
        <div  v-else class="input_row">
          <label for="name" class="item"><div class="bar"></div>아이디</label>
          <input type="text" id="name" v-model="loginUser.user_id" disabled=true/>
        </div>
        <div class="input_row">
          <label for="name" class="item"><div class="bar"></div>이름</label>
          <input type="text" id="name" v-model="loginUser.user_nm" />
        </div>
        <div class="input_row">
          <label for="tel" class="item"><div class="bar"></div>전화번호</label>
          <input type="text" id="tel" v-model="loginUser.user_ph" />
        </div>
        <div v-if="loginUser.user_social_tp !== 1" class="input_row find">
          <button class="find_text" @click="goToPass">비밀번호 수정</button>
        </div>
        <div v-else class="input_row">
          <p>소셜로 가입한 아이디와 비번은 수정 불가능입니다</p>
        </div>
        <div class="btn_area">
          <button type="submit" class="btn_small" @click="onSubmitForm">수정하기</button>
          <button class="btn_small" @click="this.$router.go(-1)">취소</button>
        </div>
      </div>
    </main>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        loginUser: {}
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    mounted() {
      if (this.user.user_no === '') {
        this.$swal('로그인해주세요');
        this.$router.push({ path: '/login' })
      } else {
        axios
          .get('http://localhost:3000/mypage/getUserData', {
            params: {
              user_no: this.user.user_no
            }
          })
          .then((res) => {
            if (res.data.length > 0) {
              this.loginUser = res.data[0];
              console.log(this.loginUser);
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    methods: {
      onSubmitForm() {
        if ( this.loginUser.user_nm === "" || this.loginUser.user_ph === "" ) {
          this.$swal("모든 항목을 입력해주세요")
        } else {
          axios
            .post('http://localhost:3000/mypage/mypageupdate', {
              user_no: this.user.user_no,

              user_id: this.loginUser.user_id,
              user_nm: this.loginUser.user_nm,
              user_ph: this.loginUser.user_ph
            })
            .then((res) => {
              if (res.data.message === 'user_update') {
                this.$swal("수정이 완료되었습니다");
                this.$router.push({ path: '/mypage' });
              } else {
                this.$swal("수정에 실패했습니다.")
              }
            })
            .catch((err) => {
              console.log(err);
              this.$swal("수정에 실패했습니다!")
            })
        }
      },
      goToPass() {
        this.$router.push({ path: '/mypage/pass' });
      },
    }
  }
  </script>
  <style src="../assets/css/profileInput.css" scoped></style>
  <style src="../assets/css/boardContent.css" scoped></style>
  <style scoped>
  @import "../assets/css/global.css";
  
  .wrap {
    width: 600px;
  }

  .wrap .input_row :last-child {
  margin-left: auto; /* 마지막 자식 요소를 오른쪽으로 밀어냄 */
  }
  
  .input_row {
    margin-bottom: 40px;
  }
  
  .notice {
    margin-bottom: 30px;
  }

  .find .find_text {
  padding: 10px;
  color: var(--color-gray);
  text-decoration: underline;
  }

.find .find_text:hover {
  color: var(--color-dark);
}

  </style>