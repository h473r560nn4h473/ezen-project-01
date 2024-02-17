<template>
	<main>
		<div class="title">
			<h1>QNA</h1>
		</div>
		<form>
			<div class="wrap" v-for="qna in qnalist" :key="qna.QNA_NO">
				<div class="top_wrap">
					<div class="top">질문자&nbsp;&nbsp;{{ qnalist[0].USER_NM }}</div>
				</div>
				<div>
					<div class="input_row">
						<div><span class="bar"></span>제목</div>
						<div class="textarea_box">{{ qnalist[0].QNA_TITLE }}</div>
					</div>
					<div class="input_row">
						<div><span class="bar"></span>작성일자</div>
						<div class="textarea_box">{{ formatDateTime(this.qnalist[0].QNA_DATE) }}</div>
					</div>
					<div class="input_row textarea_row">
						<div class="textarea_title"><span class="bar"></span>내용</div>
						<div class="textarea_box" v-html="qna_content"></div>
					</div>	
					<div class="input_row textarea_row">
						<div class="textarea_title"><span class="bar"></span>답변</div>
						<div v-if="qnalist[0].qna_state == 1" class="textarea_box" v-show="!editable" v-html="qna_answer"></div>
						<div v-else class="textarea_box" v-show="!editable">답변 없음</div>
						<textarea type="text" v-show="editable" v-model="qnalist[0].QNA_ANSWER"></textarea>
					</div>
					<div class="input_row pic_row">
						<div><span class="bar"></span>사진</div>
						<div class="img_up_wrap">
							<div v-if="!qnalist[0].QNA_IMAGE" class="img_frame">
								<img src="../assets/imgempty.svg" alt="null">
							</div>
							<div v-else class="img_frame">
								<img :src="require(`../../../back/uploads/uploadQna/${qnalist[0].QNA_IMAGE}`)" alt="...">
							</div>
						</div>	
					</div>
				</div>	

				<div class="btn_area">
						<button type="button" class="btn_small" @click="editAnswer()" :class="{ 'editable': editable }" v-if="!editable">답변 작성</button>
						<button type="button" class="btn_small" @click="confirmEditAnswer()" :class="{ 'editable': editable }" v-else>작성완료</button>
						<button type="button" class="btn_small" @click="goToQNA" :class="{ 'editable': editable }" v-if="!editable">목록으로</button>
						<button type="button" class="btn_small" @click="editAnswerCancel()" :class="{ 'editable': editable }" v-else>답변취소</button>
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
            editable: false,
						QNA_NO: this.$route.query.qna_no,
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
			editAnswer() {
				this.editable = true;
			},
			editAnswerCancel() {
				this.editable = false;
			},
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
			confirmEditAnswer() {
				axios({
					url: "http://localhost:3000/qna/docqnaUpdate",
					method: "POST",
					data: {
						qna_no:this.qnalist[0].QNA_NO,
						qna_answer:this.qnalist[0].QNA_ANSWER,
					},
				})
				.then(res => {
					if(res.data.message === 'success') {
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
					}
					else {
						this.$swal("DB오류 발생");
					}
				})
				.catch(() => {
					this.$swal("오류 발생")
				})
				
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
			goToQNA() {
				this.$router.push('/docpage/docqna');
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

</style>