<template>
  <div>
    <Header />
    <div class="horizontal">
      <Visual />
    </div>
    <nav class="centered-nav">
      <ul>
        <li :class="{ 'active': currentPath.includes('/subject/intro1'), 'clickable': currentPath !== '/subject/intro1' }" @click="handleClick('/subject/intro1')">안과</li>
        <li :class="{ 'active': currentPath.includes('/subject/intro2'), 'clickable': currentPath !== '/subject/intro2' }" @click="handleClick('/subject/intro2')">피부과</li>
        <li :class="{ 'active': currentPath.includes('/subject/intro3'), 'clickable': currentPath !== '/subject/intro3' }" @click="handleClick('/subject/intro3')">임상병리과</li>
        <li :class="{ 'active': currentPath.includes('/subject/intro4'), 'clickable': currentPath !== '/subject/intro4' }" @click="handleClick('/subject/intro4')">영상진단과</li>
      </ul>
    </nav>
    <div class="content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from './header.vue'
import Footer from './footer.vue'
import Visual from './visual.vue'

export default {
  data() {
    return {
      currentPath: this.$route.path
    }
  },
  components: {
    Header, Footer, Visual
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
<style src="../assets/css/global.css" scoped></style>
<style scoped>
.horizontal {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
}

.centered-nav ul{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
}

.centered-nav li {
  border-right: 1px solid var(--color-lightgray);
  padding: 0 20px;
  font-size: 18px;
  font-weight: 500;
}

.centered-nav li:last-child {
  border-right: none;
}

.centered-nav li.active {
  color: var(--color-orange);
  cursor: default;
}

.centered-nav li:not(.active) {
  color: var(--color-dark);
  cursor: pointer;
}

.content {
  margin: 0 auto 100px;
  padding: 50px 0;
  width: 940px;
  position: relative;
}
</style>