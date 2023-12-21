<template>
  <body>
    <div class="header_wrapper">
      <nav class="navbar_top" aria-label="">
        <div class="navbar_logo title" @click="goToHome()">
          <img src="../assets/logo.png" alt="로고">
        </div>

        <div class="navbar_search">
          <input v-model="keyword" type="text" placeholder="검색" @keyup.enter="searchKeyword(keyword)">
          <button class="searchbtn" type="submit" @click="searchKeyword(keyword)"><img src="../assets/ch_ico.png"
              alt="search"></button>
        </div>

        <!-- 추가 -->
        <ul class="navbar_icons">
          <li class="myPage" @click="goToMypage()"><img src="../assets/mypage.png" alt="mypage"></li>
          <li class="cart" @click="goToCart()"><img src="../assets/cart.png" alt="cart">
            <transition-group name="fade" mode="out-in">
              <div class="cartcount" v-if="cartCoun !== 0">{{ cartCoun }}</div>
            </transition-group>
          </li>
          <li class="qna" @click="goToQna()"><img src="../assets/Qna.png" alt="qna"></li>
        </ul>

      </nav>

      <nav class="navbar_bottom" aria-label="">
        <ul class="category">
          <li @click="goToCategory(1)">사료</li>
          <li @click="goToCategory(2)">간식</li>
          <li @click="goToCategory(3)">용품</li>
          <li @click="goToCategory(4)">의류</li>
        </ul>

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
      cartCoun: 0,                  //추가
      adminCheck: 0,
      keyword: this.$route.query.keyword,
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  created() {                       //추가
    if (this.user.user_id != '') {
      this.getCartCount();
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
    hideCartCount() {
      const cartCountElement = document.querySelector('.cartcount');
      if (cartCountElement) {
        cartCountElement.style.display = 'none';
      }
    },
    showCartCount() {
      const cartCountElement = document.querySelector('.cartcount');
      if (cartCountElement) {
        cartCountElement.style.display = 'block';
      }
    },
    searchKeyword(keyword) {
      if (this.keyword) {
        window.location.href = 'http://localhost:8080/goodsSearch?keyword=' + keyword;
      }
    },
    //추가
    async getCartCount() {
      try {
        const response = await axios.get(`http://localhost:3000/goods/basketList/${this.user.user_no}`);
        const basketList = response.data;
        this.cartCoun = basketList.length;

        // 데이터가 0일 때 숨기기
        if (this.cartCoun === 0) {
          this.hideCartCount();
        } else {
          this.showCartCount();
        }
      } catch (error) {
        console.error(error);
      }

    },
    goToQna() {
      window.location.href = `http://localhost:8080/qnaMain?page=1`;
    },
    async goToCategory(category) {
      try {
        window.location.href = `http://localhost:8080/goodsCate/${category}`;

      } catch (error) {
        console.error('전송 실패:', error);
      }
    },
    goToLogin() {
      this.$router.push({ path: '/login' });
    },
    goToJoin() {
      this.$router.push({ path: '/joinselect' });
    },
    goToAdmin() {
      this.$router.push({ path: '/admin/goodslist' });
    },
    goToMypage() {
      this.$router.push({ path: '/mypage' });
    },
    goToCart() {
      this.$router.push({ path: '/basket' });
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
.title {
  cursor: pointer;
}

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
  font-family: 'GmarketSansMedium';
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
  scale: 70%;
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
  font-family: 'GmarketSansMedium';
  border: none;
  margin-right: 8px;
}

input[type='text']:focus {
  caret-color: rgb(0, 0, 0);
}

input::placeholder {
  color: #aaa;
}

.searchbtn {
  display: flex;
  border: 0;
  height: 38px;
  width: 50px;
  position: relative;
  background: none;
  cursor: pointer;
}

.searchbtn img {
  position: relative;
  top: -3px;
  scale: 70%;
}

/* --------------------------------- icon */
.navbar_icons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  scale: 80%;
  position: relative;
}

.myPage {
  scale: 75%;
  margin-left: 16px;
}

.cart {
  scale: 78%;
  margin-left: 24px;
}

.cart .cartcount {
  position: absolute;
  width: 32px;
  height: 22px;
  top: -10px;
  right: -12px;
  padding: 5px 0px 4px 0px;
  font-size: 1rem;
  font-family: GmarketSansMedium;
  text-align: center;
  box-sizing: content-box;
  border-radius: 30px;
  color: #fff;
  background: #ff5e00;
}

/* .fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease-in-out; }
.fade-enter, .fade-leave-to {
  opacity: 0;
} */

.qna {
  scale: 100%;
  margin-left: 16px;
}

.myPage:hover {
  filter: opacity(0.2) drop-shadow(0 0 0 #df7a00);
}

.cart:hover {
  filter: opacity(0.2) drop-shadow(0 0 0 #df7a00);
}

.qna:hover {
  filter: opacity(0.2) drop-shadow(0 0 0 #df7a00);
}

/* ----------------------------navbar_bottom */
.navbar_bottom {
  justify-content: space-between;
  align-items: center;
  display: flex;
  height: 60px;
  font-family: 'GmarketSansMedium';
}

.category {
  display: flex;
  position: relative;
  margin: auto;
}

/* 사료, 간식, 용품 */
.category li {
  font-size: 1rem;
  display: inline-block;
  margin-left: 30PX;
  width: 8rem;
  height: 30px;
  margin-top: 16px;
  text-align: center;
}

.category li:nth-last-child(4) {
  margin-left: 0px;
}

.category li:hover {
  cursor: pointer;
}

.category li:after {
  display: block;
  width: 4rem;
  content: '';
  border-bottom: solid 2px #fff;
  transform: scaleX(0);
  transition: transform 250ms ease-in-out;
  border: 1.5px solid #FFAF7D;
  margin: auto;
  margin-top: 6PX;
  border-radius: 30PX;
}

.category li:hover:after {
  transform: scaleX(1);
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
    scale: 70%;
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