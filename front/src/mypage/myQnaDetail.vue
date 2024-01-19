<template>
	<main>
		<div class="title">
			<h1>나의 질문</h1>
		</div>
		<form>
			<div class="wrap" v-for="qna in qnalist" :key="qna.QNA_NO">
				<div class="top_wrap">
					<div class="top">답변 작성자&nbsp;&nbsp;{{ qnalist[0].DOC_NM }}</div>
				</div>
				<div>
					<div class="input_row">
						<div><span class="bar"></span>제목</div>
						<input type="text" v-model="qnalist[0].QNA_TITLE" :disabled="isEditMode === false">
					</div>
					<div class="input_row">
						<div><span class="bar"></span>작성일자</div>
						<div class="textarea_box">{{ formatDateTime(qnalist[0].QNA_DATE) }}</div>
					</div>
					<div class="input_row textarea_row">
						<div class="textarea_title"><span class="bar"></span>내용</div>
						<div class="textarea_box" v-show="!isEditMode" v-html="qna_content"></div>
						<textarea type="text" v-show="isEditMode" v-model="qnalist[0].QNA_CONTENT"></textarea>
					</div>
					<div class="input_row" v-if="qnalist[0].qna_state == 1">
						<div><span class="bar"></span>답변</div>
						<div class="textarea_box" v-html="qna_answer"></div>
					</div>
					<div v-else>
					</div>
				<div class="input_row pic_row">
						<div><span class="bar"></span>사진</div>
						<div class="img_up_wrap">
							<div v-if="!qnalist[0].QNA_IMAGE" class="img_frame">
								<img src="../assets/imgempty.svg" alt="null">
							</div>
							<div v-else-if="qnalist[0].QNA_IMAGE && this.img_change === 0" class="img_frame">
								<img :src="require(`../../../back/uploads/uploadQna/${qnalist[0].QNA_IMAGE}`)" alt="...">
							</div>
							<div v-else class="img_frame">
								<img :src="previewImage" v-if="previewImage" />
							</div>
							<div class="upload_wrap" :class="{ 'active': isEditMode }">
								<input type="file" id="qna_img" accept=".png, .jpg, .jpeg" @change="onFileChange" :disabled="!isEditMode">
								<label for="qna_img"></label>
								<div class="img_upload_txt">
									<div>지원되는 확장자 .png, .jpg, .jpeg</div>
									<div>용량제한 3MB</div>
									<div>180px &#215; 180px 추천</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="btn_area">
					<button type="button" class="btn_small" @click="MyQnaModify" :class="{ 'isEditMode': isEditMode }" v-if="!isEditMode">수정하기</button>
					<button type="button" class="btn_small" @click="submitForm" :class="{ 'isEditMode': isEditMode }" v-else>수정완료</button>
					<button type="button" class="btn_small" @click="MyQnaMain" :class="{ 'isEditMode': isEditMode }" v-if="!isEditMode">목록으로</button>
					<button type="button" class="btn_small" @click="MyQnaCancel" :class="{ 'isEditMode': isEditMode }" v-else>수정취소</button>
				</div>
			</div>
		</form>
	</main>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			qnalist: [],
			QNA_NO: this.$route.query.QNA_NO,
			img_change: 0,
			previewImage: null,
			isEditMode: false,
			qna_title: '',
			qna_content: '',
			qna_answer: ''
		}
	},
	computed: {
		user() {
			return this.$store.state.user; //user 정보가 바뀔 때마다 자동으로 user() 갱신
		},
	},
	mounted() {
		this.getQnaDetail();
	},
	methods: {
		async getQnaDetail() {
            try {
                const response = await axios.get(`http://localhost:3000/mypage/getMyQnaDetail/${this.QNA_NO}`);
                this.qnalist = response.data;
                console.log(this.qnalist);
								this.qna_content = this.qnalist[0].QNA_CONTENT.split('\n').join('<br />');
								this.qna_answer = this.qnalist[0].QNA_ANSWER.split('\n').join('<br />');
            } catch (error) {
                console.error(error);
            }
		},
		formatDateTime(dateTime) {
			const date = new Date(dateTime);
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
            };
            const formattedDateTime = date.toLocaleDateString("ko-KR", options);
            return formattedDateTime;
		},
		MyQnaMain() {
			this.$router.push('/mypage/myqna');
		},
		MyQnaModify() {
      // 수정하기 버튼 클릭 시 실행되는 함수
      this.isEditMode = true;
      this.qna_title = this.qnalist[0].QNA_TITLE;
      this.qna_content = this.qnalist[0].QNA_CONTENT;
    },
    MyQnaCancel() {
      // 수정취소 버튼 클릭 시 실행되는 함수
      this.isEditMode = false;
      this.qna_title = '';
      this.qna_content = '';
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) {
        console.log("파일첨부취소")
        return;
      } else if (file.size > 3 * 1024 * 1024) {
        alert('용량이 3MB 이하인 파일만 업로드하실 수 있습니다.');
        return;
      }
      this.qnalist[0].QNA_IMAGE = file;
			this.previewImage = URL.createObjectURL(this.qnalist[0].QNA_IMAGE);
			this.img_change = 1;
    },
    submitForm() {
      if (!this.validationCheck()) {
        return;
      }
      const formData = new FormData();
      formData.append('qna_no', this.qnalist[0].QNA_NO);
      formData.append('qna_title', this.qnalist[0].QNA_TITLE);
      formData.append('qna_content', this.qnalist[0].QNA_CONTENT);
      if (this.qnalist[0].QNA_IMAGE) {
        formData.append('qna_img', this.qnalist[0].QNA_IMAGE);
      }
      axios.post('http://localhost:3000/mypage/qnamodify', formData).then((res) => {
        if(res.data === 'success') {
          this.$swal({
            icon: 'success',
            title: '수정 성공!',
            showConfirmButton: false,
            timer: 1500
          })
          .then(() => {
            this.$router.go(0);
          })
        } else {
          this.$swal("수정 실패");
        }
      })
      .catch(() => {
        this.$swal("오류 발생")
      })
      this.isEditMode = false;
    },
    validationCheck() {
      if (this.qna_title === '') {
        this.$swal("제목을 입력해주세요.");
        return false;
      }
      if (this.qna_content === '') {
        this.$swal("내용을 입력해주세요.");
        return false;
      }
      return true;
    },
  },
}
</script>

