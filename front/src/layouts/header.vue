<template>
  <body>
    <div class="header_wrapper">
      <nav class="navbar_top" aria-label="">
        <div class="navbar_logo title" @click="goToHome()">
          <img :src="require(`../assets/logo.png`)" alt="로고">
        </div>
        <!-- 추가 -->
        <ul class="navbar_icons">
          <li @click="goToNReview()">진료기록</li>
        </ul>

      </nav>

      <nav class="navbar_bottom" aria-label="">
        <ul v-if="user.user_id == ''" class="join">
          <li @click="goToLogin">로그인</li>
          <li @click="goToJoin">회원가입</li>
        </ul>

        <ul v-else-if="adminCheck == 1" class="join">
          <li @click="goToAdmin">관리 페이지</li>
          <li @click="logout">로그아웃</li>
        </ul>

        <ul v-else class="join">
          <li @click="logout">로그아웃</li>
        </ul>
      </nav>
    </div>
  </body>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      adminCheck: 0,
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    if (this.user.user_id == '') {
      // 일단은 로그인 여부 체크 
    }
    else {
      axios({
        url: "http://localhost:3000/auth/admin_check",
        method: "POST",
        data: {
          user_no: this.user.user_no,
        },
      })
        .then(res => {
          if (res.data.message == 'admin') {
            this.adminCheck = 1;
          }
        })
        .catch(() => {
          this.$swal("접속 오류");
        })
    }
  },
  methods: {
    goToNReview() {
      window.location.href = `http://localhost:8080/review`;
    },
    goToLogin() {
      this.$router.push({ path: '/login' });
    },
    goToJoin() {
      this.$router.push({ path: '/joincond' });
    },
    goToAdmin() {
      this.$router.push({ path: '/admin/userlist' });
    },
    logout() {
      this.$store.commit("user", {});
      this.$swal({
        position: 'top',
        icon: 'success',
        title: '로그아웃되셨습니다.',
        showConfirmButton: false,
        timer: 1000
      })
        .then(() => {
          window.location.href = "http://localhost:8080";
        })
    },
    goToHome() {
      window.location.href = "http://localhost:8080";
    }
  }
}

</script>
  
<style scoped>
* {
  margin: 0;
  padding: 0;
}

ul,
li {
  list-style: none;
}

a {
  text-decoration: none;
}

.header_wrapper {
  font-size: 15px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 4px 5px -4px rgb(219, 219, 219);
}

.navbar_top {
  display: flex;
  height: 90px;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  --bs-navbar-padding-x: 0;
}

/* ------------------------------------------------------ logo */
.navbar_logo {
  scale: 50%;
  position: relative;
  left: -60px;
  padding: 0 0 0 16px;
}

/* ------------------------------------------------------ search */
.navbar_search {
  display: flex;
  width: 30rem;
  max-width: 100%;
  border-radius: 200px;
  outline: rgb(237, 237, 237) solid 2px;
  background-color: rgb(251, 251, 251);
  position: relative;
  right: 6%;
  padding-left: 20px;
}

input[type='text'] {
  width: 100%;
  font-size: 1rem;
  outline: none;
  background-color: rgb(251, 251, 251);
  border: none;
  margin-right: 8px;
}

input[type='text']:focus {
  caret-color: rgb(0, 0, 0);
}

input::placeholder {
  color: #aaa;
}

/* ----------------------------navbar_bottom */
.navbar_bottom {
  justify-content: space-between;
  align-items: center;
  display: flex;
  height: 60px;
}

/* 관리, 로그아웃 */
.join {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.join li {
  margin-left: 30px;
  width: 120px;
  height: 6px;
  line-height: 0px;
  text-align: center;
  padding: 8px 0;
  margin-top: 14px;
}

.join li:nth-child(1) {
  margin-left: 0px;
}

.join li:hover {
  color: #ee8700;
  cursor: pointer;
}

/* --------------------------------------------------------------------------------------------------------------- */


@media screen and (max-width: 768px) {

  * {
    padding: 0;
    margin: 0;
  }

  /* --------- logo */

  .header_wrapper {
    min-height: 150px;
  }

  .navbar_top {
    display: flex;
    justify-content: space-between;
    padding: 0;
    --bs-navbar-padding-x: 0;
  }

  .navbar_logo {
    scale: 50%;
    position: relative;
  }

  .navbar_search {
    display: none;
  }

  .navbar_icons {
    scale: 70%;
  }

  .navbar_bottom {
    display: flex;
    margin-left: auto;
    justify-content: space-between;
  }

  .navbar_bottom .join {
    display: none;
  }
}</style>