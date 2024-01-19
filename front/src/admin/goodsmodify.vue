<template>
  <main class="mt-3">
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
      crossorigin="anonymous"
    />
    <div class="container goods_update wrap">
      <div class="title">
        <h1>제품 수정</h1>
      </div>
      <div class="mb-5 img_frame" v-if="goods.GOODS_IMG">
        <img
          :src="
            require(`../../../back/uploads/uploadGoods/` + `${goods.GOODS_IMG}`)
          "
          alt="상품 이미지"
        />
      </div>
      <div class="mb-3 row">
        <label class="col-md-3 col-form-label"
          ><span class="bar"></span>제품명 *</label
        >
        <div class="col-md-9">
          <input type="text" class="form-control" v-model="goods.GOODS_NM" />
        </div>
      </div>
      <div class="mb-5 row">
        <label class="col-md-3 col-form-label"
          ><span class="bar"></span>제품 가격 *</label
        >
        <div class="col-md-9">
          <div class="input-group">
            <input
              type="number"
              step="10"
              class="form-control"
              v-model="goods.GOODS_PRICE"
              @input="bindNumber"
            />
            <span class="input-group-text">원</span>
          </div>
        </div>
      </div>
      <div class="row btn-row">
        <button
          type="button"
          class="btn btn-lg btn-danger"
          @click="onSubmitModify"
        >
          수정하기
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
      goods: {},
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    axios({
      url: "http://localhost:3000/goods/admin/goodsmodify",
      method: "POST",
      data: {
        goods_no: this.$route.query.goods_no,
      },
    })
      .then((response) => {
        console.log(response.data);
        this.goods = response.data[0];
      })
      .catch((error) => {
        alert(error);
      });
    if (this.user.user_no == "") {
      this.$swal({
        icon: "warning",
        title: "관리자 외 접근제한 페이지입니다.",
      });
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
          if (res.data.message == "user") {
            this.$swal({
              icon: "warning",
              title: "관리자 외 접근제한 페이지입니다.",
            });
            this.$router.push({ path: "/" });
          }
        })
        .catch(() => {
          this.$swal({
            icon: "error",
            title: "접속 오류",
          });
        });
    }
  },
  methods: {
    onSubmitModify() {
      axios
        .post("http://localhost:3000/goods/admin/update_goods", {
          GOODS_NO: this.goods.GOODS_NO,
          GOODS_NM: this.goods.GOODS_NM,
          GOODS_PRICE: this.goods.GOODS_PRICE,
        })
        .then((response) => {
          if (response.data.message == "modify_complete") {
            this.$swal({
              icon: "success",
              title: "상품 내용이 수정되었습니다.",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              this.$router.push("/admin/goodslist");
            });
          } else if (response.data.message == "modify_failed") {
            this.$swal({
              icon: "error",
              title: "파일 변경 실패",
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
      this.goods.GOODS_PRICE = event.target.value.replace(/[^0-9]/g, "");
    },
    goToList() {
      this.$swal({
        title: "제품 수정을 취소하겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "확인",
        cancelButtonText: "취소",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
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
