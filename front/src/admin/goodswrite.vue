<template>
    <div @submit.prevent="onSubmitWrite" class="form-container">
        <form class="write-form">
            <div class="ALL">
                <label class="top" style="font-size: 40px; font-style: bold;">상품등록</label>
                <div class="form-group2">
                    <label for="goods_nm" class="form-label">상품명</label>
                    <input type="text" v-model="goods_nm" class="form-input">
                </div>
  
                <div class="form-group2">
                    <label for="goods_price" class="form-label">상품가격</label>
                    <input type="text" v-model="goods_price" class="form-input" @input="bindNumber">
                </div>
            <div >
                <label >이미지 첨부* </label>
                <div >
                    <input type="file" accept="image/*" @change="uploadFile($event.target.files)"> 
                </div>
            </div>
                <button type="submit" :disabled="loadingImg === undefined || !loadingImg">등록</button>
            </div>
        
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
            goods_image: '',
            loadingImg: undefined,
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
        async uploadFile(file) {
            let name = "";
            if (file) {
                name = file[0].name;
            } else {
                return;     // 파일 미선택 시 반환
            }

            const formData = new FormData();
            
            formData.append('img', file[0]);
            try {  
                axios({
                    url: `http://localhost:3000/goods/admin/upload_img`,
                    method: 'POST',
                    headers: {'Content-Type': 'multipart/form-data'},
                    data: formData
                })
                .then ((response) => {
                    if (response.data.message == 'success'){
                        this.goods_image = name;
                        console.log("이미지로딩중");
                        this.loadingImg = true;
                    } else {
                        this.loadingImg = false;
                        this.$swal("DB 에러");
                    }
                })
                .catch(e => {
                    console.log(e);
                })
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        },
        onSubmitWrite() {
            axios({
                url: "http://localhost:3000/goods/admin/add_goods",
                method: "POST", 
                data: { 
                    goods_nm: this.goods_nm,
                    goods_price: this.goods_price,
                    goods_img: this.goods_image,
                },
            })
            .then((res) => {
                if(res.data.message=='add_complete'){
                    this.$swal({
                        icon: 'success',
                        title: '제품 등록 성공!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    .then(() => {
                        window.location.href = "http://localhost:8080/admin/goodslist";
                    })
                } else if (res.data.message == 'already_exist_goods'){
                    this.$swal("이미 등록된 제품입니다.");
                } else if (res.data.message == '파일 변경 실패'){
                    this.$swal("파일 변경 실패");
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

<style scoped>
.middle {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.goods_img {
	width: 100px;
	height: 100px;
}
</style>