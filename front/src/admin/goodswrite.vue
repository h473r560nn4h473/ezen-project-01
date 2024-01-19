<template>
  <main>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
      crossorigin="anonymous"
    />
    <div class="container goods_add wrap">
      <div class="title">
        <h1>제품 등록</h1>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label"
          ><span class="bar"></span>제품명 *</label
        >
        <div class="col-md-9">
          <input type="text" class="form-control" v-model="goods_nm" required />
        </div>
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label"
          ><span class="bar"></span>제품 가격 *</label
        >
        <div class="col-md-9">
          <div class="input-group">
            <input
              type="number"
              step="10"
              class="form-control"
              v-model="goods_price"
              @input="bindNumber"
              required
            />
            <span class="input-group-text">원</span>
          </div>
        </div>
      </div>
      <div class="mb-5 row">
        <label class="col-md-3 col-form-label"
          ><span class="bar"></span>상품 이미지 *
        </label>
        <div class="col-md-9">
          <input
            type="file"
            class="form-control"
            accept="image/png, image/jpg, image/jpeg"
            @change="onFileChange"
            required
          />
          <!-- type 0 메인-->
          <div class="alert alert-secondary" role="alert">
            <ul>
              <li>이미지 사이즈 : 700*700</li>
              <li>파일 사이즈 : 1M 이하</li>
              <li>파일 확장자 : png, jpg, jpeg만 가능</li>
            </ul>
          </div>
          <div class="mt-3 img_frame" v-show="previewImage">
            <img :src="previewImage" v-if="previewImage" />
          </div>
        </div>
      </div>
      <div class="row btn-row">
        <button
          type="button"
          class="btn btn-lg btn-danger"
          @click="submitForm()"
        >
          저장하기
        </button>
        <button type="button" class="btn btn-lg btn-light" @click="goToList">
          취소하기
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      goods_nm: "",
      goods_price: 0,
      goods_img: null,
      previewImage: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    if (this.user.user_no == "") {
      // 일단은 로그인 상태 체크
      this.$swal("관리자 외 접근제한 페이지입니다.");
      this.$router.push({ path: "/login" });
    } else {
      axios({
        url: "http://localhost:3000/auth/admin_check",
        method: "POST",
        data: {
          user_no: this.user.user_no,
        },
      })
        .then((res) => {
          if (res.data.message == "admin") {
            console.log(res.data.message);
          } else if (res.data.message == "user") {
            this.$swal("관리자 외 접근제한 페이지입니다.");
            this.$router.push({ path: "/" });
          }
        })
        .catch(() => {
          this.$swal("접속 오류");
        });
    }
  },
  methods: {
    onFileChange(e) {
      //alert가 출력되어 확인을 눌렀을 때 브라우저에서 [Violation] 'change' handler took *ms 경고 발생하는데 alert 창이 켜져있었다는 수준의 경고이므로 무시해도 됨
      const file = e.target.files[0];
      if (!file) {
        //파일을 한번 첨부한 후 다시 파일첨부를 눌러 취소버튼을 누를 경우 size가 undefined로 변경되어 발생하는 에러를 처리하기 위함
        console.log("파일첨부취소");
        e.target.value = "";
        return;
      } else if (file.size > 3 * 1024 * 1024) {
        alert("용량이 3MB 이하인 파일만 업로드하실 수 있습니다.");
        e.target.value = "";
        return;
      }
      this.goods_img = file;
      this.previewImage = URL.createObjectURL(this.goods_img);
    },
    submitForm() {
      if (!this.validationCheck()) {
        return;
      }
      const formData = new FormData();
      formData.append("goods_nm", this.goods_nm);
      formData.append("goods_price", this.goods_price);
      formData.append("goods_img", this.goods_img);
      axios
        .post("http://localhost:3000/goods/admin/add_goods", formData)
        .then((res) => {
          if (res.data === "success") {
            this.$swal({
              icon: "success",
              title: "제품 등록 성공!",
            }).then(() => {
              window.location.href = "http://localhost:8080/admin/goodslist";
            });
          } else {
            this.$swal({
              icon: "error",
              title: "제품 등록 실패",
            });
          }
        })
        .catch(() => {
          this.$swal({
            icon: "error",
            title: "오류 발생",
          });
        });
    },
    bindNumber(event) {
      this.goods_price = event.target.value.replace(/[^0-9]/g, "");
    },
    validationCheck() {
      if (this.goods_nm == "") {
        this.$swal("제품명은 필수 입력값입니다.");
        return false;
      }
      if (this.goods_price == "" || this.goods_price == 0) {
        this.$swal("제품 가격을 입력하세요.");
        return false;
      }
      if (this.goods_img == "") {
        this.$swal("제품 메인 이미지를 등록해주세요.");
        return false;
      }
      return true;
    },
    goToList() {
      this.$swal({
        title: "제품 등록을 취소하겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "닫기",
        confirmButtonColor: "var(--color-orange)",
        cancelButtonColor: "var(--color-gray)",
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push({ path: "/admin/goodslist" });
          // 나중엔 제품 목록 리스트로 돌아가게 수정하기
        }
      });
    },
  },
};
</script>
<style src="../assets/css/admin.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";
</style>
