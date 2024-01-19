<template>
  <header>
    <div class="hBottom">
      <h1 @click="goToHome()"><img src="../assets/logo-color.svg" alt="펫테랑동물병원"></h1>
      <nav class="gnb">
        <ul>
          <li>
            <a class="mainNav">병원소개</a>
            <ul class="subNav">
              <li @click="goToGreetings()">인사말</li>
              <li @click="goToVetHistory()">병원연혁</li>
              <li @click="goToDocHistory()">의료진</li>
            </ul>
          </li>
          <li>
            <a class="mainNav">진료안내</a>
            <ul class="subNav">
              <li @click="goToSubject()">진료과목</li>
              <li @click="goToReview()">진료후기</li>
            </ul>
          </li>
          <li onclick="location.href='/qnaMain'"><a class="mainNav">QnA</a></li>
          <li @click="goToGoods()"><a class="mainNav">애완용품</a></li>
          <li v-if="user.user_id == ''" class="topMenu login" @click="goToLogin()">로그인</li>
          <li v-else class="topMenu login" @click="logout()">로그아웃</li>
          <li v-if="user.user_id == ''" class="topMenu join" @click="goToJoin()">회원가입</li>
          <li v-else-if="adminCheck == 1" class="topMenu join" @click="goToAdmin()">관리 페이지</li>
          <li v-else class="topMenu"></li>
          <li v-if="docCheck == 0" class="topMenu icon user" @click="goToMypage()"><img src="../assets/icon-mypage.svg" alt="마이페이지"></li>
          <li v-else class="topMenu icon user" @click="goToDocpage()"><img src="../assets/icon-mypage.svg" alt="의료진페이지"></li>
          <li class="topMenu icon res" @click="goToRes()"><img src="../assets/icon-reservation.svg" alt="진료 예약"></li>
        </ul>
      </nav>
    </div>
    <div class="subBg"></div>
  </header>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'

export default {
  data() {
    return {
      adminCheck: 0,
      docCheck: 0,
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
    } else {
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
        
      axios({
        url: "http://localhost:3000/auth/doc_check",
        method: "POST",
        data: {
          user_id: this.user.user_id,
        },
      })
        .then(res => {
          if (res.data.message == 'doc') {
            this.docCheck = 1;
          }
        })
        .catch(() => {
          this.$swal("접속 오류");
        })  
    }

    this.myfunction() 
      
  },
  methods: {
    myfunction() {
      var newBg = $('<div class="subBg"></div>');
    
      $('header').append(newBg);
      
      const gnb = '.gnb';
      const main = '.mainNav';
      const sub = '.subNav';
      const bg = '.subBg';
      const user = '.user';
      const res = '.res';
      
      $(gnb).hover(function(){
        $(sub + ', ' + bg).stop().slideDown('fast');
        $(main).removeClass('active');
      },function(){
        $(sub + ', ' + bg).stop().slideUp('fast');
        $(main).removeClass('active');
      });

      $(main).first().focus(function(){
        $(gnb).trigger('mouseenter');
        $(this).addClass('active');
      }); 
      
      $(main).focus(function(){
        $(main).removeClass('active');
        $(this).addClass('active');
      });

      $(main).first().keydown(function(e){
        if(e.keyCode == 9){
          if(e.shiftKey){
            $(gnb).trigger('mouseleave');
            $(this).removeClass('active');
          }
        }
      });
      
      $(sub).last().find('li:last a').keydown(function(e){
        if(e.keyCode == 9){
          if(!e.shiftKey){
            $(gnb).trigger('mouseleave');
            $(this).removeClass('active');
          }
        } 
      });
      $(sub).find('li:last a').focus(function(){
        $(main).removeClass('active');
        $(this).parents(sub).prev().addClass('active');
      });

      $(user).hover(
        function() {
          $(this).find('img').attr('src', require('../assets/icon-mypage-hover.svg'));
        },
        function() {
          $(this).find('img').attr('src', require('../assets/icon-mypage.svg'));
        }
      );
      $(res).hover(
        function() {
          $(this).find('img').attr('src', require('../assets/icon-reservation-hover.svg'));
        },
        function() {
          $(this).find('img').attr('src', require('../assets/icon-reservation.svg'));
        }
      )
    },
    goToHome() {
      this.$router.push({ path: '/' });
    },
    goToLogin() {
      this.$router.push({ path: '/login' });
    },
    goToJoin() {
      this.$router.push({ path: '/join1' });
    },
    goToAdmin() {
      this.$router.push({ path: '/admin/userlist' });
    },
    goToMypage() {
      this.$router.push({ path: '/mypage' });
    },
    goToDocpage() {
      this.$router.push({ path: '/docpage' });
    },
    goToRes() {
      this.$router.push({ path: '/docSelect' });
    },
    goToReview() {
      this.$router.push({ path: '/review' });
    },
    goToGoods() {
      this.$router.push({ path: '/goodsList' });
    },
    goToGreetings() {
      this.$router.push({ path: '/greetings' });
    },
    goToVetHistory() {
      this.$router.push({ path: '/vetHistory' });
    },
    goToDocHistory() {
      this.$router.push({ path: '/dochistory' });
    },
    goToSubject() {
      this.$router.push({ path: '/subject/intro1' });
    },
    logout() {
      this.$store.commit("user", {});
      this.$swal({
        icon: 'success',
        title: '로그아웃되셨습니다.',
        showConfirmButton: false,
        scrollbarPadding: false,
        timer: 1500
      })
        .then(() => {
          window.location.href = "http://localhost:8080";
        })
    }
  }
}
</script>

