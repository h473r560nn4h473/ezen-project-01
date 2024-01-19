<template>
	<main>
		<div class="title">
			<h1>예약 내용</h1>
		</div>
		<form>
			<div class="wrap" v-for="reservation in reservationdetail" :key="reservation.RES_NO">
				<div class="top_wrap">
					<div class="top">담당의&nbsp;&nbsp;{{ reservationdetail[0].DOC_NM }}</div>
				</div>
				<table class="content_wrap">
					<tr>
						<th><span class="bar"></span>제목</th>
						<td>{{ reservationdetail[0].RES_TITLE }}</td>
					</tr>
					<tr>
						<th><span class="bar"></span>예약 시간</th>
						<td>{{ formatDateTime(reservationdetail[0].RES_DATE) }} {{ reservationdetail[0].RES_TIME }}</td>
					</tr>
					<tr>
						<th><span class="bar"></span>내용</th>
						<td v-html="res_content"></td>
					</tr>
				</table>
				<div class="btn_area">
					<button type="button" class="btn_small" @click="MyReservationMain">목록으로</button>
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
			reservationdetail: [],
			RES_NO: this.$route.query.RES_NO,
			res_content: ''
		}
	},
	mounted() {
		this.getReservationDetail();
	},
	methods: {
		async getReservationDetail() {
			try {
            const response = await axios.get(`http://localhost:3000/reservation/reservationdetail/${this.RES_NO}`);
            this.reservationdetail = response.data;
            console.log(this.reservationdetail);
						this.res_content = this.reservationdetail[0].RES_CONTENT.split('\n').join('<br />');
            } catch (error) {
                console.error(error);
            }
		},
		MyReservationMain() {
			//console.log("일반유저페이지")
			this.$router.push('/docpage/docreservation');
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
		}
	}
}
</script>

<style src="../assets/css/global.css" scoped />
<style src="../assets/css/boardContent.css" scoped />