<style src="../assets/css/global.css" scoped />
<style src="../assets/css/boardContent.css" scoped />
<style src="../assets/css/profileInput.css" scoped />
<style scoped>
.input_row {
	margin-bottom: 30px;
}

.textarea_row {
	align-items: start;
	margin-bottom: 50px;
}

.input_row input,
.input_row .textarea_box,
.input_row textarea {
	width: 600px;
}

.input_row input {
	border-radius: 12px !important;
}

.img_up_wrap {
	display: flex;
	justify-content: left;
	align-items: center;
	width: 600px;
}

.img_frame {
  margin-right: 20px;
}

.upload_wrap {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 12px;
}

.upload_wrap #qna_img + label {
  margin-bottom: 20px;
}

.upload_wrap #qna_img + label::after {
  content: '\f093\00a0\00a0업로드';
  font-family: 'Noto Sans KR', FontAwesome, sans-serif;
  font-size: var(--font-regular);
  font-weight: 500;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
}

.upload_wrap.active #qna_img + label::after {
	border: 1px solid var(--color-orange);
	color: var(--color-orange);
	background-color: var(--color-white);
}

.upload_wrap.active #qna_img + label:hover::after {
  background-color: var(--color-orange);
  color: var(--color-white);
}

.upload_wrap:not(.active) #qna_img + label::after {
	border: 1px solid var(--color-gray);
	color: var(--color-gray);
	background-color: #f3f3f3;
	cursor: default;
}
</style>