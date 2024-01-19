<template>
  <main>
    <div class="title">
      <h1>피부과 클리닉 <span class="sub_color">안내</span></h1>
    </div>
    <div class="content">
      <div class="img">
        <img src="http://www.chungdamah.co.kr/theme/hp001/img/pbg.jpg">
      </div>
      <div class="row">
        <div class="sub_tit">
          <div class="num">01</div>
          <div class="sub_tit_txt">피부진료 안내</div>
        </div>
        <div class="sub_color">
          펫테랑동물병원은 특화진료과목 이외에도 각 진료과목별 전문 클리닉을 운영하고 있습니다.
        </div>
        <table class="ta_01" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td class="left top1">귀질환</td>
              <td class="right top1 r01">
                귀에 발생하는 질병들은 보호자들의 세심한 보호가 있다면 예방하거나 발병을 줄일수 있음을 인지하고 병원내원시 마다 정기적으로 검진하여야 합니다. 귀속에서 불괘한 냄새가 나거나, 고개를 좌우로 흔들거나, 귀를 만지면 아파하는 것들은 귓병을 의심해 볼수 있는 증상들입니다. 귀의 해부학적 구조에 의해서 외이도염, 중이염, 내이염으로 구분을 합니다.
              </td>
            </tr>
            <tr>
              <td class="left">피부질환</td>
              <td class="right r01">
                반려동물의 피부는 사람과 다르게 피모(털)로서 피부를 덥고 있습니다. 이러한 털과 피부는 여려가지 환경, 영양, 호르몬등에 의해 영향을 받게됩니다. 또한 이러한 피모나 피부에 영향을 주는 질환은 광범위합니다.
              </td>
            </tr>
          </tbody>
        </table> 
      </div>
      <div class="row">
        <div class="sub_tit">
          <div class="num">02</div>
          <div class="sub_tit_txt">주요 피부질환 종류</div>
        </div>
        <div class="grid_wrap">
          <ul>
            <li>
              <span>01</span>
              <p>
                세균성<br>피부질환
              </p>
            </li>
            <li>
              <span>02</span>
              <p>
                곰팡이성<br>피부질환
              </p>
            </li>
            <li>
              <span>03</span>
              <p>
                기생충성<br>피부질환
              </p>
            </li>
            <li>
              <span>04</span>
              <p>
                내분비성<br>피부질환
              </p>
            </li>
            <li>
              <span>05</span>
              <p>
                면역매계성<br>피부질환
              </p>
            </li>
            <li>
              <span>06</span>
              <p>
                종양<br>&nbsp;
              </p>
            </li>
            <li>
              <span>07</span>
              <p>
                신생물<br>&nbsp;
              </p>
            </li>
            <li>
              <span>08</span>
              <p>
                음식알러지<br>&nbsp;
              </p>
            </li>
            <li>
              <span>09</span>
              <p>
                아토피<br>&nbsp;
              </p>
            </li>
            <li>
              <span>10</span>
              <p>
                접촉성<br>피부염
              </p>
            </li>
          </ul>
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
  width: 41%;
}

.img {
  margin-bottom: 80px;
}

.img img {
  width: 100%;
  height: 450px;
  object-fit: cover;
}

.sub_color {
  color: var(--color-orange);
  margin-bottom: 20px;
  font-weight: 500;
}

.ta_01 .top1 {
  border-top: 2px solid var(--color-orange);
}
.ta_01 .left {
  width: 30%;
  text-align: center;
  font-size: 25px;
  font-weight: 900;
  padding: 2%;
  background: #fafafa;
  border-left: 1px solid #CCC;
  border-bottom: 1px solid #CCC;
  color: var(--color-dark);
  word-break: keep-all;
}

.ta_01 .r01 {
  border-right: 1px solid #CCC;
}
.ta_01 .right {
  width: 70%;
  font-size: 17px;
  line-height: 35px;
  padding: 3%;
  border-left: 1px solid #CCC;
  border-bottom: 1px solid #CCC;
  word-break: keep-all;
}

.grid_wrap {
  position: relative;
  width: 100%;
}

.grid_wrap>ul {
  margin: 0;
  padding: 0;
}

.grid_wrap ul li {
  display: inline-block;
  width: 18%;
  margin-right: 2%;
  margin-bottom: 2%;
  border: solid 5px var(--color-orange);
  padding-top: 20px;
  height: 157px;
  transition: all .2s ease-out;
}

.grid_wrap ul li span {
  font-size: 20px;
  color: var(--color-orange);
  font-style: italic;
  font-weight: bold;
  position: relative;
  padding-left: 28px;
}

.grid_wrap ul li span::before {
  content: '';
  position: absolute;
  left: 0px;
  top: 14px;
  width: 30px;
  height: 1px;
  background: var(--color-orange);
}

.grid_wrap ul li p {
  font-size: 16px;
  padding-top: 20px;
  text-align: center;
  margin: 0;
}
</style>