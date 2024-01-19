<template>
  <main class="content_wrap" @submit.prevent="onSubmitWrite">
    <div class="title">
      <h1>질문 작성</h1>
    </div>
    <form class="qna_wrap">
      <div class="input_row">
        <span for="qna_title" class="tit"><div class="bar"></div>제목</span>
        <input type="text" id="qna_title" v-model="qna_title" class="txtbox" placeholder="제목">
      </div>
      <div class="input_row">
        <span class="tit"><div class="bar"></div>내용</span>
        <textarea v-model="qna_content" class="txtbox" placeholder="내용을 입력해 주세요!"></textarea>
      </div>
      <div class="input_row">
        <div class="doc_wrap">
          <span class="tit"><div class="bar"></div>의사 선택</span>
          <div class="sel_wrap">
            <div class="sel" :class="{ active: optionsActive }" tabindex="0" @click="toggleOptions">
              <span class="sel_txt">{{ doc_nm }}</span>
              <i class="fa-solid fa-chevron-down arrow_down"></i>
            </div>
            <div class="sel_list_wrap">
              <div class="sel_list" :style="{ display: optionsActive ? 'block' : 'none' }" >
                <div v-for="(option, index) in docInfo" :key="index" class="sel_opt" :class="{ 'selected': option.DOC_ID === doc_id }" @click="handleSelect(option.DOC_NM, option.DOC_ID)">
                {{ option.DOC_NM }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sec_wrap">
          <span class="tit"><div class="bar"></div>비밀글</span>
          <input type="checkbox" v-model="is_secret" class="checkbox" id="is_secret">
          <label for="is_secret"></label>
        </div>
      </div>
      <div class="input_row pic_row">
        <span class="tit"><div class="bar"></div>사진</span>
        <span class="img_frame">
          <img :src="previewImage" v-if="previewImage" />
        </span>
        <div class="upload_wrap">
          <input type="file" id="qna_img" accept=".png, .jpg, .jpeg" @change="onFileChange">
          <label for="qna_img"></label>
          <div class="img_upload_txt">
            <div>지원되는 확장자 .png, .jpg, .jpeg</div>
            <div>용량제한 3MB</div>
            <div>180px &#215; 180px 추천</div>
          </div>
        </div>  
      </div>
      <div class="btn_con">
        <button type="submit" class="button">등록</button>
        <button type="button" class="button" @click="goBack()">취소</button>
      </div>  
    </form>
  </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      qna_title: '',
      qna_content: '',
      is_secret: false, // 비밀글 옵션 추가
      doc_nm: '의사 선택',
      doc_id: '',
      docInfo:[],
      qna_image: null,
      previewImage: null,
      optionsActive: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user; // 로그인 확인
    }
  },
  mounted() {
    if (this.user.user_id == '') {
      // 일단은 로그인 상태 체크 
      this.$swal("비회원 이용불가 페이지입니다.");
      this.$router.push({ path: '/login' });
    } else {
      this.getDocDate();
    }
  },
  methods: {
    onFileChange(e) {
      //alert가 출력되어 확인을 눌렀을 때 브라우저에서 [Violation] 'change' handler took *ms 경고 발생하는데 alert 창이 켜져있었다는 수준의 경고이므로 무시해도 됨
      const file = e.target.files[0];
      if (!file) {    //파일을 한번 첨부한 후 다시 파일첨부를 눌러 취소버튼을 누를 경우 size가 undefined로 변경되어 발생하는 에러를 처리하기 위함
        console.log("파일첨부취소")
        e.target.value = '';
        return;
      } else if (file.size > 3 * 1024 * 1024) {
        alert('용량이 3MB 이하인 파일만 업로드하실 수 있습니다.');
        e.target.value = '';
        return;
      }
      this.qna_image = file;
      this.previewImage = URL.createObjectURL(this.qna_image);
    },
    onSubmitWrite() {
      const formData = new FormData();
      formData.append('user_no', this.user.user_no);
      formData.append('qna_title', this.qna_title);
      formData.append('qna_content', this.qna_content);
      formData.append('is_secret', this.is_secret ? 1 : 0);
      formData.append('doc_id', this.doc_id);
      if(this.qna_image) {
        formData.append('qna_image', this.qna_image);
      }  
      axios.post('http://localhost:3000/qna/write', formData).then((res) => {
        if(res.data === 'success') {
          this.$swal({
            icon: 'success',
            title: '문의가 등록되었습니다.',
            showConfirmButton: false,
            timer: 1500
          })
          .then(() => {
            this.$router.go(-1);
          })
        } else {
          this.$swal("동일한 문의가 존재합니다.");
        }
      })
      .catch(() => {
        this.$swal("오류 발생")
      })
    },
    async getDocDate() {
      try {
        const response = await axios.get("http://localhost:3000/auth/getDocData");
        this.docInfo = response.data;
        console.log(this.docInfo);
      } catch(error) {
        console.error(error);
      }
    },
    handleSelect(nm, id) {
      this.doc_nm = nm;
      this.doc_id = id;
      this.optionsActive = false;
    },
    toggleOptions() {
      this.optionsActive = !this.optionsActive;
    },
    goBack() {
      this.$router.go(-1);
    }
  }
}
</script>
<style src="../assets/css/profileInput.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.qna_wrap {
  width: 700px;
  margin: 50px auto;
}

.input_row {
  margin-bottom: 30px;
}

.input_row .tit {
  font-size: 16px;
  font-weight: 500;
  width: 100px;
}

.input_row .txtbox {
  border-radius: 12px !important;
  width: 600px;
}

.input_row input[type=text],
.input_row textarea {
  width: 600px;
}


.doc_wrap,
.sec_wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sel_wrap {
  min-width: 140px;
}

.sel {
  border-color: var(--color-orange);
}

.sel .fa-solid {
  color: var(--color-orange);
}

.sel:hover,
.sel.active {
  background-color: var(--color-orange);
  color: var(--color-white);
}

.sel_list {
  border-color: var(--color-orange);
  background-color: var(--color-faintorange);
}

.sel_opt:not(:last-child) {
  border-bottom-color: var(--color-orange);
}

.sel_opt:hover {
  background-color: var(--color-orange);
}

.sec_wrap {
  margin-right: 150px;
}

.pic_row {
  justify-content: left;
  margin-bottom: 50px;
}

.img_frame {
  margin-right: 20px;
}

.upload_wrap {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 12px;
}

#qna_img + label {
  margin-bottom: 20px;
}

#qna_img + label::after {
  content: '\f093\00a0\00a0업로드';
  font-family: 'Noto Sans KR', FontAwesome, sans-serif;
  font-size: var(--font-regular);
  font-weight: 500;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid var(--color-orange);
  border-radius: 12px;
  color: var(--color-orange);
  background-color: var(--color-white);
  cursor: pointer;
}

#qna_img + label:hover::after {
  background-color: var(--color-orange);
  color: var(--color-white);
}

.button {
  display: block;
  margin: 0 auto;
}

.btn_con {
  display: flex;
  justify-content: center;
}

.btn_con button {
      margin: 5px; /* 버튼 사이의 간격을 조절할 수 있습니다. */
    }
</style>