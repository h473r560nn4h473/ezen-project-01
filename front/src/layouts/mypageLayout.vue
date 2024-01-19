<template>
  <body>
    <Header />
    <div class="horizontal">
      <Visual />
    </div>
    <div class="content">
      <mypage-side-bar class="sidebar" ref="sidebar"></mypage-side-bar>
      <router-view />
    </div>
    <Footer />
  </body>
</template>

<script>
import Header from './header.vue'
import Footer from './footer.vue'
import Visual from './visual.vue'
import MypageSideBar from './sidebar.vue'

export default {
  components: {
    Header, Footer, Visual, 'mypage-side-bar': MypageSideBar
  }
}
</script>

<style scoped>
.horizontal {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

.content {
  margin: 0 auto 100px;
  padding: 50px 80px;
  width: 1100px;
  position: relative;
  min-height: 400px;
}

.sidebar {
  z-index: 1000;
  position: absolute;
  background: transparent;
  top: 40px;
  left: -140px;
}
</style>
