<template>
  <main class="content_wrap">
    <div class="title">
      <h1>회원가입</h1>
      <div class="prog">
        <span class="inactive">01.약관동의</span>
        <i class="fa-solid fa-caret-right"></i>
        <span class="inactive">02.정보입력</span>
        <i class="fa-solid fa-caret-right"></i>
        <span class="now">03.가입완료</span>
      </div>
    </div>
    <div class="txt_wrap">
      <div class="img">
        <img src="../assets/dog-simple.svg" alt="회원가입완료">
      </div>
      <div class="txt">
        <p>회원가입이 완료되었습니다!</p>
        <p>이제 회원 전용 서비스를 이용할 수 있습니다.</p>
      </div>
      <div class="btn_wrap">
        <button class="button" @click="goLogin">로그인</button>
        <button class="button" @click="goMain">메인으로</button>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  methods: {
    goLogin() {
      this.$router.push({ path: "/login" })
    },
    goMain() {
      this.$router.push({ path: "/" })
    }
  }
}
</script>
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

.txt_wrap {
  width: 600px;
  margin: 50px auto;
}

.img {
  text-align: center;
  padding: 100px 0;
}

.txt {
  padding: 0 20px;
  margin-bottom: 70px;
}

.txt p {
  font-size: var(--font-medium);
  text-align: center;
}

.btn_wrap {
  display: flex;
  justify-content: space-around;
}
</style>