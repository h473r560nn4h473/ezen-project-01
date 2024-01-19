<template>
  <main>
    <div class="title">
      <h1>영상진단과 <span class="sub_color">안내</span></h1>
    </div>
    <div class="content">
      <div class="row">
        <div class="left">
          <div class="sub_tit">
            <div class="num">01</div>
            <div class="sub_tit_txt">영상진단과</div>
          </div>
          <div class="left_txt">
            <div class="sub_color">
              동물 질환을 진단하는 방법 중의 하나로, 내외부 해부학적인 구조를 영상화해 진단 뿐만 아니라 치료, 경과 확인에도 중요한 부분의 차지하고 있습니다.
            </div>
          </div>
        </div>
          <div class="img">
            <img src="http://www.chungdamah.co.kr/theme/hp001/img/ys.jpg" alt="dog">
        </div>
      </div>
      <div class="video">
        <iframe width="800" height="500" src="https://www.youtube.com/embed/Hf92IB9xFZ4?si=XGU-p_ggbx99l0Co" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div class="row">
        <div class="sub_tit">
          <div class="num">02</div>
          <div class="sub_tit_txt">영상진단 종류 안내</div>
        </div>
        <div class="txt">
          <div class="sub_color">
            펫테랑동물병원은 특화진료과목 이외에도 각 진료과목별 전문 클리닉을 운영하고 있습니다.
          </div>
          <div class="block">
            <div class="box_title">X-RAY</div>
            <span class="pdt10">
              흉부와 복부, 골격계의 진단과 수술 전 환자 평가의 기본 진단방법으로 가장 손쉽게 이용되고 있는 진단방법입니다. 일반 촬영, 조영촬영을 통해 내부장기의 변화, 상대적인 기능을 평가할 수 있습니다.
            </span>
          </div>
        </div>
        <div class="block2">
          <div class="box_title">초음파</div>
          <span class="pdt10">
            초음파를 이용해 내부 장기의 해부학적인 구조와 변화를 영상화하는 방법으로 x-ray에서 의심이 되는 질환들을 정밀하게 진단해줍니다. 특히 심장질환과 복부장기 질환, 복수, mass 확인에 유용합니다.
          </span>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
@import "../assets/css/global.css";

.title {
  text-align: center;
}

.title h1,
.title h1 .sub_color {
  font-weight: 700;
}

.content {
  margin: 0 auto;
  width: 800px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 80px;
}


.sub_tit {
  position: relative;
  margin-bottom: 20px;
}

.num {
  font-size: 40px;
  color: #eaeaea;
  font-weight: 700;
}

.sub_tit_txt {
  position: absolute;
  left: 40px;
  bottom: 5px;
  font-size: 20px;
  font-weight: 600;
}

.img img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.video {
  margin-bottom: 80px;
}

.box_title {
  word-break: keep-all;
  -webkit-text-size-adjust: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  line-height: 1.4;
  letter-spacing: -0.05em;
  width: 200px;
  height: 120px;
  background: var(--color-orange);
  color: var(--color-white);
  float: left;
  font-size: 20px;
  text-align: center;
  padding-top: 43px;
  margin-right: 40px;
  margin-bottom: 20px;
}

.pdt10 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  word-break: keep-all;
}

.sub_color {
  color: var(--color-orange);
  margin-bottom: 20px;
  font-weight: 500;
}
</style>