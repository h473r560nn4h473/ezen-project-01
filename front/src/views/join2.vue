<template>
  <body>
    <div class="join_onhead">
      <h1>회원가입</h1>
      <div class="progress">
        <span class="inactive">01.약관동의 </span>
        <i class="fa-solid fa-caret-right"></i>
        <span class="now"> 02.정보입력 </span>
        <i class="fa-solid fa-caret-right"></i>
        <span class="inactive"> 03.가입완료</span>
      </div>
    </div>
    <div class="join_wrap">
      <div class="vital"><span class="red">*</span> 별표 표시된 항목들은 필수 항목입니다.</div>
      <div class="background" @submit.prevent="onSubmitForm">
        <form id="sendForm">
          <h2>보호자 정보</h2>
          <div class="input_row">
            <label for="id" class="item">아이디 <span class="red">*</span></label>
            <input type="text" id="id" v-model="user_id" :minlength="min_uid" :maxlength="max_uid" placeholder="영문, 숫자 조합 3~20자"/>
            <button @click.prevent="checkDuplicate($event)">중복확인</button>
          </div>
          <div class="warning_row"><p class="warning" v-show="errorUid">영문, 숫자 조합 3~20자</p></div>
          <div class="warning_row"><p class="warning">{{ message }}</p></div>
          <div class="input_row">
            <label for="pw" class="item">비밀번호 <span class="red">*</span></label>
            <input type="password" id="pw" v-model="user_pw" :minlength="min_upw" placeholder="영문, 숫자, 특수문자 조합 8자 이상" />
          </div>
          <div class="warning_row"><p class="warning" v-show="errorUpw">영문, 숫자, 특수문자 조합 8자 이상</p></div>
          <div class="input_row">
            <label for="pw_check" class="item">비밀번호 확인 <span class="red">*</span></label>
            <input type="password" id="pw_check" v-model="user_pw_ck" placeholder="비밀번호 재입력" />
          </div>
          <div class="warning_row"><p class="warning" v-show="errorUpw2">비밀번호가 일치하지 않습니다.</p></div>
          <div class="input_row">
            <label for="name" class="item">이름 <span class="red">*</span></label>
            <input type="text" id="name" v-model="user_nm" />
          </div>
          <div class="warning_row"><p class="warning" v-show="errorUnm">이름을 입력하세요.</p></div>
          <div class="input_row">
            <label for="tel" class="item">전화번호 <span class="red">*</span></label>
            <input type="tel" id="tel" @input="validatePhoneNumber" v-model="user_ph" :minlength="min_uph" :maxlength="max_uph"/>
          </div>
          <div class="warning_row"><p class="warning" v-show="errorUph">전화번호를 입력하세요.</p></div>
          <h2>펫(반려동물) 정보</h2>
          <div class="input_row">
            <label for="pet_no" class="item">동물등록번호 <span class="red">*</span></label>
            <input type="text" id="pet_no" @input="validatePetNumber" v-model="pet_no" :maxlength="max_pno" placeholder = "숫자 15자리">
          </div>
          <div class="warning_row"><p class="warning" v-show="errorPno">숫자 15자리</p></div>
          <div class="input_row">
            <label for="pet_nm" class="item">펫 이름 <span class="red">*</span></label>
            <input type="text" id="pet_nm" v-model="pet_nm">
          </div>
          <div class="warning_row"><p class="warning" v-show="errorPnm">펫 이름을 입력하세요.</p></div>
          <div class="input_row">
            <label for="pet_age" class="item">펫 나이 <span class="red">*</span></label>
            <input type="text" id="pet_age" @input="validatePetAge" v-model="pet_age" placeholder="숫자만">
          </div>
          <div class="warning_row"><p class="warning" v-show="errorPag">펫 나이를 입력하세요.</p></div>
          <div class="input_row">
            <div for="pet_sex" class="item">펫 성별 <span class="red">*</span></div>
            <div class="sel_wrap">
              <div class="sel_box">
                <label for="female" class="sel_sex">
                  <input type="radio" id="female" name="sex" v-model="pet_sex" :value="1" />
                  <span>암</span>
                </label>
              </div>
              <div class="sel_box">
                <label for="male" class="sel_sex">
                  <input type="radio" id="male" name="sex" v-model="pet_sex" :value="2" />
                  <span>수</span>
                </label>
              </div>
            </div>
          </div>
          <div class="warning_row"><p class="warning" v-show="errorPsx">펫 성별을 선택하세요.</p></div>
          <div class="input_row">
            <label for="pet_type" class="item">펫 종류 <span class="red">*</span></label>
            <input type="text" id="pet_type" v-model="pet_type" />
          </div>
          <div class="warning_row"><p class="warning" v-show="errorPtp">펫 종류를 선택하세요.</p></div>
          <div class="notice">전화번호는 회원님의 질문에 대한 답변과 입원한 환자에 대한 정보를 더 쉽게 제공하기 위한 용도로만 사용됩니다.</div>
          <div class="btn_wrap">
            <button class="btn" type="submit" :disabled="check_final">가입</button>
            <button class="btn" @click="goBack">뒤로가기</button>
          </div>
        </form>
      </div>
    </div>
  </body>
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
      min_pno: 15,
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
        },
      })
      .then(res => {
        if (res.data.message == 'DB_error') {
          this.$swal("DB 에러 발생")
        }
        else {
          this.$router.push({ path: '/join3' }); // 회원가입3 화면으로 이동
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
    validatePhoneNumber() { //휴대전화번호 숫자만 입력가능
      this.validateInput(this.user_ph, 'user_ph');
    },
    validatePetNumber() { //동물등록번호 숫자만 입력가능
      this.validateInput(this.pet_no, 'pet_no');
    },
    validatePetAge() {  //동물연령 숫자만 입력가능
      this.validateInput(this.pet_age, 'pet_age');
    },
    goBack() {
      this.$router.go(-1)
    },
    checkUid() {
        const validateId = /^(?=.*[a-z])(?=.*\d)[a-z\d]{3,20}$/i;

        if (validateId.test(this.user_id) && this.user_id) {
          this.errorUid = false;
        } else {
          this.errorUid = true;
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
    checkUpw() {
      const validateUpw = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/

      if (validateUpw.test(this.user_pw) && this.user_pw) {
        this.errorUpw = false;
      } else {
        this.errorUpw = true;
      }
    },
    checkUpw2() {
      if (this.user_pw_ck && this.user_pw_ck === this.user_pw) {
        this.errorUpw2 = false;
      } else {
        this.errorUpw2 = true;
      }
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

      if (validateUph.test(this.user_ph) && this.user_ph) {
        this.errorUph = false;
      } else {
        this.errorUph = true;
      }
    },
    checkPno() {
      const validatePno = /^[0-9]{15,}$/

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
  watch: {
    user_id : function() {
      this.user_id = this.user_id.replace(/\s+/g, '');
      this.checkUid()
    },
    user_pw : function() {
      this.user_pw = this.user_pw.replace(/\s+/g, '');
      this.checkUpw()
    },
    user_pw_ck : function() {
      this.user_pw_ck = this.user_pw_ck.replace(/\s+/g, '');
      this.checkUpw2()
    },
    user_nm : function() {
      this.user_nm = this.user_nm.replace(/\s+/g, '');
      this.checkUnm()
    },
    user_ph : function() {
      this.user_ph = this.user_ph.replace(/\s+/g, '');
      this.checkUph()
    },
    pet_no : function() {
      this.pet_no = this.pet_no.replace(/\s+/g, '');
      this.checkPno()
    },
    pet_nm : function() {
      this.pet_nm = this.pet_nm.replace(/\s+/g, '');
      this.checkPnm()
    },
    pet_age : function() {
      this.pet_age = this.pet_age.replace(/\s+/g, '');
      this.checkPag()
    },
    pet_sex : function() {
      this.checkPsx()
    },
    pet_type : function() {
      this.pet_type = this.pet_type.replace(/\s+/g, '');
      this.checkPtp()
    },
  }
}


</script>

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

.progress {
  font-size: var(--font-regular);
}

.progress .inactive {
  color: var(--color-gray);
  font-weight: 400;
}

.progress .now {
  font-size: var(--font-medium);
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

h2 {
  font-size: var(--font-medium);
  font-weight: 500;
  margin-bottom: 30px;
}

.input_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input_row .item {
  font-size: var(--font-emp);
  width: 200px;
}

.input_row>input {
  width: 400px;
  height: 50px;
  border-radius: 25px;
  border: var(--color-dark) 1px solid;
  padding-left: 20px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-regular);
}

.input_row>input:focus {
  outline: 2px solid var(--color-lightorange);
}

.warning_row {
  margin-top: 1px;
  width: 100%;
  margin-bottom: 30px;
  display: flex;
  justify-content: right;
}

.warning {
  width: 400px;
  color: var(--color-red);
}

.sel_wrap {
  width: 400px;
  height: 50px;
  display: flex;
  align-items: center;
}

.sel_box {
  display: block;
  width: 50%;
}

.sel_sex {
  font-size: var(--font-emp);
  display: flex;
  justify-content: left;
  align-items: center;
  width: 60px;
  cursor: pointer;
}

.sel_sex input[type="radio"] {
  margin-right: 5px;
}

.sel_sex span {
  margin-bottom: 3px;
}

.notice {
  color: var(--color-dark);
  margin: 30px 50px;
}

.btn_wrap {
  margin: 0 auto;
  width: 70%;
  display: flex;
  justify-content: space-between;
}

</style>