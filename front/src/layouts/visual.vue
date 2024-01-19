<template>
  <div>
    <div class="visual_wrap">
      <div v-if="selectedImage" class="visual">
        <div class="visual_pic">
          <img v-bind:class="startTransition" :src="selectedImage" alt="visual">
          <p class="outline">아이들과 함께 이겨내는 질병</p>
        </div>
      </div>
    </div>
    <div class="bread_wrap">
      <div class="bread">
        <i class="fa-solid fa-house" @click="goMain"></i>
        <i class="fa-solid fa-caret-right"></i>
        <span>현재 페이지</span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      images: [],
      selectedImage: null,
      startTransition: 'start-transition'
    };
  },
  mounted() {
    for ( let i = 1; i <= 4; i++ ) {
      const image = require(`@/assets/visualpic${i}.png`);
      this.images.push(image);
    }
    this.selectedImage = this.randomItem(this.images)
  },
  methods: {
    randomItem (items) {
      return items[Math.floor(Math.random()*items.length)];
    },
    goMain() {
      this.$router.push({ path: "/" })
    }
  },
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

.visual_wrap {
  height: 300px;
  width: 100vw;
  min-width: 1374px;
  background: var(--color-dark);
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual {
  height: 100%;
  min-width: 1374px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual_pic {
  width: 1920px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  mask: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 3%,
    rgba(255, 255, 255, 0.6) 7%,
    rgba(255, 255, 255, 1) 10%,
    rgba(255, 255, 255, 1) 90%,
    rgba(255, 255, 255, 0.6) 93%,
    rgba(255, 255, 255, 0.3) 97%,
    transparent 100%
  );
}

.visual_pic img {
  width: 2020px;
}

@keyframes sideSlide {
  from {
    transform: translateX(-50px);
  }
  to {
    transform: translateX(0);
  }
}

.visual_pic img.start-transition {
  animation-name: sideSlide;
  animation-duration: 10s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.visual_pic p {
  display: block;
  position: absolute;
  top: 60%;
  right: 20%;
  z-index: 9999;
  font-size: var(--font-large);
  font-weight: 900;
  color: var(--color-white);
}

.bread_wrap {
  height: 50px;
  background: var(--color-dark);
  display: flex;
}

.bread {
  color: var(--color-white);
  font-size: var(--font-regular);
  width: 1374px;
  margin: 0 auto;
  display: flex;
  justify-content: left;
  align-items: center;
}

.bread i,
.bread span {
  line-height: 100%;
  margin-right: 10px;
}

.bread .fa-house {
  cursor: pointer;
}
</style>