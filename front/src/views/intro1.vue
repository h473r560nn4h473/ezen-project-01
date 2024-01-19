<template>
  <main>
    <div class="title">
      <h1>안과 클리닉 <span class="sub_color">안내</span></h1>
    </div>
    <div class="content">
      <div class="row">
        <div class="left">
          <div class="sub_tit">
            <div class="num">01</div>
            <div class="sub_tit_txt">안과 클리닉</div>
          </div>
          <div class="left_txt">
            <div class="sub_color">
              반려동물 안과질환은 초기 진단이 매우 중요합니다.
            </div>
            <div class="txt">
              안과검사가 가능한 여러 장비(검안경, 슬릿 램프, 루페, 안압계, 디옵터 등)를 이용하여 각막표면부 검사, 눈물량 검사, 각막부 형광염색검사, 홍채 검사, 전안방 검사, 수정체 등 백내장 검사, 초차제 변성 검사, 안저와 망막부 검사 등을 통해 각막염, 포도막염, 망막박리증, 수정체 탈구증, 홍채염, 녹내장, 안저질환 등의 진단과 치료를 실시하고 있으며, 최선의 치료를 위해 꾸준히 노력하고 있습니다.
            </div>
          </div>
        </div>
        <div class="right">
          <div class="img">
            <img src="http://www.chungdamah.co.kr/theme/hp001/img/ag.jpg" alt="dog">
          </div>
        </div>
      </div>
      <div class="video">
        <iframe width="100%" height="500" src="https://www.youtube.com/embed/aKWTywH446o?si=Jrl2HNQSm2Yk2cJg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        <iframe width="100%" height="500" src="https://www.youtube.com/embed/ODjZrph6-I8?si=9sc4UKadzbcnFf2C" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>
      <div class="row">
        <div class="sub_tit">
          <div class="num">02</div>
          <div class="sub_tit_txt">안과 진료과목 안내</div>
        </div>
        <div class="txt">
          <div class="sub_color">
            펫테랑동물병원은 특화진료과목 이외에도 각 진료과목별 전문 클리닉을 운영하고 있습니다.
          </div>
          <div class="txt_row">
            <div class="box_title">분류</div>
            <ul>
              <li> * 건성 각결막염(KCS)시의 이하선 도관 전이술 (PDT) </li>
              <li> * 눈물착색 증후군(Tear staining syndrome)시의 내안각성형술(medial canthoplasty) </li>
              <li> * 사시(Strabismus)의 수술 </li>
              <li> * 녹내장(Glaucoma)의 수술 </li>
              <li> * 백내장의 수술 </li>
            </ul>
          </div>
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

.title h1 {
  font-weight: 700;
}

.title h1 .sub_color {
  color: var(--color-orange);
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

.left {
  width: 47%;
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

.right {
  width: 50%;
}

.img {
  border-top: 3px solid var(--color-orange);
}

.img img {
  width: 100%;
  height: 100%;
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

.sub_color {
  color: var(--color-orange);
  font-weight: 500;
  margin-bottom: 20px;
}

.txt_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>