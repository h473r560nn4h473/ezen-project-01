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
                                @keyup.enter="getReviewList(sortCase)">
                            <button class="btn btn-secondary" type="submit" @click="getReviewList(sortCase)"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="list-title2">
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ sortCase }}
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a class="dropdown-item" href="#" @click="sortList(0)">오래된 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(1)">최근 순</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </caption>
                <thead class="table-light">
                    <tr>
                        <th scope="col">번호</th>
                        <th scope="col">동물등록번호</th>
                        <th scope="col">의사 아이디</th>
                        <th scope="col">진료명</th>
                        <th scope="col">작성일</th>
                        <th scope="col">조회수</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(review, i) in pageReviewList" :key="i">
                        <th scope="row">{{ pageNum * onePageCnt + i + 1 }}</th>
                        <td>{{ review.pet_no }}</td>
                        <td>{{ review.doc_id }}</td>
                        <td>{{ review.rvw_title }}</td>
                        <td>{{ formatDateTime(review.rvw_date) }}</td>
                        <td>{{ review.rvw_count }}</td>
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
            sortCase: "최근 순",
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
        async getReviewList(sortCaseNum) {
            let keyword = 'none'

            if (this.keyword != '') {
                keyword = this.keyword;
            }
            try {
                const response = await axios.get(`http://localhost:3000/review/nreview/${sortCaseNum}/${keyword}`);
                this.reviewList = response.data;
                this.pageCnt = Math.ceil(this.reviewList.length / this.onePageCnt)
                this.setPage(1)

            } catch (error) {
                console.error(error);
            }
        },
        sortList(sortNum) {
            if (sortNum == 0) {
                this.sortCase = "오래된 순"
            } else {
                this.sortCase = "최근 순"
            }
            this.getReviewList(sortNum)
                .then(() => {
                    this.$router.push({ path: '/nreview' });
                })
        },
        formatDateTime(dateTime) {
            const date = new Date(dateTime);
            const formattedDateTime = date.toLocaleString('ko-KR');
            return formattedDateTime;
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
</style>