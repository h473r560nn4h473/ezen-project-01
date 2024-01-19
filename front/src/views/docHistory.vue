<template>
  <main class="content_wrap">
    <div class="title">
      <h1>의료진 소개</h1>
    </div>
    <div class="doc_wrap">
      <div class="doc_row">
        <div class="img_frame">
          <img src="../assets/doc2.png">
        </div>
        <div class="doc_profile">
          <div class="doc_name">{{ doc2.DOC_NM }}</div>
          <div>
            <span class="bar"></span>
            <span class="sub">연락처:</span>
            <span>{{ doc2.DOC_PH }}</span>
          </div>
          <div>
            <span class="bar"></span>
            <span class="sub">이메일:</span>
            <span>{{ doc2.DOC_EML }}</span>
          </div>
          <div>
            <span class="bar"></span>
            <span class="sub">전공:</span>
            <span>{{ doc2.DOC_MJ }}</span>
          </div>
          <div>
            <span class="bar"></span>
            <span class="sub">경력:</span>
            <span class="content" v-html="his_content2"></span>
          </div>
        </div>
      </div>
      <div class="doc_row">
        <div class="doc_profile">
          <div class="doc_name">{{ doc1.DOC_NM }}</div>
          <div>
            <span class="bar"></span>
            <span class="sub">연락처:</span>
            <span>{{ doc1.DOC_PH }}</span>
          </div>
          <div>
            <span class="bar"></span>
            <span class="sub">이메일:</span>
            <span>{{ doc1.DOC_EML }}</span>
          </div>
          <div>
            <span class="bar"></span>
            <span class="sub">전공:</span>
            <span>{{ doc1.DOC_MJ }}</span>
          </div>
          <div>
            <span class="bar"></span>
            <span class="sub">경력:</span>
            <span class="content" v-html="his_content1"></span>
          </div>
        </div>
        <div class="img_frame">
          <img src="../assets/doc1.png" alt="">
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      dochis: [],
      doc1: {},
      doc2: {},
      his_content1: '',
      his_content2: '',
    };
  },
  created() {
  this.get_dochis();
  },
  methods: {
    async get_dochis() {
      try {
        const response = await axios.get(`http://localhost:3000/auth/dochistory`)
        this.dochis = response.data;
        this.doc1 = this.dochis[0];
        this.doc2 = this.dochis[1];
        this.his_content1 = this.doc1.HIS_CONTENT.split('a').join('<br />');
        this.his_content2 = this.doc2.HIS_CONTENT.split('a').join('<br />');
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style scoped>
@import "../assets/css/global.css";

.doc_wrap {
  width: 800px;
  margin: 0 auto;
}

.doc_row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}

.img_frame {
  width: 350px;
  height: 350px;
}

.doc_profile {
  width: 350px;
  font-size: 18px;
}

.doc_name {
  padding: 20px !important;
  border-bottom: 1px solid var(--color-gray);
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 10px;
  margin-bottom: 10px;
}

.doc_profile div {
  padding: 10px;
  display: flex;
  justify-content: left;
  line-height: 1;
}

.sub {
  flex-shrink: 0;
}

.sub {
  width: 80px;
}

.content {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
}
</style>