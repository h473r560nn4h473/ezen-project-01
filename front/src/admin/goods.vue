<template>
    <main class="mt-3">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
        <div class="container">
            <table class="table caption-top goodslist-table">
                <caption>
                    <div class="list-title">
                        <h2>상품 관리</h2>
                        <div class="search_bar">
                            <input v-model="keyword" class="form-control me-2" type="text" placeholder="상품명 검색"
                                @keyup.enter="getGoodsList(sortACase)">
                            <button class="btn btn-secondary" type="submit" @click="getGoodsList(sortACase)"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="list-title2">
                            <button class="btn btn-outline-danger" @click="writeGoods(goods)">상품 등록</button>&nbsp;
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ sortACase }}
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a class="dropdown-item" href="#" @click="sortList(0)">최근 등록 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(1)">오래된 등록 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(2)">가격 높은 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(3)">가격 낮은 순</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </caption>
                <thead class="table-light">
                    <tr>
                        <th scope="col" style="display: none;">번호</th>
                        <th scope="col">상품명</th>
                        <th scope="col">상품이미지</th>
                        <th scope="col">상품가격</th>
                        <th scope="col">상품등록시간</th>
                        <th scope="col"> </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(goods, i) in pageGoodsList" :key="i">
                        <th scope="row" style="display: none;">{{ pageNum * onePageCnt + i + 1 }}</th>
                        <td>{{ goods.GOODS_NM }}</td>
                        <img v-if="goods.GOODS_IMG && isImgHere(goods.GOODS_IMG)" :src="require(`../../../back/uploads/uploadGoods/${goods.GOODS_IMG}`)" class="goods-img"> <!-- db에 goods_img 값이 있음 + 값과 일치하는 이름을 가진 파일이 존재함 -->
                        <img v-else-if="goods.GOODS_IMG" :src="require(`../assets/imgempty.png`)" class="goods-img">    <!-- db에 goods_img 값이 있지만 파일은 존재하지 않음 -->
                        <img v-else :src="require(`../assets/imgempty.png`)" class="goods-img"> <!-- 그 외의 모든 경우 -->
                        <td>{{ goods.GOODS_PRICE }}</td>
                        <td>{{ formatDateTime(goods.GOODS_DATE) }}</td>
                        <td><button class="btn btn-outline-danger" @click="modifyGoods(goods.GOODS_NO)">수정</button>&nbsp;<button class="btn btn-outline-danger" @click="deleteGoods(goods.GOODS_NO)">삭제</button></td>
                    </tr>
                </tbody>
            </table>
            <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-center">
                    <ul v-for="i in pageCnt" :key="i" class="pagination justify-content-center">
                        <a href="#top" style="text-decoration: none;">
                            <li v-if="i != pageNum + 1" class="page-item page-link" @click="setPage(i)">{{ i }}</li>
                            <li v-else class="page-item page-link active" @click="setPage(i)">{{ i }}</li>
                        </a>
                    </ul>
                </ul>
            </nav>
        </div>
    </main>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            goodsList: [],
            sortACase: "최근 등록 순",
            keyword: '',
            pageGoodsList: [],  // 한 페이지에 보여줄 굿즈 리스트를 잘라 담을 새 리스트
            pageNum: 0,
            pageCnt: 0,
            onePageCnt: 10,
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    mounted() {
        if (this.user.user_no == '') {
            // 일단은 로그인 상태 체크 
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
    created() {
        this.getGoodsList();
    },
    methods: {
        setPage(page) {
            this.pageGoodsList = []
            this.pageNum = page - 1;
            this.sliceList()
        },
        sliceList() {
            const start = 0 + this.pageNum * this.onePageCnt
            this.pageGoodsList = this.goodsList.slice(start, start + this.onePageCnt);
        },
        async getGoodsList(sortACaseNum) {
            let keyword = 'none'

            if (this.keyword != '') {
                keyword = this.keyword;
            }
            try {
                const response = await axios.get(`http://localhost:3000/goods/admin/goodslist/${sortACaseNum}/${keyword}`);
                this.goodsList = response.data;
                this.pageCnt = Math.ceil(this.goodsList.length / this.onePageCnt)
                this.setPage(1)

            } catch (error) {
                console.error(error);
            }
        },
        isImgHere(fileName) {
            try {
                require(`../../../back/uploads/uploadGoods/${fileName}`);   //파일이 존재하는지 확인
                return true;
            } catch (e) {
                return false;
            }
        },
        sortList(sortNum) {
            if (sortNum == 0) {
                this.sortACase = "최근 등록 순"
            } else if (sortNum == 1) {
                this.sortACase = "오래된 등록 순"
            }
            else if (sortNum == 2) {
                this.sortACase = "가격 높은 순"
            }
            else if (sortNum == 3) {
                this.sortACase = "가격 낮은 순"
            }
            this.getGoodsList(sortNum)
                .then(() => {
                    this.$router.push({ path: '/admin/goodslist' });
                })
        },
        formatDateTime(dateTime) {
            const date = new Date(dateTime);
            const formattedDateTime = date.toLocaleString('ko-KR');
            return formattedDateTime;
        },
        deleteGoods(goodsno) {
            this.$swal({
                title: `정말로 상품을 삭제하시겠습니까?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                reverseButtons: true,
            }).then(result => {
                if (result.value) {
                    axios({
                        url: `http://localhost:3000/goods/admin/delete_goods`,
                        method: "POST",
                        data: {
                            GOODS_NO: goodsno
                        },
                    }).then(res => {
                        if (res.data.message == 'delete_complete') {
                            this.$swal("상품이 삭제되었습니다.")
                            .then(() => { window.location.href = `http://localhost:8080/admin/goodslist` });
                        }
                    }).catch(() => {
                        this.$swal("오류 발생");
                    });
                }
            });
        },
        modifyGoods(GOODS_NO) {
            window.location.href = window.location.pathname + '/goodsmodify?goods_no=' + GOODS_NO;
        },
        writeGoods() {
            window.location.href = `http://localhost:8080/admin/goodswrite`;
        },
    }
};
</script>

<style scoped>
th,
td {
    vertical-align: middle;
    font-size: 15.5px;
}

.list-title {
    margin: 13px 0px;
    display: flex;
    justify-content: space-between;
}

.list-title2 {
    vertical-align: middle;
    display: inline-flex;
    margin: auto 0px;
}

.dropdown {
    margin: 0px 2px;
}

.btn-area button {
    margin: 0px 2px;
}

.search_bar {
    margin: auto;
    display: flex;
}

.goods-img {
    max-width: 100px;
    width: "50%";
    max-height: 100px;
    height: "50%";
}
</style>