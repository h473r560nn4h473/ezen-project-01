<template>
  <div>
    <Header />
    <div class="content">
      <router-view />
    </div>
    <Footer />
  </div>
</template>


<script>
import Header from './header.vue'
import Footer from './footer.vue'

export default {
  components: {
    Header, Footer
  }
}
</script>

<style>
.content {
  padding-top: 150px;
  margin: auto;
  height: 100%;
  position: relative;
  min-height: 100%;
}
</style>