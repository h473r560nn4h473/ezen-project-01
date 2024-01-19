<template>
  <main class="form">
    <div class="login-form wrap">
      <div class="logo">
        <img src="../assets/logo-icon-color.svg">
      </div>
      <div class="input_wrap">
        <div class="input_row">
          <input type="password" id="user_pw" placeholder="기존 비밀번호" v-model="user_pw" />
          <div class="eye" @click="oneyes('user_pw')"><i class="fa-solid fa-eye"></i></div>
        </div>
        <div class="warning_row">
          <div class="warning" :class="{ active: user_pw !== '' && !isPasswordValid(user_pw)}">비밀번호가 일치하지 않습니다
          </div>
        </div>
        <div class="input_row">
          <input type="password" id="user_npw" placeholder="새 비밀번호" v-model="user_npw" />
          <div class="eye" @click="oneyes('user_npw')"><i class="fa-solid fa-eye"></i></div>
        </div>
        <div class="warning_row">
          <div class="warning" :class="{ active: user_npw !== '' && !isPasswordValid(user_npw) }">영문, 숫자, 특수문자 조합 8자 이상
          </div>
        </div>
        <div class="input_row">
          <input type="password" id="user_npw_ck" placeholder="비밀번호 확인" v-model="user_npw_ck" />
          <div class="eye" @click="oneyes('user_npw_ck')"><i class="fa-solid fa-eye"></i></div>
        </div>
        <div class="warning_row">
          <div class="warning" :class="{ active: user_npw_ck !== '' && !isPasswordValid(user_npw_ck) }">영문, 숫자, 특수문자 조합 8자
            이상</div>
        </div>
      </div>
      <div class="btn_row">
        <button type="submit" class="btn_small" :disabled="!isFormValid" @click="onSubmitForm">비밀번호 변경</button>
        <button type="button" class="btn_small" @click="this.$router.go(-1)">취소</button>
      </div>
    </div>
  </main>
</template>

<script>
//230709
import axios from "axios";

export default {
  data() {
    return {
      user_pw: "",
      user_npw: "",
      user_npw_ck: "",
      user_no: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    isFormValid() {
      return (
        this.user_pw !== "" &&
        this.user_npw !== "" &&
        this.user_npw_ck !== "" &&
        this.user_npw === this.user_npw_ck &&
        this.isPasswordValid(this.user_pw) &&
        this.isPasswordValid(this.user_npw) &&
        this.isPasswordValid(this.user_npw_ck)
      );
    },
  },
  mounted() {
    if (this.user.user_no === "") {
      this.$swal("로그인해주세요");
      this.$router.push({ path: "/login" });
    } else {
      this.user_no = this.user.user_no;

      axios.get(`http://localhost:3000/mypage/getUserData/${this.user.user_no}`)
        .then((res) => {
          if (res.data.length > 0) {
            this.user = res.data[0];
            console.log(this.user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  methods: {
    onSubmitForm() {
      if (
        this.user_pw === "" ||
        this.user_npw === "" ||
        this.user_npw_ck === ""
      ) {
        this.$swal({
          icon: "warning",
          title: "모든 항목을 입력해주세요"
        });
      } else if (this.user_npw !== this.user_npw_ck) {
        this.$swal("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      } else {
        axios.post("http://localhost:3000/mypage/pass_process", {
          user_no: this.user_no,
          user_pw: this.user_pw,
          user_npw: this.user_npw,
          user_npw_ck: this.user_npw_ck,
        })
          .then((res) => {
            if (res.data.message === "pass_update") {
              this.$swal({
                icon: 'success',
                title: '수정이 완료되었습니다',
                showConfirmButton: false,
                timer: 1500
              });
              this.$router.push({ path: "/mypage" });
            } else if (res.data.message === "pw_ck") {
              this.$swal("비밀번호가 틀립니다.");
            } else {
              this.$swal("알 수 없는 오류가 발생했습니다.");
            }
          })
          .catch((error) => {
            console.log(error);
            this.$swal("수정에 실패했습니다.");
          });
      }
    },
    //비밀번호 보기 아이콘
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
    isPasswordValid(password) {
      const regex = /^\s*(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}\s*$/;
      return regex.test(password);
    }
  }
}
</script>
<style src="../assets/css/profileInput.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.wrap {
  width: 400px;
  margin: 50px auto;
  border: solid 1px var(--color-lightgray);
  background: linear-gradient(140deg, var(--color-white) 30%, #fff2e6 100%);
}

.logo {
  width: 110px;
  margin: 40px auto;
}

.logo img {
  width: 100%;
}

.input_wrap {
  margin-bottom: 20px;
}

.input_row {
  position: relative;
}

.input_row input {
  width: 100%;
}

.eye {
  color: var(--color-gray);
  position: absolute;
  right: 4px;
  top: 4px;
  background: var(--color-white);
  height: 42px;
  width: 42px;
  border-radius: 0 21px 21px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}

.btn_row {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
