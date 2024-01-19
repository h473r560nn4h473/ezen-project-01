<template>
  <main class="content_wrap">
    <div class="title">
      <h1>아이디/비밀번호 찾기</h1>
    </div>
    <div class="bg_shadow">
      <div class="wrap">
        <div class="tab_list">
          <div role="tab" id="tab1" class="tab" @click="handleTabClick('btn_id')" :class="{ active: isTabActive('btn_id') }">
            <button type="button" class="btn_id">아이디 찾기</button>
          </div>
          <div role="tab" id="tab2" class="tab" @click="handleTabClick('btn_pw')" :class="{ active: isTabActive('btn_pw') }">
            <button type="button" class="btn_pw">비밀번호 찾기</button>
          </div>
        </div>
        <div class="form_wrap">
          <div class="form_id" v-show="isTabActive('btn_id')">
            <div class="form_tit">전화번호</div>
            <div class="input_row">
              <input type="tel" @input="validatePhoneNumber" minlength="10" maxlength="11" placeholder="- 없이 숫자만 입력" v-model="user_ph" />
              <button type="button" class="btn_send" @click="findID()">아이디 찾기</button>
            </div>
            <div v-if="response_id_check" class="response">
              <div class="id_notice">아이디는 <span class="user_info">{{ search_user_id }}</span>입니다. </div>
            </div>
            <div class="btn_wrap">
              <button type="button" class="button" @click="goToLogin">로그인</button>
            </div>
          </div>
          <div class="form_pw" v-show="isTabActive('btn_pw')">
            <div class="input_wrap">
              <div class="form_tit">아이디</div>
              <input type="test" placeholder="아이디" @value="foundID()" v-model="user_id" />
              <div class="form_tit">전화번호</div>
              <input type="tel" minlength="11" maxlength="11" placeholder="- 없이 숫자만 입력" v-model="user_ph" />
              <button type="button" class="btn_send" @click="findPW()">비밀번호 찾기</button>
            </div>
            <div v-if="response_pw_check" class="response">
              <div class="id_notice">임시 비밀번호는 <span class="user_info">{{ user_pw }}</span>입니다.</div>
              <div class="id_notice">로그인 후 꼭 변경해주세요.</div>
            </div>
            <div class="btn_wrap">
              <button type="button" class="button" @click="goToLogin">로그인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      activeTab: 'btn_id',     // 초기에 보여질 탭 버튼
      user_ph: '',
      user_id: '',            // password 변경 용 입력한 아이디
      user_pw: '',
      search_user_id: '',     // id 찾기로 받은 아이디
      response_id_check: false,
      response_pw_check: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    goToLogin() {
      this.$router.push({ path: '/login' });
    },
    handleTabClick(tab) {
      this.activeTab = tab; // 클릭한 탭 버튼으로 activeTab 값을 업데이트
    },
    isTabActive(tab) {
      return this.activeTab === tab; // 현재 활성화된 탭인지 확인하는 메서드
    },
    mounted() {  // 선택된 탭 버튼의 텍스트 색상 변경
      const selectedTab = document.querySelector(`${this.activeTab} button`);
      if (selectedTab) {
        selectedTab.style.color = '#cc8c00';
      }
    },
    findID() {
      if (this.user_ph === '') {
        this.$swal({
          icon: 'warning',
          title: '휴대전화번호를 입력해주세요.'
        });
      } else {
        axios.post('http://localhost:3000/auth/findId', {
          user_ph: this.user_ph
        })
          .then((res) => {
            if (res.data.message === 'user_ph') {
              this.search_user_id = res.data.user_id;
              this.response_id_check = true;
              this.user_id = this.search_user_id;
            } else {
              this.$swal({
                icon: 'error',
                title: '알 수 없는 오류가 발생했습니다.'
              });
            }
          })
          .catch((error) => {
            console.log(error);
            this.$swal({
              icon: 'error',
              title: '해당 휴대전화번호가 없습니다.'
            });
            // 이메일 전송 실패 시 처리할 작업 수행
          });
      }
    },
    findPW() {
      if (this.user_id === '' || this.user_ph === '') {
        this.$swal({
          icon: 'warning',
          title: '아이디와 휴대전화번호를 입력해주세요'
        });
      } else {
        axios.post('http://localhost:3000/auth/findPw', {
          user_id: this.user_id,
          user_ph: this.user_ph
        })
          .then((res) => {
            this.user_pw = res.data.message;
            this.response_pw_check = true;
          })
          .catch((error) => {
            console.log(error);
            this.$swal({
              icon: 'error',
              title: '정보 확인에 실패했습니다.'
            });
          });
      }
    },
    validatePhoneNumber() {
      this.user_ph = this.user_ph.replace(/\D/g, ''); // 숫자 이외의 문자 제거
    }
  }
}
</script>
<style src="../assets/css/profileInput.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.bg_shadow {
  width: 550px;
  margin: 0 auto;
  background: #dbdbdb;
  border-radius: 25px;
}

