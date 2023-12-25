<template>
    <main class="mt-3">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
        <div class="container">
            <table class="table caption-top reviewlist-table">
                <caption>
                    <div class="list-title">
                        <h2>진료기록 관리</h2>
                        <div class="search_bar">
                            <input v-model="keyword" class="form-control me-2" type="text" placeholder="의사 아이디 검색"
                                @keyup.enter="getReviewList(sortACase)">
                            <button class="btn btn-secondary" type="submit" @click="getReviewList(sortACase)"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="list-title2">
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ sortACase }}
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a class="dropdown-item" href="#" @click="sortList(0)">최근 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(1)">오래된 순</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </caption>
                <thead class="table-light">
                    <tr>
                        <th scope="col" style="display: none;">번호</th>
                        <th scope="col">동물등록번호</th>
                        <th scope="col">의사 아이디</th>
                        <th scope="col">진료명</th>
                        <th scope="col">작성일</th>
                        <!-- <th scope="col">동물사진</th> -->
                        <th scope="col"> </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(review, i) in pageReviewList" :key="i" @click="movetoareview(review.rvw_no)">
                        <th scope="row" style="display: none;">{{ pageNum * onePageCnt + i + 1 }}</th>
                        <td>{{ review.pet_no }}</td>
                        <td>{{ review.doc_id }}</td>
                        <td>{{ review.rvw_title }}</td>
                        <td>{{ formatDateTime(review.rvw_date) }}</td>
                        <!-- <td>
                            <div v-if="pet.pet_img" class="col-md-4 pet-img" style="text-align : center;">
                                <img :src="require(`../../../back/uploads/uploadPet/${pet.pet_img}`)" alt="..." style="border-radius:100%">
                            </div>
                            <div v-else class="col-md-4 pet-img" style="text-align : center;">
                                <img :src="require(`../assets/imgempty.png`)" class="img-fluid rounded-start" alt="..." style="border-radius:100%">
                            </div>
                        </td> -->
                        <td><button class="btn btn-outline-danger" @click="confirmDeleteReview(review)">삭제</button></td>
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
            reviewList: [],
            // pet: [],
            sortACase: "최근 순",
            keyword: '',
            pageReviewList: [],  // 한 페이지에 보여줄 굿즈 리스트를 잘라 담을 새 리스트
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
        this.getReviewList();
    },
    methods: {
        setPage(page) {
            this.pageReviewList = []
            this.pageNum = page - 1;
            this.sliceList()
        },
        sliceList() {
            const start = 0 + this.pageNum * this.onePageCnt
            this.pageReviewList = this.reviewList.slice(start, start + this.onePageCnt);
        },
        async getReviewList(sortACaseNum) {
            let keyword = 'none'

            if (this.keyword != '') {
                keyword = this.keyword;
            }
            try {
                const response = await axios.get(`http://localhost:3000/review/admin/reviewlist/${sortACaseNum}/${keyword}`);
                this.reviewList = response.data;
                this.pageCnt = Math.ceil(this.reviewList.length / this.onePageCnt)
                this.setPage(1)

            } catch (error) {
                console.error(error);
            }
        },
        sortList(sortNum) {
            if (sortNum == 0) {
                this.sortACase = "최근 순"
            } else if (sortNum == 1) {
                this.sortACase = "오래된 순"
            }
            this.getReviewList(sortNum)
                .then(() => {
                    this.$router.push({ path: '/admin/reviewList' });
                })
        },
        formatDateTime(dateTime) {
            const date = new Date(dateTime);
            const formattedDateTime = date.toLocaleString('ko-KR');
            return formattedDateTime;
        },
        confirmDeleteReview(review) {
            this.$swal({
                title: `진료기록을 삭제하시겠습니까?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    this.deleteReview(review);
                    this.$swal({
                        position: 'top',
                        icon: 'success',
                        title: '삭제되었습니다',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    .then(() => {
                        this.$router.go(this.$router.currentRoute);
                        }
                    )
                }
            });
        },
        async deleteReview(review) {
            console.log('삭제 버튼 클릭 - 진료기록:', review);
            try {
                const response = await axios.delete(`http://localhost:3000/review/admin/reviewlist/${review.rvw_no}`);
                console.log('진료기록 삭제 성공:', response.data);
                this.reviewList = this.reviewList.filter(r => r.rvw_no !== review.rvw_no);
            } catch (error) {
                console.error('진료기록 삭제 실패:', error);
            }
        },
        movetoareview(rvw_no) {
            window.location.href = window.location.pathname + '/reviewdetail?rvw_no=' + rvw_no;
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

.pet-img {
    width: auto;
    height: auto;
    max-width: 100px;
}
</style>