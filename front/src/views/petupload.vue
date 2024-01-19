<template>
  <main class="content_wrap">
    <div class="title">
      <h1>펫 정보 등록</h1>
    </div>
    <div class="wrap">
      <div class="vital">
        <span class="red">*</span> 별표 표시된 항목들은 필수 항목입니다.
      </div>
      <div class="background" @submit.prevent="onSubmitForm">
        <form id="sendForm">
          <h2 class="sub_title">펫(반려동물) 정보</h2>
          <div class="input_row">
            <label for="pet_no" class="item"
              ><div class="bar"></div>
              동물등록번호 <span class="red">*</span></label
            >
            <input
              type="text"
              id="pet_no"
              @input="checkPno"
              v-model="pet_no"
              :maxlength="max_pno"
              placeholder="숫자 15자리"
            />
          </div>
          <div class="warning_row">
            <p class="warning" :class="{ active : errorPno }">숫자 15자리</p>
          </div>
          <div class="input_row">
            <label for="pet_nm" class="item"
              ><div class="bar"></div>
              펫 이름 <span class="red">*</span></label
            >
            <input type="text" id="pet_nm" v-model="pet_nm" @input="checkPnm" />
          </div>
          <div class="warning_row">
            <p class="warning" :class="{ active : errorPnm }">펫 이름을 입력하세요.</p>
          </div>
          <div class="input_row">
            <label for="pet_age" class="item"
              ><div class="bar"></div>
              펫 나이 <span class="red">*</span></label
            >
            <input
              type="text"
              id="pet_age"
              @input="checkPag"
              v-model="pet_age"
              placeholder="숫자만"
            />
          </div>
          <div class="warning_row">
            <p class="warning" :class="{ active : errorPag }">펫 나이를 입력하세요.</p>
          </div>
          <div class="input_row">
            <div class="item">
              <div class="bar"></div>
              펫 성별 <span class="red">*</span>
            </div>
            <div class="radio_wrap">
              <div class="radio_box">
                <label for="female" class="radio_sex">
                  <input
                    type="radio"
                    id="female"
                    name="sex"
                    v-model="pet_sex"
                    :value="1"
                    @input="checkPsx"
                  />
                  <span>암</span>
                </label>
              </div>
              <div class="radio_box">
                <label for="male" class="radio_sex">
                  <input
                    type="radio"
                    id="male"
                    name="sex"
                    v-model="pet_sex"
                    :value="2"
                    @input="checkPsx"
                  />
                  <span>수</span>
                </label>
              </div>
            </div>
          </div>
          <div class="warning_row">
            <p class="warning" :class="{ active : errorPsx }">펫 성별을 선택하세요.</p>
          </div>
          <div class="input_row">
            <label for="pet_type" class="item"
              ><div class="bar"></div>
              펫 종류 <span class="red">*</span></label
            >
            <input
              type="text"
              id="pet_type"
              v-model="pet_type"
              @input="checkPtp"
            />
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorPtp }">펫 종류를 선택하세요.</div>
          </div>
          <div class="btn_wrap">
            <button class="button" type="submit" :disabled="check_final">
              등록
            </button>
            <button class="button" onclick="history.back();">뒤로가기</button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      pet_no: "",
      pet_nm: "",
      pet_age: "",
      pet_sex: [],
      pet_type: "",

      errorPno: undefined,
      errorPnm: undefined,
      errorPag: undefined,
      errorPsx: undefined,
      errorPtp: undefined,

      max_pno: 15,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    check_final() {
      const fields = [
        "errorPno",
        "errorPnm",
        "errorPag",
        "errorPsx",
        "errorPtp",
      ];
      for (let check = 0; check < fields.length; check++) {
        if (this[fields[check]] === undefined || this[fields[check]]) {
          return true;
        }
      }
      return false;
    },
  },
  methods: {
    onSubmitForm() {
      if (!this.validationCheck()) {
        return;
      }
      axios
        .post("http://localhost:3000/auth/petupload", {
          user_no: this.user.user_no,

          pet_no: this.pet_no,
          pet_nm: this.pet_nm,
          pet_age: this.pet_age,
          pet_sex: this.pet_sex,
          pet_type: this.pet_type,
        })
        .then((res) => {
          if (res.data.message == "already_exist_id") {
            this.$swal("이미 존재하는 아이디입니다.");
          } else if (res.data.message == "DB_error") {
            this.$swal("DB 에러 발생");
          } else {
            this.$swal({
              position: "top",
              icon: "success",
              title: "펫정보가 등록되었습니다!",
              showConfirmButton: false,
              timer: 1500,
            });
            this.$router.push({ path: "/" }); // 로그인 화면으로 이동
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    validationCheck() {
      if (this.errorPno == true) {
        this.$swal("동물등록번호조건불충족");
        return false;
      }

      if (this.errorPnm == true) {
        this.$swal("동물이름조건불충족");
        return false;
      }

      if (this.errorPag == true) {
        this.$swal("동물나이조건불충족");
        return false;
      }

      if (this.errorPsx == true) {
        this.$swal("동물성별조건불충족");
        return false;
      }

      if (this.errorPtp == true) {
        this.$swal("동물타입조건불충족");
        return false;
      }
      return true;
    },
    validateInput(input, field) {
      //숫자 이외의 문자 제거
      this[field] = input.replace(/\D/g, "");
    },
    checkPno() {
      const validatePno = /^[0-9]{15,}$/;
      this.validateInput(this.pet_no, "pet_no");

      if (validatePno.test(this.pet_no) && this.pet_no) {
        this.errorPno = false;
      } else {
        this.errorPno = true;
      }
    },
    checkPnm() {
      if (this.pet_nm !== "") {
        this.errorPnm = false;
      } else {
        this.errorPnm = true;
      }
    },
    checkPag() {
      this.validateInput(this.pet_age, "pet_age");

      if (this.pet_age !== "") {
        this.errorPag = false;
      } else {
        this.errorPag = true;
      }
    },
    checkPsx() {
      if (!this.pet_sex) {
        this.errorPsx = true;
      } else {
        this.errorPsx = false;
      }
    },
    checkPtp() {
      if (this.pet_type !== "") {
        this.errorPtp = false;
      } else {
        this.errorPtp = true;
      }
    },
  },
};
</script>

<style src="../assets/css/profileInput.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

* {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* 인터넷익스플로러 */
  user-select: none;
}

.join_onhead {
  display: flex;
  justify-content: space-between;
  align-items: end;
  padding: 10px 20px 0;
}

h1 {
  font-size: var(--font-large);
  font-weight: 500;
}

.join_wrap {
  margin: 50px auto;
  width: 600px;
}

.vital {
  margin-bottom: 30px;
}

.red {
  color: var(--color-red);
}

.sub_title {
  font-size: var(--font-medium);
  font-weight: 500;
  margin-bottom: 30px;
}

.input_row input:not([type=radio]):not([type=checkbox]) {
  width: 400px;
}


.btn_wrap {
  margin: 0 auto;
  width: 70%;
  display: flex;
  justify-content: space-between;
}
</style>
