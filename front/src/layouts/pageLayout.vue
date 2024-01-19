<template>
  <div>
    <Header />
    <div class="horizontal">
      <Visual />
    </div>
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
  components: {
    Header, Footer, Visual
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
  position: relative;
}
</style>