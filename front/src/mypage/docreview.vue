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
                            <input v-model="keyword" class="form-control me-2" type="text" placeholder="동물등록번호 검색"
                                @keyup.enter="getReviewList(sortRCase)">
                            <button class="btn btn-secondary" type="submit" @click="getReviewList(sortRCase)"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="list-title2">
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ sortRCase }}
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a class="dropdown-item" href="#" @click="sortList(0)">최근 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(1)">오래된 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(2)">조회수 높은 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(3)">조회수 낮은 순</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </caption>
                <thead class="table-light">
                    <tr>
                        <th scope="col" style="display: none;">번호</th>
                        <th scope="col">동물등록번호</th>
                        <th scope="col">담당의</th>
                        <th scope="col">진료명</th>
                        <th scope="col">작성일</th>
                        <th scope="col">조회수</th>
                        <th scope="col"> </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(review, i) in pageReviewList" :key="i">
                        <th scope="row" style="display: none;">{{ pageNum * onePageCnt + i + 1 }}</th>
                        <td @click="movetodreview(review.RVW_NO)">{{ review.PET_NO }}</td>
                        <td @click="movetodreview(review.RVW_NO)">{{ review.DOC_NM }}</td>
                        <td @click="movetodreview(review.RVW_NO)">{{ review.RVW_TITLE }}</td>
                        <td @click="movetodreview(review.RVW_NO)">{{ formatDateTime(review.RVW_DATE) }}</td>
                        <td @click="movetodreview(review.RVW_NO)">{{ review.RVW_COUNT }}</td>
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
            sortRCase: "최근 순",
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
        async getReviewList(sortRCaseNum) {
            let keyword = 'none'

            if (this.keyword != '') {
                keyword = this.keyword;
            }
            try {
                const response = await axios.get(`http://localhost:3000/mypage/mypage/docreview/${this.user.user_id}/${sortRCaseNum}/${keyword}`);
                this.reviewList = response.data;
                this.pageCnt = Math.ceil(this.reviewList.length / this.onePageCnt)
                this.setPage(1)

            } catch (error) {
                console.error(error);
            }
        },
        sortList(sortNum) {
            if (sortNum == 0) {
                this.sortRCase = "최근 순"
            } else if (sortNum == 1) {
                this.sortRCase = "오래된 순"
            }
            else if (sortNum == 2) {
                this.sortRCase = "조회수 높은 순"
            }
            else if (sortNum == 3) {
                this.sortRCase = "조회수 낮은 순"
            }
            this.getReviewList(sortNum)
                .then(() => {
                    this.$router.push({ path: '/mypage/docreview' });
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
                const response = await axios.delete(`http://localhost:3000/mypage/mypage/docreview/${this.user.user_id}/${review.RVW_NO}`);
                console.log('진료기록 삭제 성공:', response.data);
                this.reviewList = this.reviewList.filter(r => r.RVW_NO !== review.RVW_NO);
            } catch (error) {
                console.error('진료기록 삭제 실패:', error);
            }
        },
        movetodreview(RVW_NO) {
            window.location.href = window.location.pathname + '/detail?rvw_no=' + RVW_NO;
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