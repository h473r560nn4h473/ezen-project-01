<template>
    <div>
        <form @submit.prevent="submitForm">
            <label for="goods_nm">상품명:</label>
            <input type="text" id="goods_nm" v-model="goods_nm" required>
            <br>
            <label for="goods_price">상품가격:</label>
            <input type="text" id="goods_price" v-model="goods_price" @input="bindNumber" required>
            <br>
            <label for="productImage">상품사진:</label>
            <input type="file" id="goods_img" @change="onFileChange" required>
            <tr>용량제한 3MB</tr>
            <br>
            <img :src="previewImage" v-if="previewImage" style="max-width: 200px; max-height: 200px;">
            <button type="submit">제출</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
		return {
			goods_nm: '',
            goods_price: '',
            goods_img: null,
            previewImage: null,
		};
	},
	computed: {
        user() {
            return this.$store.state.user;
        }
    },
    mounted() {
        if (this.user.user_no == '') {
            this.$swal("관리자 외 접근제한 페이지입니다.");
            this.$router.push({ path: '/login' });
        } else {
            axios({
                url: "http://localhost:3000/auth/admin_check",
                method: "POST",
                data: {
                    user_no: this.user.user_no,
                },
            }).then(res => {
                if (res.data.message == 'admin') {
                    console.log(res.data.message);
                }
                else if (res.data.message == 'user') {
                    this.$swal("관리자 외 접근제한 페이지입니다.");
                    this.$router.push({ path: '/' });
                }
            }).catch(() => {
                this.$swal("접속 오류");
            })
        }
    },
	methods: {
        onFileChange(e) {
            //alert가 출력되어 확인을 눌렀을 때 브라우저에서 [Violation] 'change' handler took *ms 경고 발생하는데 alert 창이 켜져있었다는 수준의 경고이므로 무시해도 됨
            const file = e.target.files[0];
            if (file.size > 3 * 1024 * 1024) {
                alert('용량이 3MB 이하인 파일만 업로드하실 수 있습니다.');
                e.target.value = '';
                return;
            }
            this.goods_img = file;
            this.previewImage = URL.createObjectURL(this.goods_img);
        },
        submitForm() {
            const formData = new FormData();
            formData.append('goods_nm', this.goods_nm);
            formData.append('goods_price', this.goods_price);
            formData.append('goods_img', this.goods_img);
            axios.post('http://localhost:3000/goods/admin/add_goods', formData).then((res) => {
                if(res.data === 'success') {
                    this.$swal({
                        icon: 'success',
                        title: '제품 등록 성공!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    .then(() => {
                        window.location.href = "http://localhost:8080/admin/goodslist";
                    })
                } else {
                    this.$swal("제품 등록 실패");
                }
            })
            .catch(() => {
                this.$swal("오류 발생")
            })
        },
        bindNumber(event) {
            this.goods_price = event.target.value.replace(/[^0-9]/g, '');
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

.goods {
	margin: auto;
	padding: 30px;
	max-width: 900px;
}

.goods textarea {
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