<style src="../assets/css/global.css" scoped />
<style scoped>

header {
  position: relative;
  height: 80px;
  z-index: 500;
  background-color: var(--color-white);
}

.hBottom {
  position: relative;
  max-width: 1374px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* logo */
.hBottom h1 {
  display: block;
  line-height: 0;
  cursor: pointer;
}

.hBottom h1 img {
  height: 50px;
}

/* gnb */
.gnb {
  height: 80px;
}

.gnb ul {
  display: flex;
  justify-content: right;
}

.gnb > ul > li {
  position: relative;
  float: left;
  width: 160px;
  height: 80px;
  line-height: 80px;
}

.gnb .mainNav {
  position: relative;
  display: block;
  height: 80px;
  text-align: center;
  color: #141414;
  font-size: 20px;
  font-weight: 700;
  cursor: default;
}

.gnb>ul>li:nth-child(1)>.subNav>li,
.gnb>ul>li:nth-child(2)>.subNav>li,
.gnb>ul>li:nth-child(3)>.mainNav,
.gnb>ul>li:nth-child(4)>.mainNav {
  cursor: pointer;
}

.gnb .mainNav:after {
  position: absolute;
  left: 0;
  bottom: 0;
  display: block;
  width: 160px;
  height: 13px;
  border-bottom: 3px solid var(--color-orange);
  box-sizing: border-box;
  content: '';
  transform: scaleX(0);
  transition: 0.2s;
}

.gnb li:hover .mainNav,
.gnb li:focus .mainNav {
  color: var(--color-orange);
}

.gnb li:hover .mainNav:after {
  transform: scaleX(1);
}

.gnb .mainNav.active {
  color: var(--color-orange);
}

/* subNav */
.gnb .subNav {
  display: none;
  position: absolute;
  top: 80px;
  left: 0;
  z-index: 5002;
  width: 100%;
  height: 150px;
  text-align: center;
  line-height: 48px;
}

.gnb .subNav li {
  display: inherit;
  width: 160px;
  height: 50px;
  font-size: 16px;
  font-weight: 500;
}

.gnb .subNav li:hover {
  color: var(--color-orange);
}

.subBg {
  display: none;
  position: absolute;
  top: 80px;
  left: 0;
  z-index: 5001;
  width: 100%;
  height: 150px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  background-color: #fafafa;
}

/* topMenu */
.gnb .topMenu {
  width: initial;
  margin-left: 25px;
  cursor: pointer;
  word-break: keep-all;
  white-space: nowrap;
}

.gnb .topMenu:hover {
  color: var(--color-orange);
}

.gnb .login,
.gnb .join {
  font-size: var(--font-regular);
}

.gnb .icon {
  width: 30px;
  height: 30px;
  position: relative;
  transform: translateY(80%);
}

.gnb .icon img {
  position: absolute;
}

/* header scroll */
header.active {
  width: 100%;
  height: 80px;
  background-color: rgba(0,0,0,0.4);
  box-sizing: border-box;
}

header.active .hTop {
  top: -40px;
}

header.active .hBottom {
  top: -40px;
  height: 80px;
  transition: 0.3s;
}

header.active .hBottom h1 {
  height: 80px;
  transition: 0.3s;
}

header.active .gnb {
  height: 80px;
  transition: 0.3s;
}

header.active .gnb > ul > li {
  height: 80px;
  line-height: 80px;
  transition: 0.3s;
}

header.active .subBg {
  top: 80px;
}


</style>