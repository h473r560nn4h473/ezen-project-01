<template>
  <body>
    <div id="mainslider">
      <splide :options="options">
        <splide-slide>
          <img class="slider-image" src="../assets/visual1.png" alt="main1" />
        </splide-slide>
        <splide-slide>
          <img class="slider-image" src="../assets/visual2.png" alt="main1" />
        </splide-slide>
        <splide-slide>
          <img class="slider-image" src="../assets/visual3.png" alt="main2" />
        </splide-slide>
      </splide>
    </div>
    <main id="contents">
      <section class="sec_1">
        <div class="left_bg_1">
          <div class="left_1">
            <div class="phone"></div>
            <div class="left_txt_1">
              <p>전화번호</p>
              <p class="num">02 345 6789</p>
              <p>외래진료</p>
              <p class="num">AM 09:00 - PM 10:00</p>
            </div>
          </div>
        </div>
        <div class="right_bg_1">
          <div class="right_1">
            <div class="right_txt_1">
              <h2>진료예약</h2>
              <p>외래진료 시간 참고 후 예약 부탁드립니다. 진료예약 후 전화로 확인 후 정식으로 예약됩니다.</p>
              <button type="button" class="button" @click="goToRes()">자세히보기</button>
            </div>
          </div>
        </div>
      </section>
      <section class="sec_2">
        <div class="left_bg_2">
          <div class="left_2">
            <div class="left_txt_2">
              <h2>노령견 건강관리에 특화된 병원</h2>
              <p>나이든 아이들이 노후 꾸준한 건강관리를 통해 잔병치레 없는 건강한 생활을 할 수 있도록 도와드립니다.</p>
            </div>
            <div class="pic"></div>
          </div>
        </div>
        <div class="right_bg_2">
          <div class="right_2">
            <div class="right_txt_2">
              <h2>QnA</h2>
              <p>아이들을 병원에 데리고 오기 전 보호자 분들이 제일 많이 물어보시는 질문들입니다. 20년 이상 쌓인 원장 선생님의 풍부한 임상경험과 노하우를 바탕으로 실제 환자들의 보호자 분들께 드렸던 답변들입니다.</p>
              <button type="button" class="button" onclick="location.href='/qnaMain?page=1'">자세히보기</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </body>
</template>
<script>
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

export default {
  name: 'VisualSlide',
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      options: {
        type: 'fade',
        rewind: true,
        perPage: 1,
        autoplay: true,
        interval: 5000,
        pauseOnHover: false,
        arrows: false,
        dots: true,
        animatedDots: true,
        transition: 'fade',
        speed: 800,
        width: '100%'
      },
    };
  },
  methods: {
    goToRes() {
      this.$router.push({ path: '/docSelect' });
    },
    
  }
};
</script>
<style scoped>
@import "../assets/css/global.css";

#mainslider {
  background: var(--color-dark);
}

#mainslider img {
  width: 100%;
  min-width: 1374px;
}

h2 {
  font-size: 40px;
  font-weight: 700;
}

.sec_1 {
  height: 420px;
  display: flex;
}

.left_bg_1 {
  position: relative;
  display: block;
  width: 55%;
  height: 420px;
  background: linear-gradient(42deg, #fff7ef 0%, #ffcfa3 100%);
}

.left_1 {
  width: 815px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
}

.left_1 .phone {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 189px;
  height: 189px;
  border-radius: 50%;
  background: url(../assets/smartphone_white.png) no-repeat 60% center, linear-gradient(140deg, var(--color-lightorange), var(--color-orange));
}

.left_1 .left_txt_1 {
  position: absolute;
  top: 50%;
  right: 70px;
  transform: translateY(-50%);
}

.left_1 p {
  font-size: 24px;
  font-weight: 700;
  line-height: 46px;
}

.left_1 .num {
  font-size: 52px;
  letter-spacing: -0.03em;
  font-weight: 600;
  font-family: 'Cabin Condensed', sans-serif;
}

.left_1 p:nth-child(2) {
  margin-bottom: 20px;
}

.left_1 p:nth-child(4)::after {
  content: "연중무휴";
  font-family: "Noto Sans KR", sans-serif;
  font-size: var(--font-medium);
  color: var(--color-dark);
  font-weight: 700;
  margin-left: 10px;
  letter-spacing: 0.025em;
  vertical-align: top;
}

.right_bg_1 {
  position: relative;
  display: block;
  width: 45%;
  height: 420px;
  background: url(../assets/black_cat.png) no-repeat 345px bottom, linear-gradient(-20deg, #bbb 0%, #efefef 100%);
}

.right_1 {
  width: 618px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.right_1 .right_txt_1 {
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
}

.right_1 .right_txt_1 p {
  width: 270px;
  word-break: keep-all;
  margin: 30px 0 50px;
}

.sec_2 {
  height: 650px;
  display: flex;
}

.left_bg_2 {
  position: relative;
  display: block;
  width: 50%;
  height: 650px;
  background: linear-gradient(20deg, #ddd, #fff);
}

.left_2 {
  width: 687px;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
}

.left_2 .left_txt_2 {
  width: 250px;
  word-break: keep-all;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.left_2 .left_txt_2 h2 {
  margin-bottom: 30px;
}

.left_2 .pic {
  width: 303px;
  height: 454px;
  position: absolute;
  top: 50%;
  right: 70px;
  transform: translateY(-50%);
  background: url(../assets/dog_bw.png) no-repeat center/cover;
  mask: radial-gradient(ellipse at center, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.1) 65%, transparent 70%);
}

.right_bg_2 {
  position: relative;
  display: block;
  width: 50%;
  height: 650px;
  background: url(../assets/beagle.png) no-repeat 438px bottom, radial-gradient(farthest-corner at 600px 600px, #ffcfa3 0%, #fff2e6 60%);
}

.right_2 {
  width: 687px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.right_2 .right_txt_2 {
  width: 300px;
  word-break: keep-all;
  position: absolute;
  top: 50%;
  left: 70px;
  transform: translateY(-50%);
}

.right_2 .right_txt_2 h2 {
  margin-bottom: 30px;
}

.right_2 .right_txt_2 p {
  margin-bottom: 70px;
}
</style>