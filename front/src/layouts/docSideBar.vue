<template>
  <body>
    <div class="sidebar_wrap">
      <div class="sidebar">
        <div class="menu" :class="{ 'active': currentPath === '/docpage' || currentPath.includes('/docpage/docupdate'), 'clickable': currentPath !== '/docpage' }" @click="handleClick('/docpage')">
          <div class="icon_wrap">
            <i class="fa-solid fa-user-pen"></i>
            <p>회원 정보</p>
          </div>  
        </div>
        <div class="line"></div>
        <div class="menu" :class="{ 'active': currentPath.includes('/docpage/docreservation'), 'clickable': currentPath !== '/docpage/docreservation' }" @click="handleClick('/docpage/docreservation')">
          <div class="icon_wrap">
            <i class="fa-solid fa-calendar-days"></i>
            <p>예약 내역</p>
          </div>  
        </div>
        <div class="line"></div>
        <div class="menu" :class="{ 'active': currentPath.includes('/docpage/docreview'), 'clickable': currentPath !== '/docpage/docreview' }" @click="handleClick('/docpage/docreview')">
          <div class="icon_wrap">
            <i class="fa-solid fa-file-medical"></i>
            <p>진료 후기</p>
          </div>  
        </div>
        <div class="line"></div>
        <div class="menu" :class="{ 'active': currentPath.includes('/docpage/docqna'), 'clickable': currentPath !== '/docpage/docqna' }" @click="handleClick('/docpage/docqna')">
          <div class="icon_wrap">
            <i class="fa-solid fa-circle-question"></i>
            <p>문의 내역</p>
          </div>  
        </div>
      </div>
      
    </div>
  </body>
</template>
<script>
export default {
  data() {
    return {
      currentPath: this.$route.path
    }
  },
  watch: {
    '$route'(to) {
      this.currentPath = to.path
    }
  },
  methods: {
    handleClick(path) {
      if (!this.$el.classList.contains('active') && this.currentPath !== path) {
        this.$router.push({ path: path })
      }
    }
  }
}
</script>
<style scoped>
@import "../assets/css/global.css";

* {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* 인터넷익스플로러 */
  user-select: none;
}

.sidebar_wrap {
  width: 100px;
}

.sidebar {
  border-radius: 20px;
  background: linear-gradient(140deg, #ffead5, var(--color-lightorange));
  box-shadow: 0 0 28px -7px var(--color-lightorange);
  border: 1px solid var(--color-white);
}

.menu {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: var(--color-dark);
}

.menu:first-child {
  border-radius: 20px 20px 0 0;
}

.menu:last-child {
  border-radius: 0 0 20px 20px;
}

.menu.active .icon_wrap,
.menu:hover .icon_wrap {
  background: linear-gradient(140deg, var(--color-lightorange), var(--color-orange));
  color: var(--color-white);
  box-shadow: 0 0 15px -3px var(--color-orange);
  transition: all 0.2s ease-out;
}

.menu.active {
  cursor: initial;
}

.menu.active.clickable {
  cursor: pointer;
}

.icon_wrap {
  padding: 10px;
  width: fit-content;
  border-radius: 5px;
  text-align: center;
}

i.fa-solid {
  font-size: var(--font-medium);
  margin-bottom: 5px;
}

.menu p {
  margin-bottom: 0;
}

.line {
  margin: 0 auto 1px;
  height: 1px;
  background-color: var(--color-white);
  width: 70px;
}
</style>