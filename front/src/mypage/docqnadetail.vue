<template>
	<div>
		<form>
			<div class="qna" v-for="qna in qnadetail" :key="qna.qna_no">
				<div>
					<div class="t2 middle">
						<span style="font-size: 18px; font-style: bold;">작성자&nbsp;&nbsp;{{ qnadetail[0].USER_NM }}</span>
						<img class="pet_face" :src="getQnaImg()">
					</div>

					<div class=t2>제목
					</div>
					<textarea class="text2" v-model="qnadetail[0].QNA_TITLE"
						style="font-size: 17px;" readonly></textarea>

					<div class="t2">내용</div>
					<div></div>
					<textarea class="text1" v-model="qnadetail[0].QNA_CONTENT"
						style="font-size: 17px;" readonly></textarea>

				</div>
				<div>
					<div class="t2 middle">
						<span style="font-size: 18px; font-style: bold;">담당의&nbsp;&nbsp;{{ qnadetail[0].DOC_NM }}</span>
					</div>
					<div class="t2">내용</div>
					<div></div>
					<textarea class="text1" v-model="qnadetail[0].QNA_ANSWER"
						style="font-size: 17px;"></textarea>

				</div>
				<div class="btn_area">
                    <button type="button" class="main_btn" @click="DAnswerWrite">답변작성/수정</button>
					<button type="button" class="main_btn" @click="DQnaMain">목록으로</button>
				</div>
			</div>
		</form>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			qnadetail: [],
		};
	},
	mounted() {
		axios({
			url: "http://localhost:3000/mypage/mypage/docqna/detail",
			method: "POST",
			data: {
				qna_no: this.$route.query.qna_no
			},
		}).then(response => {
			console.log(response.data);
			this.qnadetail = response.data;
		}).catch(error => {
			alert(error);
		});
	},
	methods: {
        DAnswerWrite() {
			console.log("의료진문의목록관리페이지")
			this.$router.push('/mypage/docqna');
		},
		DQnaMain() {
			console.log("의료진문의목록관리페이지")
			this.$router.push('/mypage/docqna');
		},
		getQnaImg() {
			if (this.qnadetail[0].QNA_IMAGE) {
				return require('../../../back/uploads/uploadQna/' + this.qnadetail[0].QNA_IMAGE);
			} else {
				return require('../assets/imgempty.png');
			}
		},
	}
}
</script>

<style scoped>
* {
	margin: 0;
	padding: 0;
}

.btn_area {
	align-items: center;
	display: flex;
	vertical-align: middle;
	height: 100px;
	margin: auto;
	padding: auto;
	justify-content: flex-start;
}

.qna {
	margin: auto;
	padding: 30px;
	max-width: 900px;
}

.qna textarea {
	width: 100%;
}

.text1 {
	resize: none;
	height: 100px;
}

.text2 {
	resize: none;
	height: 25px;
}

.text3 {
	resize: none;
	height: 100px;
	margin-bottom: 50px;
}

.main_btn {
	font-size: 16px;
	width: 80px;
	height: 50px;
	background-color: rgb(255, 225, 160);
	border: black;
	border-radius: 4px;
	vertical-align: middle;
}

.right_btn {
	margin-left: auto;
}

.btn {
	font-size: 16px;
	width: 80px;
	height: 50px;
	margin-left: auto;
	background-color: skyblue;
	border: none;
	border-radius: 4px;
	margin: 3px
}

.btn:hover {
	background-color: rgb(29, 170, 226);
}

.t2 {
	margin: 20px 0px 5px 0px;
	font-size: 17px;
	font-weight: bold;
}

.text3:focus {
	outline: none;
}
</style>

<style scoped>
.middle {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.pet_face {
	width: 100px;
	height: 100px;
}
</style>