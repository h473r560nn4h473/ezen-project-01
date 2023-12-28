<template>
    <main class="mt-3">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
        <div class="container">
            <table class="table caption-top qnalist-table">
                <caption>
                    <div class="list-title">
                        <h2>문의사항 관리</h2>
                        <div class="search_bar">
                            <input v-model="keyword" class="form-control me-2" type="text" placeholder="회원명 검색"
                                @keyup.enter="getQnaList(sortQCase)">
                            <button class="btn btn-secondary" type="submit" @click="getQnaList(sortQCase)"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="list-title2">
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ sortQCase }}
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
                        <th scope="col">회원번호</th>
                        <th scope="col">회원명</th>
                        <th scope="col">글 제목</th>
                        <th scope="col">작성일</th>
                        <th scope="col">담당의</th>
                        <th scope="col">답변 상태</th>
                        <th scope="col"> </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(qna, i) in pageQnaList" :key="i">
                        <th scope="row" style="display: none;">{{ pageNum * onePageCnt + i + 1 }}</th>
                        <td @click="movetodqna(qna.QNA_NO)">{{ qna.USER_NO }}</td>
                        <td @click="movetodqna(qna.QNA_NO)">{{ qna.USER_NM }}</td>
                        <td @click="movetodqna(qna.QNA_NO)">{{ qna.QNA_TITLE }}</td>
                        <td @click="movetodqna(qna.QNA_NO)">{{ formatDateTime(qna.QNA_DATE) }}</td>
                        <td @click="movetodqna(qna.QNA_NO)">{{ qna.DOC_NM }}</td>
                        <td @click="movetodqna(qna.QNA_NO)">{{ getQnaState(qna) }}</td>
                        <td><button class="btn btn-outline-danger" @click="confirmDeleteQna(qna)">삭제</button></td>
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
            qnaList: [],
            sortQCase: "최근 순",
            keyword: '',
            pageQnaList: [],  // 한 페이지에 보여줄 굿즈 리스트를 잘라 담을 새 리스트
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
        this.getQnaList();
    },
    methods: {
        setPage(page) {
            this.pageQnaList = []
            this.pageNum = page - 1;
            this.sliceList()
        },
        sliceList() {
            const start = 0 + this.pageNum * this.onePageCnt
            this.pageQnaList = this.qnaList.slice(start, start + this.onePageCnt);
        },
        async getQnaList(sortQCaseNum) {
            let keyword = 'none'

            if (this.keyword != '') {
                keyword = this.keyword;
            }
            try {
                const response = await axios.get(`http://localhost:3000/mypage/mypage/docqna/${this.user.user_id}/${sortQCaseNum}/${keyword}`);
                this.qnaList = response.data;
                this.pageCnt = Math.ceil(this.qnaList.length / this.onePageCnt)
                this.setPage(1)

            } catch (error) {
                console.error(error);
            }
        },
        sortList(sortNum) {
            if (sortNum == 0) {
                this.sortCase = "최근 순"
            } else if (sortNum == 1) {
                this.sortCase = "오래된 순"
            }
            this.getQnaList(sortNum)
                .then(() => {
                    this.$router.push({ path: '/mypage/docqna' });
                })
        },
        formatDateTime(dateTime) {
            const date = new Date(dateTime);
            const formattedDateTime = date.toLocaleString('ko-KR');
            return formattedDateTime;
        },
        getQnaState(qna) {
            if (qna.QNA_ANSWER !== null && qna.QNA_STATE === 1) {
                return '답변완료';
            } else {
                return '답변대기';
            }
        },
        confirmDeleteQna(qna) {
            this.$swal({
                title: `문의내역을 삭제하시겠습니까?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '삭제',
                cancelButtonText: '취소',
                reverseButtons: true
            }).then(result => {
                if (result.value) {
                    this.deleteQna(qna);
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
        async deleteQna(qna) {
            console.log('삭제 버튼 클릭 - 문의내역:', qna);
            try {
                const response = await axios.delete(`http://localhost:3000/mypage/mypage/docqna/${this.user.user_id}/${qna.qna_no}`);
                console.log('진료기록 삭제 성공:', response.data);
                this.qnaList = this.qnaList.filter(q => q.qna_no !== qna.qna_no);
            } catch (error) {
                console.error('진료기록 삭제 실패:', error);
            }
        },
        movetodqna(QNA_NO) {
            window.location.href = window.location.pathname + '/detail?qna_no=' + QNA_NO;
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