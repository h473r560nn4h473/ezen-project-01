<template>
  <main>
    <div class="title">
      <h1>펫 정보 수정</h1>
    </div>
    <div class="wrap">
      <div class="img_form">
        <div class="img_frame">
          <label for="input_img" v-if="!loginUser.pet_img">
            <img src="../assets/imgempty.svg" alt="null">
          </label>
          <label for="input_img" v-else-if="loginUser.pet_img && img_change === 0">
            <img :src="require(`../../../back/uploads/uploadPet/${loginUser.pet_img}`)" alt="...">
          </label>
          <label for="input_img" v-else-if="img_change === 1">
            <img :src="previewImage" alt="...">
          </label>
        </div>
        <div class="txt_wrap">
          <span>*클릭 시 이미지를 변경 혹은 업로드합니다.</span>
          <span>이미지 형식은 png, jpeg, jpg만 지원합니다.</span>
          <span>추천 해상도 : 180px &times; 180px</span>
        </div>
        <input type="file" id="input_img" class="input_img" accept="image/png, image/jpeg, image/jpg" @change="uploadFile($event)">
      </div>
      <div class="input_row">
        <label for="name" class="item"><div class="bar"></div>이름</label>
        <input type="text" id="name" v-model="loginUser.pet_nm" />
      </div>
      <div class="input_row">
        <label for="age" class="item"><div class="bar"></div>나이</label>
        <input type="text" id="age" v-model="loginUser.pet_age" />
      </div>
      <div class="input_row">
        <label for="weight" class="item"><div class="bar"></div>몸무게</label>
        <input type="text" id="weight" v-model="loginUser.pet_wgt" />
      </div>
      <div class="input_row">
        <div class="item"><div class="bar"></div>성별</div>
          <div class="radio_wrap">
            <div class="radio_box">
              <label for="female" class="radio_sex">
                <input type="radio" id="female" name="sex" v-model="loginUser.pet_sex" :value="1" />
                <span>암</span>
              </label>
            </div>
            <div class="radio_box">
              <label for="male" class="radio_sex">
                <input type="radio" id="male" name="sex" v-model="loginUser.pet_sex" :value="2" />
                <span>수</span>
              </label>
            </div>
          </div>
      </div>
      <div class="input_row">
        <label for="type" class="item"><div class="bar"></div>종류</label>
        <input type="text" id="type" v-model="loginUser.pet_type" />
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
      loginUser: {},
      img_change: 0,
      previewImage: null,
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
        .get(`http://localhost:3000/mypage/getPetData/${this.user.user_no}`)
        .then((res) => {
          if (res.data.length > 0) {
            this.loginUser = res.data[0];
            console.log(this.loginUser);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, 
  methods: {
    // ▽ 수정한 부분 ▽
    uploadFile(e) {
      const file = e.target.files[0];
      if (!file) {
        console.log("파일첨부취소")
        e.target.value = '';
        return;
      } else if (file.size > 3 * 1024 * 1024) {
        alert('용량이 3MB 이하인 파일만 업로드하실 수 있습니다.');
        e.target.value = '';
        return;
      }
      this.loginUser.pet_img = file;
      this.previewImage = URL.createObjectURL(this.loginUser.pet_img);
      this.img_change = 1;
    },
    onSubmitForm() {
      if (this.loginUser.pet_nm === "" || this.loginUser.pet_age === "" || this.loginUser.pet_wgt === "" || this.loginUser.pet_sex === "" || this.loginUser.pet_type === "") {
        this.$swal("모든 항목을 입력해주세요");
      } else {
        const formData = new FormData();
        formData.append('user_no', this.user.user_no);
        formData.append('pet_nm', this.loginUser.pet_nm);
        formData.append('pet_age', this.loginUser.pet_age);
        formData.append('pet_wgt', this.loginUser.pet_wgt);
        formData.append('pet_sex', this.loginUser.pet_sex);
        formData.append('pet_type', this.loginUser.pet_type);
        if (this.loginUser.pet_img) {
          formData.append('pet_img', this.loginUser.pet_img);
        }
        axios.post('http://localhost:3000/mypage/petUpdate', formData).then((res) => {
          if (res.data === 'success') {
            this.$swal({
              icon: 'success',
              title: '펫정보가 수정되었습니다.',
              showConfirmButton: false,
              timer: 1500
            })
              .then(() => {
                this.$router.push({ path: '/mypage' });
                this.image_change = 0;
              })
          } else {
            this.$swal("펫정보 수정 실패");
          }
        })
          .catch(() => {
            this.$swal("오류 발생")
          })
      }
    },
    // △ 수정한 부분 △
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

.img_form {
margin-bottom: 50px;
display: flex;
justify-content: left;
align-items: end;
}

.img_form .img_frame label {
width: 100%;
height: 100%;
}

.img_form .input_img {
display: none;
}

.txt_wrap span {
display: block;
margin-top: 5px;
}

.input_row {
margin-bottom: 30px;
}

.input_row input:not([type=radio]):not([type=checkbox]) {
width: 400px;
}
</style>