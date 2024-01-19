<template>
  <footer>
    <div class="inner">
      <div class="footer_logo">
        <img src="../assets/logo-white.svg" alt="펫테랑동물병원">
      </div>
      <div class="vert_line"></div>
      <div class="footer_info">
        <div class="lou_info">
          <p>서울시 종로구 미려빌딩 1층 펫테랑동물병원</p>
          <p>대표자 : 임세인 | Tel : 02-345-6789</p>
          <p>COPYRIGHT ⓒ 2023 펫테랑동물병원. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
      <div class="vert_line"></div>
      <div class="p_info">
        <a href="#">개인정보취급방침</a>
      </div>
      <div class="vert_line"></div>
      <div class="call">
        <div class="col">
          <p>전화번호</p>
          <p class="num">02 345 6789</p>
        </div>
        <div class="col">
          <p>외래진료</p>
          <p class="num">AM 09:00 - PM 10:00</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style src="../assets/css/global.css" scoped />
<style scoped>

footer {
  min-height: 80px;
  background: #333;
  font-size: 12px;
  line-height: 1.5;
  color: #eee;
  font-weight: 300;
}

.inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  width: 1374px;
  margin: 0 auto;
}

.vert_line {
  width: 1px;
  height: 30px;
  background-color: var(--color-gray);
}

.call {
  display: flex;
}

.call .col:first-child {
  margin-right: 20px;
}

.call .col p {
  white-space: nowrap;
}

.num {
  font-family: 'Cabin Condensed', sans-serif;
  font-weight: 600;
}

</style>