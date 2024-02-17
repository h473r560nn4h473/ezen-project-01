<template>
	<main>
		<div class="title">
			<h1>진료 후기</h1>
		</div>
		<form>
			<div class="wrap" v-for="review in reviewdetail" :key="review.rvw_no">
				<div class="top_wrap">
					<div class="top">담당의&nbsp;&nbsp;{{ reviewdetail[0].DOC_NM }}</div>
				</div>
				<div>
					<div class="input_row">
						<div><span class="bar"></span>제목</div>
						<input type="text" v-model="reviewdetail[0].RVW_TITLE" :disabled="editable === false">
					</div>
					<div class="input_row textarea_row">
						<div class="textarea_title"><span class="bar"></span>내용</div>
						<div class="textarea_box" v-show="!editable" v-html="rvw_content"></div>
						<textarea type="text" v-show="editable" v-model="reviewdetail[0].RVW_CONTENT"></textarea>
					</div>
					<div class="input_row pic_row">
						<div><span class="bar"></span>사진</div>
						<div class="img_up_wrap">
							<div v-if="!rvw_image" class="img_frame">
								<img src="../assets/imgempty.svg" alt="null">
							</div>
							<div v-else-if="rvw_image && this.img_change === 0" class="img_frame">
								<img :src="require(`../../../back/uploads/uploadReview/${rvw_image}`)" alt="...">
							</div>
							<div v-else class="img_frame">
								<img :src="previewImage" v-if="previewImage" />
							</div>
							<div class="upload_wrap" :class="{ 'active': editable }">
								<input type="file" id="rvw_img" accept=".png, .jpg, .jpeg" @change="onFileChange" :disabled="!editable">
								<label for="rvw_img"></label>
								<div class="img_upload_txt">
									<div>지원되는 확장자 .png, .jpg, .jpeg</div>
									<div>용량제한 3MB</div>
									<div>180px &#215; 180px 추천</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- <div class="img_wrap"><div class="img_frame"><img :src="getReviewImg()"></div></div>-->
				<div class="btn_area">
					<button type="button" class="btn_small" @click="editContent()" :class="{ 'editable': editable }" v-if="!editable">수정하기</button>
					<button type="button" class="btn_small" @click="confirmEditContent()" :class="{ 'editable': editable }" v-else>수정완료</button>
					<button type="button" class="btn_small" @click="DReviewMain" :class="{ 'editable': editable }" v-if="!editable">목록으로</button>
					<button type="button" class="btn_small" @click="editContentCancel" :class="{ 'editable': editable }" v-else>수정취소</button>
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
			reviewdetail: [],
			rvw_content: '',
			rvw_image: '',
			editable: false,
			previewImage: null,
			img_change: 0,
		};	
	},
	computed: {
		user() {
			return this.$store.state.user;
		}
	},
	mounted() {
		axios({
			url: "http://localhost:3000/mypage/docpage/docreview/detail",
			method: "POST",
			data: {
				rvw_no: this.$route.query.rvw_no
			},
		}).then(response => {
			console.log(response.data);
			this.reviewdetail = response.data;
			//console.log(this.reviewdetail);
			this.rvw_content = this.reviewdetail[0].RVW_CONTENT.split('\n').join('<br />');
			this.rvw_image = this.reviewdetail[0].RVW_IMG;
			//console.log(this.reviewdetail[0].rvw_no);
		}).catch(error => {
			alert(error);
		})
	},
	methods: {
		editContent() {
				this.editable = true;
		},
		editContentCancel() {
      // 수정취소 버튼 클릭 시 실행되는 함수
      this.editable = false;
    },
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
      this.rvw_image = file;
      this.previewImage = URL.createObjectURL(this.rvw_image);
			this.img_change = 1;
    },
		confirmEditContent() {
			const formData = new FormData();
			formData.append('rvw_no', this.reviewdetail[0].rvw_no);
      formData.append('rvw_title', this.reviewdetail[0].RVW_TITLE);
      formData.append('rvw_content', this.reviewdetail[0].RVW_CONTENT);
			if (this.rvw_image) {
				formData.append('rvw_image', this.rvw_image);
			}
			axios.post("http://localhost:3000/review/docreviewedit", formData).then((res) => {
        if(res.data === 'success') {
          this.$swal({
            icon: 'success',
            title: '수정되었습니다.',
            showConfirmButton: false,
            timer: 1500
          })
          .then(() => {
            this.editable = false;
						this.$router.go(0);
          })
        } else {
          this.$swal("동일한 문의가 존재합니다.");
        }
      })
      .catch(() => {
        this.$swal("오류 발생")
      })
    },
    DReviewMain() {
			console.log("의료진진료기록관리페이지")
			this.$router.push('/docpage/docreview');
		}
	}
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

#rvw_img + label {
  margin-bottom: 20px;
}

#rvw_img + label::after {
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

#rvw_img + label:hover::after {
  background-color: var(--color-orange);
  color: var(--color-white);
}

.upload_wrap.active #rvw_img + label::after {
border: 1px solid var(--color-orange);
color: var(--color-orange);
background-color: var(--color-white);
}

.upload_wrap.active #rvw_img + label:hover::after {
  background-color: var(--color-orange);
  color: var(--color-white);
}

.upload_wrap:not(.active) #rvw_img + label::after {
border: 1px solid var(--color-gray);
color: var(--color-gray);
background-color: #f3f3f3;
cursor: default;
}

</style>