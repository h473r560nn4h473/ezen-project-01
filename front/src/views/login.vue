<template>
  <main class="content_wrap">
    <div class="wrap">
      <div class="logo">
        <img src='../assets/logo-icon-color.svg'>
      </div>
      <div class="container">
        <div class="input_row">
          <label for="user_id" class="blind">아이디</label>
          <input type="text" id="user_id" @keyup.enter="login()" placeholder="아이디" v-model="user_id" />
        </div>
        <div class="input_row">
          <label for="user_pw" class="blind">비밀번호</label>
          <input type="password" id="user_pw" @keyup.enter="login()" placeholder="비밀번호" v-model="user_pw" />
          <div class="eye" @click="oneyes('user_pw')"><i class="fa-solid fa-eye"></i></div>
        </div>
        <div class="btn_wrap">
          <div class="login_join">
            <button type="button" class="button btn_login" @click="login()">로그인</button>
            <button type="button" class="button btn_join" @click="join()">회원가입</button>
          </div>
          <div class="find">
            <button class="find_text" @click="find()">아이디/비밀번호 찾기</button>
          </div>
          <div class="hr_sect">소셜 로그인</div>
          <div class="social_btn_wrap">
            <button class="btn_social btn_kakao" @click="kakaoLogin">
              <img src="../assets/kakao.svg" alt="카카오">
              <span>카카오 로그인</span>
            </button>
            <div id="naverIdLogin" @click="naverlogin"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      user_id: '',
      user_pw: '',
      naver_id: '',
      naverLogin: []
    };
  },
  computed: {
    user() {
      return this.$store.state.user; // user 정보가 바뀔 때마다 자동으로 user() 갱신
    },
  },
  mounted() {
    //console.log(this.naverLogin.user);
    this.naverLogin = new window.naver.LoginWithNaverId({
      clientId: "WVOOppNGu8IOY9Zw_L3v",
      callbackUrl: "http://localhost:8080",
      isPopup: false,
      loginButton: {
        color: "green", type: 3, width: "100%", height: 50,
      },
    });
    //this.$store.commit("naverLogin", this.naverLogin);

    this.naverLogin.init();

    this.naverLogin.getLoginStatus((status) => {
      if (status) {
        console.log(status);
        console.log(this.naverLogin.user.nickname);

        const email = this.naverLogin.user.email;
        //const id = this.naverLogin.user.id;
        //const nick = this.naverLogin.user.nickname;

        this.naver_id = email;
        console.log(email)
        //console.log(nick)

      } else {
        console.log("callback처리 실패");
      }
    });
  },
  methods: {
    login() {
      axios({
        url: "http://localhost:3000/auth/login_process",
        method: "POST",
        data: {
          user_id: this.user_id,
          user_pw: this.user_pw
        },
      })
        .then(res => {
          if (res.data.message == 'undefined_id') {
            this.$swal({
              icon: 'error',
              title: '존재하지 않는 아이디입니다.'
            })
          }
          else if (res.data.message == 'incorrect_pw') {
            this.$swal({
              icon: 'error',
              title: '비밀번호가 틀렸습니다.'
            })
          }
          else {
            this.$store.commit("user", { user_id: this.user_id, user_no: res.data.message })
            this.$swal({
              icon: 'success',
              title: '로그인 성공!',
              showConfirmButton: false,
              timer: 1500
            })
            this.$router.push({ path: '/' }); 
            
            // 메인 화면으로 이동
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    oneyes(field) {
      const passwordInput = document.querySelector(`#${field}`);
      const eyeIcon = document.querySelector(`#${field} + .eye`);
      let isMouseDown = false;

      eyeIcon.addEventListener("mousedown", () => {
        passwordInput.type = "text";
        eyeIcon.style = "color: var(--color-dark)";
        isMouseDown = true;
      });

      document.addEventListener("mouseup", () => {
        passwordInput.type = "password";
        eyeIcon.style = "color: var(--color-gray)";
        isMouseDown = false;
      });

      passwordInput.addEventListener("blur", () => {
        passwordInput.type = "password";
        eyeIcon.style = "color: var(--color-gray)";
        isMouseDown = false;
      });

      passwordInput.addEventListener("focus", () => {
        if (isMouseDown) {
          passwordInput.type = "text";
          eyeIcon.style = "color: var(--color-dark)";
        }
      });
    },
    join() {
      this.$router.push({ path: '/join1' })
    },
    find() {
      this.$router.push({ path: '/find' })
    },

    //====================카카오===========================================
    kakaoLogin() {
      window.Kakao.Auth.login({
        scope: "profile_nickname, account_email",
        success: this.getKakaoAccount,
      });
    },
    getKakaoAccount() {
      window.Kakao.API.request({
        url: "/v2/user/me",
        success: (res) => {
          const kakao_account = res.kakao_account;
          const email = kakao_account.email;
          const nickname = kakao_account.profile.nickname;
      
          console.log(nickname + '' + email + '' )
          axios({
              url: "http://localhost:3000/auth/kakaoLoginProcess",
              method:"POST",
              data: {
                  user_id: email,
                  user_nm: nickname
              },
          }).then(res=> {
            if (res.data.message == '로그인') {
              this.$store.commit("user", {user_id: email, user_no: res.data.user})
                this.$swal({
                  icon: 'success',
                  title: '로그인 성공!',
                  showConfirmButton: false,
                  timer: 1500
                }).then(() => {
                  window.location.href = "http://localhost:8080";
                })
            }
            else {
              this.$store.commit("user", {user_id: email, user_no: res.data.message})
              this.$swal({
                icon: 'success',
                title: '최초 로그인!',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                window.location.href = "http://localhost:8080/petupload";
              })
            }
          }).catch(err => {
            console.log(err);
          })
        },
        fail: (error) => {
          console.log(error);
        },
      });
    },
    //=============================네이버===============================
    naverlogin() {
      console.log("로그인함수 실행됨")
      axios({
        url: "http://localhost:3000/auth/naverlogin",
        method: "POST",
        data: {
          // naverlogin: this.naverLogin.accessToken.accessToken,
          naverlogin: this.naverLogin.user,

        },
      }).then(res => {
        if (res.data.message == '로그인') {
          this.$store.commit("user", { user_id: this.naver_id, user_no: res.data.user })
          this.$swal({
            icon: 'success',
            title: '최초 로그인 성공!',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            window.location.href = "http://localhost:8080/petupload";
          })
        } else {
          this.$store.commit("user", { user_id: this.naver_id, user_no: res.data.message })
          this.$swal({
            icon: 'success',
            title: '로그인 성공!',
            showConfirmButton: false,
            timer: 1500,
          }).then(() => {
            window.location.href = "http://localhost:8080";
          })
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
</script>

<style src="../assets/css/profileInput.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.wrap {
  width: 550px;
  margin: 50px auto;
  border: solid 1px var(--color-lightgray);
  background: linear-gradient(140deg, var(--color-white) 30%, #fff2e6 100%);
  border-radius: 30px;
}

.logo {
  width: 110px;
  margin: 70px auto;
}

.logo img {
  width: 100%;
}

.container {
  width: 80%;
  margin: 0 auto 70px;
}

.input_row {
  position: relative;
  margin-bottom: 30px;
}

.input_row input {
  width: 100%;
}

#user_pw {
  padding: 0 50px 0 20px;
}

.eye {
  color: var(--color-gray);
  position: absolute;
  right: 0;
  top: 0;
  height: 50px;
  width: 50px;
  border-radius: 0 25px 25px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.btn_wrap {
  width: 100%;
}

.button:first-child {
  margin-right: 30px;
}

.login_join {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.login_join .button {
  width: 47%;
}

.find {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}

.find .find_text {
  padding: 10px;
  color: var(--color-gray);
  text-decoration: underline;
}

.find .find_text:hover {
  color: var(--color-dark);
}

.hr_sect {
  display: flex;
  flex-basis: 100%;
  align-items: center;
  color: var(--color-dark);
  font-size: var(--font-small);
  margin-bottom: 30px;
}

.hr_sect::before,
.hr_sect::after {
  content: "";
  flex-grow: 1;
  background: var(--color-gray);
  height: 1px;
  box-sizing: border-box;
}

.hr_sect::before {
  margin-left: 20px;
  margin-right: 16px;
}

.hr_sect::after {
  margin-left: 16px;
  margin-right: 20px;
}

.social_btn_wrap {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
}

.btn_social {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  cursor: pointer;
}

.btn_social:hover {
  box-shadow: 0 0 15px -3px var(--color-lightgray);
}

.btn_social:last-child {
  margin-bottom: 0;
}

.btn_social img {
  width: 1.2em;
  margin-right: 10px;
}

.btn_social span {
  line-height: 1.2;
}

.btn_kakao {
  background-color: #ffe500;
}

.btn_kakao span {
  color: #000000;
}

#naverIdLogin:hover {
  box-shadow: 0 0 15px 0 var(--color-lightgray);
}
</style>