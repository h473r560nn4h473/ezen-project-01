<template>
    <div @submit.prevent="onSubmitModify" class="form-container" v-for="goods in goodslist" :key="goods.goods_no">
        <form class="write-form">
            <div class="ALL">
                <label class="top" style="font-size: 40px; font-style: bold;">상품 수정</label>
                <div class="form-group">
                    <label for="goods_nm" class="form-label">상품명</label>
                    <input type="text" v-model="goodslist[0].GOODS_NM" class="form-input">
                </div>
  
                <div class="form-group2">
                    <label for="goods_price" class="form-label">상품가격</label>
                    <input type="text"  v-model="goodslist[0].GOODS_PRICE" class="form-input" @input="bindNumber">
                    <tr></tr>
                </div>
            <div >
                <label >현재 이미지 </label>
                <div >
                    <img class="goods_img" :src="getGoodsImg()">
                </div>
            </div>
                <button type="submit">등록</button>
            </div>
        
        </form>

    </div>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			goodslist: [],
		};
	},
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    mounted() {
        axios({
            url: "http://localhost:3000/goods/admin/goodsmodify",
            method: "POST",
            data: {
                goods_no: this.$route.query.goods_no
            },
        }).then(response => {
            console.log(response.data);
            this.goodslist = response.data;
        }).catch(error => {
            alert(error);
        });

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
                if (res.data.message == 'user') {
                    this.$swal("관리자 외 접근제한 페이지입니다.");
                    this.$router.push({ path: '/' });
                }
            }).catch(() => {
                this.$swal("접속 오류");
            });
        }
    },
	methods: {
		gotoGoodsList() {
			console.log("관리자페이지")
			this.$router.push('/admin/goodslist');
		},
		getGoodsImg() {
			if (this.goodslist[0].GOODS_IMG) {
				return require('../../../back/uploads/uploadGoods/' + this.goodslist[0].GOODS_IMG);
			} else {
				return require('../assets/imgempty.png');
			}
		},
        onSubmitModify() {
            axios.post("http://localhost:3000/goods/admin/update_goods", {
                GOODS_NO: this.goodslist[0].GOODS_NO,
                GOODS_NM: this.goodslist[0].GOODS_NM,
                GOODS_PRICE: this.goodslist[0].GOODS_PRICE,
            })
            .then((response) => {
                if(response.data.message=='modify_complete'){
                    this.$swal({
                        icon: 'success',
                        title: '상품 내용이 수정되었습니다',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    .then(() => {
                        this.$router.push('/admin/goodslist');
                    })
                } 
                else if (response.data.message == 'modify_failed'){
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