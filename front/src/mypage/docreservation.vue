<template>
    <main class="mt-3">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
        <div class="container">
            <table class="table caption-top qnalist-table">
                <caption>
                    <div class="list-title">
                        <h2>예약 목록</h2>
                        <div class="search_bar">
                            <input v-model="keyword" class="form-control me-2" type="text" placeholder="회원명 검색"
                                @keyup.enter="getdocReservationList(sortCase)">
                            <button class="btn btn-secondary" type="submit" @click="getdocReservationList(sortCase)"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="list-title2">
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ sortCase }}
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li><a class="dropdown-item" href="#" @click="sortList(0)">최근 예약번호 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(1)">오래된 예약번호 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(2)">최근 예약시간 순</a></li>
                                    <li><a class="dropdown-item" href="#" @click="sortList(3)">오래된 예약시간 순</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </caption>
                <thead class="table-light">
                    <tr>
                        <th scope="col" style="display: none;">번호</th>
                        <th scope="col">예약번호</th>
                        <th scope="col">예약자명</th>
                        <th scope="col">제목</th>
                        <th scope="col">내용</th>
                        <th scope="col">예약시간</th>
                        <th scope="col">담당의</th>
                        <th scope="col"> </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(docreservation, i) in pagedocReservationList" :key="i">
                        <th scope="row" style="display: none;">{{ pageNum * onePageCnt + i + 1 }}</th>
                        <td>{{ docreservation.RES_NO }}</td>
                        <td>{{ docreservation.USER_NM }}</td>
                        <td>{{ docreservation.RES_TITLE }}</td>
                        <td>{{ docreservation.RES_CONTENT }}</td>
                        <td>{{ formatDate(docreservation.RES_DATE) }} {{ docreservation.RES_TIME }}</td>
                        <td>{{ docreservation.DOC_NM }}</td>
                        <td><button class="btn btn-outline-danger" @click="confirmDeletedocReservation(docreservation)">취소</button></td>
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
            docreservationList: [],
            sortCase: "최근 예약번호 순",
            keyword: '',
            pagedocReservationList: [],
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
        this.getdocReservationList();
    },
    methods: {
        setPage(page) {
            this.pagedocReservationList = []
            this.pageNum = page - 1;
            this.sliceList()
        },
        sliceList() {
            const start = 0 + this.pageNum * this.onePageCnt
            this.pagedocReservationList = this.docreservationList.slice(start, start + this.onePageCnt);
        },
        async getdocReservationList(sortCaseNum) {
            let keyword = 'none';
            if (this.keyword != '') {
                keyword = this.keyword;
            }
            try {
                const response = await axios.get(`http://localhost:3000/mypage/mypage/docreservation/${this.user.user_id}/${sortCaseNum}/${keyword}`);
                this.docreservationList = response.data;
                this.pageCnt = Math.ceil(this.docreservationList.length / this.onePageCnt);
                console.log(this.docreservationList);
                this.setPage(1);
            } catch (error) {
                console.error(error);
            }
        },
        sortList(sortNum) {
            if (sortNum == 0) {
                this.sortCase = "최근 예약번호 순"
            } else if (sortNum == 1) {
                this.sortCase = "오래된 예약번호 순"
            } else if (sortNum == 2) {
                this.sortCase = "최근 예약시간 순"
            } else if (sortNum == 3) {
                this.sortCase = "오래된 예약시간 순"
            }
            this.getdocReservationList(sortNum)
                .then(() => {
                    this.$router.push({ path: '/mypage/docreservation/' });
                })
        },
        formatDate(dateTime) {
            const date = new Date(dateTime);
            const formattedDate = date.toLocaleDateString('ko-KR'); // 날짜만 표시
            return formattedDate;
        },
        confirmDeletedocReservation(docreservation) {
            this.$swal({
                title: `예약내역을 삭제하시겠습니까?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    this.deletedocReservation(docreservation);
                    this.$swal({
                        position: 'top',
                        icon: 'success',
                        title: '삭제되었습니다',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    .then(() => {
                        this.$router.go(this.$router.currentRoute);
                        }
                    )
                }
            });
        },
        async deletedocReservation(docreservation) {
            console.log('삭제 버튼 클릭 - 예약내역:', docreservation);
            try {
                const response = await axios.delete(`http://localhost:3000/mypage/mypage/docreservation/${this.user.user_id}/${docreservation.RES_NO}`);
                console.log('예약내역 삭제 성공:', response.data);
                this.docreservationList = this.docreservationList.filter(re => re.RES_NO !== docreservation.RES_NO);
            } catch (error) {
                console.error('예약내역 삭제 실패:', error);
            }
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