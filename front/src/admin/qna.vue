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
                            <!-- 검색 조건 dropdown 메뉴 -->
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton2"
                                data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ setSearch }}
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                    <li><a class="dropdown-item" href="#" @click="setSearchList(0)">예약자명</a></li>
                                    <li><a class="dropdown-item" href="#" @click="setSearchList(1)">담당의</a></li>
                                </ul>
                            </div>
                            <!-- 검색창, enter 입력 시 즉시 검색됨 -->
                            <input v-model="keyword" class="form-control me-2" type="text" placeholder="검색" @keyup.enter="getQnaList(sortCaseNum, this.setSearchNum)">
                            <!-- 검색버튼 -->
                            <button class="btn btn-secondary" type="submit" @click="getQnaList(sortCaseNum, this.setSearchNum)"><i class="fa fa-search"></i></button>
                        </div>
                        <div class="list-title2">
                            <!-- 게시글 정렬 dropdown 메뉴 -->
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown" aria-expanded="false" style="border: none;"> {{ sortCase }}
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
                    <!-- 표 제목 -->
                    <tr>
                        <!-- 페이지를 구현하기 위한 항목, 보일 필요는 없으므로 display: none 옵션으로 숨김처리함 -->
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
                    <!-- pageQnaList 배열에서 qna 요소를 반복함(여기서 qna는 임의로 지정한 이름), i는 반복 순서를 숫자로 표기해줌 -->
                    <tr v-for="(qna, i) in pageQnaList" :key="i">
                        <!-- table header, 테이블의 열을 만듬, scope는 헤더 셀이 관련되는 셀의 종류를 의미함, column는 열, row는 행 -->
                        <th scope="row" style="display: none;">{{ pageNum * onePageCnt + i + 1 }}</th>
                        <td>{{ qna.USER_NO }}</td>
                        <td>{{ qna.USER_NM }}</td>
                        <td>{{ qna.QNA_TITLE }}</td>
                        <!-- DateTime으로 날짜와 시간을 전부 표시함 -->
                        <td>{{ formatDateTime(qna.QNA_DATE) }}</td>
                        <td>{{ qna.DOC_NM }}</td>
                        <td>{{ getQnaState(qna) }}</td>
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
            qnaList: [],    //back에서 페이지에 표시할 정보를 받아옴
            sortCase: "최근 순",    //페이지에 접속/재접속 후 아무것도 하지 않았을 때 정렬 dropdown에 출력할 문구
            keyword: '',    //검색창을 비움
            pageQnaList: [],  // 한 페이지에 보여줄 qna 리스트를 잘라 담을 새 리스트
            pageNum: 0, //현재 페이지
            pageCnt: 0, //페이지의 전체 갯수
            onePageCnt: 10, //한 페이지에 표시할 글 갯수
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
    },
    mounted() {
        if (this.user.user_no == '') {  //로그인 상태 체크 
            this.$swal("관리자 외 접근제한 페이지입니다."); //팝업창 출력
            this.$router.push({ path: '/login' });  //로그인 안했을때 /login으로 이동
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
        this.getQnaList();
        this.setSearchList(0);  //페이지에 접속하고 아무것도 하지 않았을 때 검색 필터값이 undefined 상태인데, 이 때 검색을 누르면 에러가 발생하므로 초기값을 줘서 에러를 방지함
    },
    methods: {
        setPage(page) { //page 값을 받음
            this.pageQnaList = []   //pageQnaList 배열을 초기화함
            this.pageNum = page - 1;    //pageNum을 업데이트함
            this.sliceList()    //sliceList로 넘어감
        },
        sliceList() {
            const start = 0 + this.pageNum * this.onePageCnt
            this.pageQnaList = this.qnaList.slice(start, start + this.onePageCnt);
        },
        async getQnaList(sortCaseNum, setSearchNum) {   //qna 목록을 받아오고 검색 조건과 결과, 정렬 방식에 따라 페이지 내용을 바꿈
            let keyword = 'none'    //검색어 초기화

            if (this.keyword != '') {
                keyword = this.keyword; //검색어가 비어있지 않을때 keyword 변수를 입력한 값으로 변경
            }
            try {
                const response = await axios.get(`http://localhost:3000/qna/admin/qnalist/${setSearchNum}/${sortCaseNum}/${keyword}`);
                this.qnaList = response.data;   //db에서 데이터를 받아옴
                this.pageCnt = Math.ceil(this.qnaList.length / this.onePageCnt) //페이지 갯수 계산
                this.setPage(1)

            } catch (error) {
                console.error(error);
            }
        },
        setSearchList(setSearchNum) {
            if (setSearchNum == 0) {
                this.setSearch = "예약자명"
            } else if (setSearchNum == 1) {
                this.setSearch = "담당의"
            }
            this.setSearchNum = setSearchNum;   //검색조건 변수를 선택한 것으로 변경
        },
        sortList(sortNum) {
            if (sortNum == 0) {
                this.sortCase = "최근 순"
            } else if (sortNum == 1) {
                this.sortCase = "오래된 순"
            }
            this.sortNum = sortNum; //정렬조건 변수를 선택한 것으로 변경
            this.getQnaList(sortNum)
                .then(() => {
                    this.$router.push({ path: '/admin/qnaList' });  //선택한 정렬조건으로 페이지 재출력
                })
        },
        formatDateTime(dateTime) {  //db에 저장된 날짜와 시간을 형식에 맞춰 출력함
            const date = new Date(dateTime);
            const formattedDateTime = date.toLocaleString('ko-KR');
            return formattedDateTime;
        },
        getQnaState(qna) {  //qna 답변내용이 비어있지 않고 답변상태가 1일 경우 답변완료를 출력하고, 둘 다 아니거나 둘 중 하나라도 아닐 경우 답변대기 출력
            if (qna.QNA_ANSWER !== null && qna.QNA_STATE === 1) {
                return '답변완료';
            } else {
                return '답변대기';
            }
        },
        confirmDeleteQna(qna) { //삭제 확인창 출력
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
                        icon: 'success',
                        title: '삭제되었습니다',
                        showConfirmButton: false,
                        timer: 1500 //1.5초 이후 팝업창 사라지고 다음 과정으로 진행함
                    })
                    .then(() => {
                        this.$router.go(this.$router.currentRoute); //페이지를 새로고침해 글이 삭제된것을 바로 보여줌
                        }
                    )
                }
            });
        },
        async deleteQna(qna) {  //삭제기능
            console.log('삭제 버튼 클릭 - 문의내역:', qna);
            try {
                const response = await axios.delete(`http://localhost:3000/qna/admin/qnalist/${qna.QNA_NO}`);   //삭제하려는 글 번호를 전달하고 삭제과정 진행
                console.log('진료기록 삭제 성공:', response.data);
                this.qnaList = this.qnaList.filter(q => q.QNA_NO !== qna.QNA_NO);   //qna.QNA_NO를 가진 글을 삭제하고 목록에 표시되지 않게 핕터링함
            } catch (error) {
                console.error('진료기록 삭제 실패:', error);
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