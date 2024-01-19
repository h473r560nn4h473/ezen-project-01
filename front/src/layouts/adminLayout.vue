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
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  position: absolute;
  top: 0;
  left: 100px;
}

</style>
