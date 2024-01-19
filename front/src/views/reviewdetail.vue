<template>
	<main class="content_wrap">
		<div class="title">
			<h1>진료 후기</h1>
		</div>
		<form>
			<div class="wrap" v-for="review in reviewdetail" :key="review.rvw_no">
				<div class="top_wrap">
					<div class="top">담당의&nbsp;&nbsp;{{ reviewdetail[0].DOC_NM }}</div>
				</div>
				<table class="content_wrap">
					<tr>
						<th><span class="bar"></span>제목</th>
						<td>{{ reviewdetail[0].RVW_TITLE }}</td>
					</tr>
					<tr>
						<th><span class="bar"></span>작성일자</th>
						<td>{{ formatDateTime(reviewdetail[0].RVW_DATE) }}</td>
					</tr>
					<tr>
						<th><span class="bar"></span>내용</th>
						<td v-html="rvw_content"> </td>
					</tr>
				</table>
				<div class="img_wrap"><div class="img_frame"><img :src="require('../../../back/uploads/uploadReview/' + `${reviewdetail[0].RVW_IMG}`)"></div></div>
				<div class="btn_area">
					<button type="button" class="btn_small" @click="MyReviewMain">목록으로</button>
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
			rvw_content:''
		}
	},
	mounted() {
		axios({
			url: "http://localhost:3000/review/reviewdetail",
			method: "POST",
			data: {
				rvw_no: this.$route.query.rvw_no
			},
		}).then(response => {
			console.log(response.data);
			this.reviewdetail = response.data;
			this.rvw_content = this.reviewdetail[0].RVW_CONTENT.split('\n').join('<br />');
		}).catch(error => {
			alert(error);
		});
	},
	methods: {
		MyReviewMain() {
			//console.log("일반유저페이지")
			this.$router.push('/review');
		},
		formatDateTime(dateTime) {
			const date = new Date(dateTime);
			const formattedDateTime = date.toLocaleString('ko-KR');
			return formattedDateTime;
		}
	}
}
</script>

<style src="../assets/css/global.css" scoped />
<style src="../assets/css/boardContent.css" scoped />