<template>
    <main class="content_wrap">
      <div class="title">
        <h1>의사 선택하기</h1>
      </div>
      <div class="wrap">
        <div class="box" @click="goToRes1()">
          <div class="left">
            <img src="../assets/logo-color.svg" alt="펫테랑동물병원">
            <p class="intro">{{ docnm1 }} {{ docmj1 }} 전공 수의사</p>
          </div>
          <div class="right">
            <div class="img_frame">
              <img src="../assets/doc1.png" alt="김봉구">
            </div>
          </div>
        </div>
        <div class="box" @click="goToRes2()">
          <div class="left">
            <img src="../assets/logo-color.svg" alt="펫테랑동물병원">
            <p class="intro">{{ docnm2 }} {{ docmj2 }} 전공 수의사</p> 
          </div>
          <div class="right">
            <div class="img_frame">
              <img src="../assets/doc2.png" alt="강한나">
            </div>
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
        docInfo: [],
        docnm1: '',
        docnm2: '',
        docmj1: '',
        docmj2: '',
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    mounted() {
      if (this.user.user_no === '') {
        this.$swal('로그인해주세요');
        this.$router.push({ path: '/login' });
      } else {            
        this.getDocDate();           
      }
    },
    methods: {
      async getDocDate() {
        try {
          const response = await axios.get(`http://localhost:3000/auth/getDocData`);
          this.docInfo = response.data;
          this.docnm1 = this.docInfo[0].DOC_NM;
          this.docnm2 = this.docInfo[1].DOC_NM;
          this.docmj1 = this.docInfo[0].DOC_MJ;
          this.docmj2 = this.docInfo[1].DOC_MJ;
        } catch (error) {
          console.error(error);
        }
      },
      goToRes1() {
        this.$router.push('/res?doc_nm=' + this.docnm1);
      },
      goToRes2() {
        this.$router.push('/res?doc_nm=' + this.docnm2);
      },
    }
  }
  </script>
  <style scoped>
  @import "../assets/css/global.css";
  
  .wrap {
    width: 720px;
  }
  
  .box {
    border-radius: 25px;
    border: 1px solid var(--color-dark);
    box-shadow: 0 0 15px -3px var(--color-lightgray);
    padding: 50px;
    font-size: var(--font-regular);
    margin-bottom: 50px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .box:last-child {
    margin-bottom: 0;
  }
  
  .box:hover {
    border: 1px solid var(--color-orange);
    outline: none;
    box-shadow: 0 0 15px -3px var(--color-lightorange);
  }
  
  .left img {
    width: 230px;
    margin-bottom: 20px;
  }
  
  .img_frame {
    box-shadow: 0 0 15px 0 var(--color-lightgray);
  }
  
  .intro {
    font-size: 18px;
    font-weight: 500;
  }
  </style>