.wrap {
  padding: 0;
  width: 100%;
  border: none;
  background: linear-gradient(180deg, var(--color-white) 60%, #fff2e6 100%);
  box-shadow: none;
}

.tab_list {
  display: flex;
  background: transparent;
  box-shadow: 0 -1px 1px 0 var(--color-gray) inset;
}

.tab {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: var(--color-white);
  border-radius: 25px 25px 0 0;
  margin-right: 10px;
  border-bottom: none;
}

.tab:last-child {
  margin-right: 0;
  border-left: 1px solid var(--color-gray);
}

.tab:not(.active) {
  box-shadow: 0 -5px 10px -3px var(--color-lightgray);
  border: 1px solid var(--color-gray);
  border-bottom: none;
}

.tab:not(.active):hover {
  border: 1px solid var(--color-orange);
  border-bottom: none;
  box-shadow: 0 -8px 10px -5px var(--color-lightorange);
}

.tab:not(.active):hover button {
  color: var(--color-orange);
}

.tab button {
  font-weight: 500;
  background: none;
}

.tab.active {
  background-image: none;
  cursor: initial;
  border: 1px solid var(--color-orange);
  border-bottom: none;
  box-shadow: 0 -8px 10px -5px var(--color-lightorange);
}

.tab.active button {
  color: var(--color-orange);
}

.tab button {
  width: 100%;
  height: 100%;
  color: var(--color-gray);
}

.form_wrap {
  border: 1px solid transparent;
  border-top: none;
  padding: 100px 50px;
  border: 1px solid var(--color-gray);
  border-top: none;
  border-radius: 0 0 25px 25px;
  box-shadow: 0 0 10px 5px var(--color-lightgray);
}

.form_id {
  margin: 0 auto;
}

.form_tit {
  margin-bottom: 20px;
}

.input_row,
.input_wrap {
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}

.input_row input,
.input_wrap input {
  width: 280px;
}

.input_row button,
.input_wrap button {
  width: 140px;
  height: 50px;
  border: 1px solid var(--color-orange);
  border-radius: 25px;
  background: var(--color-white);
  color: var(--color-orange);
  font-weight: 500;
}

.input_row button:hover,
.input_wrap button:hover {
  background: var(--color-orange);
  color: var(--color-white);
}

.response {
  margin-bottom: 50px;
  text-align: center;
}

.response .id_notice:not(:last-child) {
  margin-bottom: 20px;
}

.response .user_info {
  color: var(--color-orange);
  font-size: var(--font-medium);
  margin: 0 7px;
}

.btn_wrap {
  display: flex;
  justify-content: center;
}

.input_wrap {
  display: grid;
  position: relative;
}

.input_wrap input {
  margin-bottom: 30px;
}

.input_wrap input:last-of-type {
  margin-bottom: 0;
}

.input_wrap .btn_send {
  grid-column: 2 / 3;
  grid-row: 1 / 5;
}
</style>