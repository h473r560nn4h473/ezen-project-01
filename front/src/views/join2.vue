<template>
  <main class="content_wrap">
    <div class="title_wrap">
      <div class="title">
        <h1>회원가입</h1>
        <div class="prog">
          <span class="inactive">01.약관동의 </span>
          <i class="fa-solid fa-caret-right"></i>
          <span class="now"> 02.정보입력 </span>
          <i class="fa-solid fa-caret-right"></i>
          <span class="inactive"> 03.가입완료</span>
        </div>
      </div>
    </div>
    <div class="join_wrap">
      <div class="vital"><span class="red">*</span> 별표 표시된 항목들은 필수 항목입니다.</div>
      <div class="background" @submit.prevent="onSubmitForm">
        <form id="sendForm">
          <h2 class="sub_title">보호자 정보</h2>
          <div class="input_row">
            <label for="id" class="item">
              <div class="bar"></div>아이디 <span class="red">*</span>
            </label>
            <div class="input_id">
              <input type="text" id="id" v-model="user_id" :minlength="min_uid" :maxlength="max_uid" placeholder="영문, 숫자 조합 3~20자" @input="checkUidControl" />
              <button class="id_check" @click.prevent="checkDuplicate($event)" v-bind:disabled="errorUid !== false">중복확인</button>
            </div>
          </div>
          <div class="warning_row">
            <div class="warning_id">
              <div class="warning" :class="{ active : errorUid }">영문, 숫자 조합 3~20자</div>
              <div class="warning active" v-show="!errorUid">{{ message }}</div>
            </div>
          </div>
          <div class="input_row">
            <label for="pw" class="item">
              <div class="bar"></div>비밀번호 <span class="red">*</span>
            </label>
            <input type="password" id="user_pw_eye" v-model="user_pw" :minlength="min_upw" placeholder="영문, 숫자, 특수문자 조합 8자 이상" @input="checkUpw1" />
            <div class="eye" @click="oneyes('user_pw_eye')"><i class="fa-solid fa-eye"></i></div>
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorUpw }">영문, 숫자, 특수문자 조합 8자 이상</div>
          </div>
          <div class="input_row">
            <label for="pw_check" class="item">
              <div class="bar"></div>비밀번호 확인 <span class="red">*</span>
            </label>
            <input type="password" id="user_pw_ck_eye" v-model="user_pw_ck" placeholder="비밀번호 재입력" @input="checkUpw2"/>
            <div class="eye" @click="oneyes('user_pw_ck_eye')"><i class="fa-solid fa-eye"></i></div>
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorUpw2 }">비밀번호가 일치하지 않습니다.</div>
          </div>
          <div class="input_row">
            <label for="name" class="item">
              <div class="bar"></div>이름 <span class="red">*</span>
            </label>
            <input type="text" id="name" v-model="user_nm" @input="checkUnm" />
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorUnm }">이름을 입력하세요.</div>
          </div>
          <div class="input_row">
            <label for="tel" class="item">
              <div class="bar"></div>전화번호 <span class="red">*</span>
            </label>
            <input type="tel" id="tel" @input="checkUph" v-model="user_ph" :minlength="min_uph" :maxlength="max_uph"/>
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorUph }">전화번호를 입력하세요.</div>
          </div>
          <h2 class="sub_title">펫 정보</h2>
          <div class="input_row">
            <label for="pet_no" class="item">
              <div class="bar"></div>동물등록번호 <span class="red">*</span>
            </label>
            <input type="text" id="pet_no" @input="checkPno" v-model="pet_no" :maxlength="max_pno" placeholder = "숫자 15자리">
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorPno }">동물등록번호를 입력하세요.</div>
          </div>
          <div class="input_row">
            <label for="pet_nm" class="item">
              <div class="bar"></div>펫 이름 <span class="red">*</span>
            </label>
            <input type="text" id="pet_nm" v-model="pet_nm" @input="checkPnm">
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorPnm }">펫 이름을 입력하세요.</div>
          </div>
          <div class="input_row">
            <label for="pet_age" class="item">
              <div class="bar"></div>펫 나이 <span class="red">*</span>
            </label>
            <input type="text" id="pet_age" @input="checkPag" v-model="pet_age" placeholder="숫자만 입력">
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorPag }">펫 나이를 입력하세요.</div>
          </div>
          <div class="input_row">
            <div class="item">
              <div class="bar"></div>펫 성별 <span class="red">*</span>
            </div>
            <div class="radio_wrap">
              <div class="radio_box">
                <label for="female" class="radio_sex">
                  <input type="radio" id="female" name="sex" v-model="pet_sex" :value="1" @input="checkPsx" />
                  <span>암</span>
                </label>
              </div>
              <div class="radio_box">
                <label for="male" class="radio_sex">
                  <input type="radio" id="male" name="sex" v-model="pet_sex" :value="2" @input="checkPsx" />
                  <span>수</span>
                </label>
              </div>
            </div>
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorPsx }">펫 성별을 선택하세요.</div>
          </div>
          <div class="input_row">
            <label for="pet_type" class="item">
              <div class="bar"></div>펫 종류 <span class="red">*</span>
            </label>
            <input type="text" id="pet_type" v-model="pet_type" @input="checkPtp"/>
          </div>
          <div class="warning_row">
            <div class="warning" :class="{ active : errorPtp }">펫 종류를 입력하세요.</div>
          </div>
          <div class="notice">전화번호는 회원님의 질문에 대한 답변과 입원한 환자에 대한 정보를 더 쉽게 제공하기 위한 용도로만 사용됩니다.</div>
          <div class="btn_wrap">
            <button class="button" type="submit" :disabled="check_final">가입</button>
            <button class="button" @click="goBack">뒤로가기</button>
          </div>
        </form>
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
      user_nm: '',
      user_ph: '',
      pet_no: '',
      pet_nm: '',
      pet_age: '',
      pet_sex: [],
      pet_type: '',
      message: '',

      user_pw_ck: '',
      errorUid: undefined,
      errorDup: undefined,
      errorUpw: undefined,
      errorUpw2: undefined,
      errorUnm: undefined,
      errorUph: undefined,
      errorPno: undefined,
      errorPnm: undefined,
      errorPag: undefined,
      errorPsx: undefined,
      errorPtp: undefined,

      min_uid: 3,
      max_uid: 20,
      min_upw: 8,
      min_uph: 10,
      max_uph: 11,
      max_pno: 15,
    }
  },
  computed: {
    check_final() {
      const fields = ['errorUid', 'errorDup', 'errorUpw', 'errorUpw2', 'errorUnm', 'errorUph', 'errorPno', 'errorPnm', 'errorPag', 'errorPsx', 'errorPtp'];
      for (let check=0; check<fields.length; check++) {
        if (this[fields[check]] === undefined || this[fields[check]]) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    onSubmitForm() {
      if (!this.validationCheck()) {
        return;
      }
      axios({
        url: "http://localhost:3000/auth/join_process",
        method: "POST",
        data: {
          user_id: this.user_id,
          user_pw: this.user_pw,
          user_nm: this.user_nm,
          user_ph: this.user_ph,
          pet_no: this.pet_no,
          pet_nm: this.pet_nm,
          pet_age: this.pet_age,
          pet_sex: this.pet_sex,
          pet_type: this.pet_type,
          user_pw_eye: '',
          user_pw_ck_eye: '',
        },
      })
      .then(res => {
        if (res.data.message == 'already_exist_id') {
          this.$swal({
            icon: 'warning',
            title: '이미 존재하는 아이디입니다.'
          })
        }
        else if (res.data.message == 'DB_error') {
          this.$swal({
            icon: 'error',
            title: 'DB 에러 발생'
          })
        }
        else {
          this.$router.push({ path: '/join3' });
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    validationCheck() {
      if (this.errorUid == true) {
        this.$swal('아이디조건불충족');
        return false;
      }

      if (this.errorUpw == true) {
        this.$swal('비밀번호조건불충족');
        return false;
      }

      if (this.errorUpw2 == true) {
        this.$swal('비밀번호확인조건불충족');
        return false;
      }

      if (this.errorUnm == true) {
        this.$swal('이름조건불충족');
        return false;
      }

      if (this.errorUph == true) {
        this.$swal('전화번호조건불충족');
        return false;
      }

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
    validateInput(input, field) { //숫자 이외의 문자 제거
      this[field] = input.replace(/\D/g, '');
    },
    goBack() {
      this.$router.go(-1);
    },
    checkUid() {
      const validateUid = /^\s*(?=.*[a-z])(?=.*\d)[a-z\d\s]{3,20}\s*$/i;
      this.user_id = this.user_id.replace(/\s+/g, '');
      if (this.user_id === '') {
        this.errorUid = undefined
        this.errorDup = undefined
        this.message = ""
      } else if (validateUid.test(this.user_id)) {
        this.errorUid = false
      } else {
        this.errorUid = true
      }
    },
    checkDuplicate(event) {
      event.stopPropagation();  //중복확인 버튼 클릭시 부모 @submit.prevent="onSubmitForm"가 같이 실행되는데 이를 방지하기 위함
      axios({
        url: "http://localhost:3000/auth/idcheck",
        method: "POST",
        data: {
          user_id: this.user_id,
        },
      })
      .then(response => {
        if (response.data === '중복') {
          this.message = '중복된 아이디입니다.'
          this.user_id = ''
          this.errorDup = true
        } else if (response.data === '확인') {
          this.message = '사용 가능한 아이디입니다.'
          this.errorDup = false
        } else {
          console.log("중복체크고장")
          this.errorDup = true
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    warningDup() {
      if (this.errorUid) {
        this.message = '';
        this.errorDup = undefined;
      }
    },
    checkUidControl() {
      this.warningDup();
      this.checkUid();
    },
    checkUpw() {
      const validateUpw = /^\s*(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}\s*$/;
      if (this.user_pw === '') {
        this.errorUpw = undefined
      } else if (validateUpw.test(this.user_pw)) {
        this.errorUpw = false
      } else {
        this.errorUpw = true
      }
    },
    checkUpw1() {
      this.checkUpw();
      this.checkUpw2();
    },
    checkUpw2() {
      if (this.user_pw_ck === '') {
        this.errorUpw2 = undefined
        console.log(this.errorUpw2);
      } else if (this.user_pw_ck === this.user_pw) {
        this.errorUpw2 = false;
        console.log(this.errorUpw2);
      } else {
        this.errorUpw2 = true;
        console.log(this.errorUpw2);
      }
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
    checkUnm() {

      if (this.user_nm !== '') {
        this.errorUnm = false;
      } else {
        this.errorUnm = true;
      }
    },
    checkUph() {
      const validateUph = /^[0-9]{10,11}$/
      this.validateInput(this.user_ph, 'user_ph');

      if (validateUph.test(this.user_ph) && this.user_ph) {
        this.errorUph = false;
      } else {
        this.errorUph = true;
      }
    },
    checkPno() {
      const validatePno = /^[0-9]{15,}$/
      this.validateInput(this.pet_no, 'pet_no');

      if (validatePno.test(this.pet_no) && this.pet_no) {
        this.errorPno = false;
      } else {
        this.errorPno = true;
      }
    },
    checkPnm() {
      if (this.pet_nm !== '') {
        this.errorPnm = false;
      } else {
        this.errorPnm = true;
      }
    },
    checkPag() {
      this.validateInput(this.pet_age, 'pet_age');
      
      if (this.pet_age !== '') {
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
      if (this.pet_type !== '') {
        this.errorPtp = false;
      } else {
        this.errorPtp = true;
      }
    },
  },

}
</script>
<style src="../assets/css/profileInput.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.prog {
  font-size: var(--font-regular);
}

.prog .inactive {
  color: var(--color-gray);
  font-weight: 400;
}

.prog .now {
  font-size: 18px;
  font-weight: 500;
}

.prog .fa-solid {
  margin: 0 10px;
}

.join_wrap {
  width: 600px;
  margin: 50px auto;
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

.input_id {
  width: 400px;
  display: flex;
}

.id_check {
  padding: 10px;
  word-break: keep-all;
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
}

.id_check:disabled {
  cursor: initial;
}

.id_check:not(:disabled):hover {
  color: var(--color-orange);
  text-shadow: 0 0 10px var(--color-lightorange);
}

.warning_id {
  width: 400px;
  display: flex;
  justify-content: space-between;
}

.warning_id>.warning {
  width: auto !important;
}

.warning {
  width: 400px;
}

.notice {
  color: var(--color-dark);
  margin: 50px 100px;
  word-break: keep-all;
  text-align: center;
}

.input_row input:not([type=radio]):not([type=checkbox]) {
  width: 400px;
}

.input_row {
  position: relative;
}

.input_row #pw,
.input_row #pw_check {
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
  display: flex;
  justify-content: space-between;
}

.btn_wrap .button:first-child:disabled:hover {
  box-shadow: none;
}
</style>