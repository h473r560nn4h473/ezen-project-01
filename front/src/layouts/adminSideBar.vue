<template>
  <nav>
    <div class="icon-bar admin-bar">
      <router-link to="/">
        <i class="fa-solid fa-home"></i>
        <p>홈페이지</p>
      </router-link>
      <router-link to="/admin/userlist">
        <i class="fa-solid fa-user-circle"></i>
        <p>회원 관리</p>
      </router-link>
      <router-link to="/admin/reviewlist">
        <i class="fa-solid fa-file-medical"></i>
        <p>진료 기록 관리</p>
      </router-link>
      <router-link to="/admin/qnalist">
        <i class="fa-solid fa-question"></i>
        <p>문의 사항 관리</p>
      </router-link>
      <router-link to="/admin/reservationlist">
        <i class="fa-solid fa-calendar-days"></i>
        <p>예약 관리</p>
      </router-link>
      <router-link to="/admin/goodslist">
        <i class="fa-solid fa-boxes-stacked"></i>
        <p>상품 관리</p>
      </router-link>
      <button type="button" class="big_red_btn" @click="logout">
        로그아웃
      </button>
    </div>
  </nav>
</template>
<script>
export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    logout() {
      this.$store.commit("user", {});
      this.$swal({
        icon: "success",
        title: "로그아웃되셨습니다.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        window.location.href = "http://localhost:8080";
      });
    },
  },
};
</script>
<style scoped>
a.router-link-active {
  background-color: #858585;
}

.big_red_btn {
  font-size: var(--font-regular);
  padding: 15px;
  line-height: 1;
  background-color: var(--color-red);
  color: var(--color-white);
  border: none;
  border-radius: 4px;
  margin: 20px auto;
  display: block;
  transition: all 0.2s ease-out;
}

.big_red_btn:hover {
  background-color: rgba(255, 83, 83, 0.8);
  box-shadow: 0 0 10px -3px var(--color-white);
  transition: all 0.2s ease-out;
}

.admin-bar p {
  margin: auto;
  font-size: 14px;
}

.admin-bar {
  height: 100vh;
  width: 100px;
  background-color: #555;
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
}

.admin-bar a {
  display: block;
  text-align: center;
  padding-top: 18px;
  padding-bottom: 18px;
  transition: all 0.3s ease;
  color: white;
  text-decoration: none;
  font-size: 18px;
}

.admin-bar a:hover {
  background-color: #858585;
}

.active {
  background-color: #5eaf13;
}
</style>
