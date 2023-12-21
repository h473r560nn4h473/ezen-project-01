<template>
    <div>
      <div class="content">
        <router-view></router-view>
      </div>
      <side-bar></side-bar>
    </div>
</template>

<script>
import SideBar from './adminSideBar.vue'

export default {
  name: 'app',
  components: {
    SideBar,
  }
}
</script>

<style scoped>

* {margin: 0; padding: 0;}
.content{
  padding-left:130px; 
  padding-right:30px;
  max-width: 1200px;
  margin: auto;
}

</style>
