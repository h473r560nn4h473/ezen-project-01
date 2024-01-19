<template>
  <main>
    <div class="title">
      <h1>내 정보 수정</h1>
    </div>    
    <div class="wrap">      
      <div class="input_row">
        <label for="name" class="item"><div class="bar"></div>이름</label>
        <input type="text" id="name" v-model="doctor.DOC_NM" />
      </div>
      <div class="input_row">
        <label for="age" class="item"><div class="bar"></div>나이</label>
        <input type="text" id="age" v-model="doctor.DOC_AGE" />
      </div>
      <div class="input_row">
        <label for="tel" class="item"><div class="bar"></div>전화번호</label>
        <input type="text" id="tel" @input="validatePhoneNumber" v-model="doctor.DOC_PH" />
      </div>
      <div class="input_row">
        <label for="email" class="item"><div class="bar"></div>이메일</label>
        <input type="email" id="email" v-model="doctor.DOC_EML" />
      </div>
      <div class="input_row">
        <label for="year" class="item"><div class="bar"></div>약력</label>
        <input type="text" id="year" v-model="doctor.DOC_BIO" />
      </div>
      <div class="input_row">
        <label for="major" class="item"><div class="bar"></div>전공</label>
        <input type="text" id="major" v-model="doctor.DOC_MJ" />
      </div>
      <div class="input_row">
        <div class="item"><div class="bar"></div>성별</div>
          <div class="radio_wrap">
            <div class="radio_box">
              <label for="male" class="radio_sex">
                <input type="radio" id="male" name="sex" v-model="doctor.DOC_SEX" :value="'M'" />
                <span>남</span>
              </label>
            </div>
            <div class="radio_box">
              <label for="female" class="radio_sex">
                <input type="radio" id="female" name="sex" v-model="doctor.DOC_SEX" :value="'F'" />
                <span>여</span>
              </label>
            </div>
          </div>
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
          doctor: {},
          gender: ""
      };
  },
  computed: {
      user() {
          return this.$store.state.user;
      }
  },
  mounted() {
      if (this.user.user_no === '') {
          this.$swal('로그인해주세요');
          this.$router.push({ path: '/login' });
      } else {
          axios
              .get('http://localhost:3000/mypage/getDocData', {
                  params: {
                      doc_id: this.user.user_id,
                  },
              })
              .then((res) => {
                  if (res.data.length > 0) {
                      this.doctor = res.data[0];
                      console.log(this.doctor);
                  }
              })
              .catch((err) => {
                  console.log(err);
              });
      }
  }, methods: {
      onSubmitForm() {
          if (this.doctor.DOC_NM === "" || this.doctor.DOC_AGE === "" || this.doctor.DOC_PH === "" || this.doctor.DOC_EML === "" || this.DOC_SEX === "") {
              this.$swal("모든 항목을 입력해주세요");
          } else {
              axios
                  .post('http://localhost:3000/mypage/docpage/update', {
                      //doc_pw: this.loginUser.doc_pw,
                      doc_nm: this.doctor.DOC_NM,
                      doc_age: this.doctor.DOC_AGE,
                      doc_ph: this.doctor.DOC_PH,
                      doc_eml: this.doctor.DOC_EML,
                      doc_bio: this.doctor.DOC_BIO,
                      doc_mj: this.doctor.DOC_MJ,
                      gender: this.doctor.DOC_SEX,
                      doc_id: this.user.user_id
                  })
                  .then((res) => {
                      if (res.data.message === 'docmypage_update') {
                          this.$swal("수정이 완료되었습니다");
                          this.$router.push({ path: '/docpage' });
                      } else {
                          this.$swal("수정에 실패했습니다.");
                      }
                  })
                  .catch((err) => {
                      console.log(err);
                      this.$swal("수정에 실패했습니다!");
                  });
          }
      },
      validatePhoneNumber() {
          this.doctor.DOC_PH = this.doctor.DOC_PH.replace(/\D/g, ''); // 숫자 이외의 문자 제거
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

.input_row {
margin-bottom: 30px;
}

.input_row input:not([type=radio]):not([type=checkbox]) {
width: 400px;
}
</style>
