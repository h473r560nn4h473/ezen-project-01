<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
  <main>
    <div class="container">
      <table class="table caption-top">
        <caption>
          <div class="top_wrap">
            <h1>회원 관리</h1>
            <div class="search_wrap">
              <div class="search_bar">
                <input v-model="keyword" class="form-control me-2" type="text" placeholder="아이디 검색" @keyup.enter="getUserList(sortCase)">
                <button class="btn btn-secondary" type="submit" @click="getUserList(sortCase)"><i class="fa-solid fa-search"></i></button>
              </div>
              <div class="dropdown_wrap">
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">{{ sortCase }}</button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                    <li><a class="dropdown-item" href="#" @click="sortList(0)">최근 가입 순</a></li>
                    <li><a class="dropdown-item" href="#" @click="sortList(1)">오래된 가입 순</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </caption>
        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">번호</th>
            <th scope="col">아이디</th>
            <th scope="col">이름</th>
            <th scope="col">연락처</th>
            <th scope="col">가입타입</th>
            <th scope="col">상세정보</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user, i) in pageUserList" :key="i">
            <th scope="row">{{ pageNum * onePageCnt + i + 1 }}</th>
            <td>{{ user.user_no }}</td>
            <td>{{ formatLongID(user.user_id) }}</td>
            <td>{{ user.user_nm }}</td>
            <td>{{ user.user_ph }}</td>
            <td>{{ getSocialType(user.user_social_tp) }}</td>
            <td >
              <template v-if="user.user_id == docId1 || user.user_id == docId2">
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal2" >의사 정보</button>
                <!-- 모달 -->
                <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">의사 정보 확인</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="modal-body">
                          <div v-if="user.user_id == docId1" class="card">
                            <div class="card_wrap">
                              <div class="img_col">
                                <div class="img_frame">
                                  <img :src="require(`../assets/doc1.png`)" alt="...">
                                </div>
                              </div>
                              <div class="body_col">
                                <div class="card-body">
                                  <p class="card-text"><span class="bar"></span>의사 이름: {{ docInfo[0].DOC_NM }}</p>
                                  <p class="card-text"><span class="bar"></span>의사 나이: {{ docInfo[0].DOC_AGE }}</p>
                                  <p class="card-text"><span class="bar"></span>의사 전화번호: {{ docInfo[0].DOC_PH }}</p>
                                  <p class="card-text"><span class="bar"></span>의사 이메일: {{ docInfo[0].DOC_EML }}</p>
                                  <p class="card-text"><span class="bar"></span>의사 경력: {{ formatDateTime(docInfo[0].HIS_START_YEAR) }} ~ </p>
                                </div>
                              </div>
                            </div>
                          </div>  
                          <div v-else class="card">
                            <div class="card_wrap">
                              <div class="img_col">
                                <div class="img_frame">
                                  <img :src="require(`../assets/doc2.png`)" alt="...">
                                </div>
                              </div>
                              <div class="body_col">
                                <div class="card-body">
                                  <p class="card-text"><span class="bar"></span>의사 이름: {{ docInfo[1].DOC_NM }}</p>
                                  <p class="card-text"><span class="bar"></span>의사 나이: {{ docInfo[1].DOC_AGE }}</p>
                                  <p class="card-text"><span class="bar"></span>의사 전화번호: {{ docInfo[1].DOC_PH }}</p>
                                  <p class="card-text"><span class="bar"></span>의사 이메일: {{ docInfo[1].DOC_EML }}</p>
                                  <p class="card-text"><span class="bar"></span>의사 경력: {{ formatDateTime(docInfo[1].HIS_START_YEAR) }} ~ </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <!-- 모달끝! -->
              </template> 
              <template v-else>
                <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal"
                  data-bs-target="#exampleModal" @click="viewPetInfo(user)">
                  동물 정보
                </button>
                <!-- 모달 -->
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
                  aria-hidden="true">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">동물 정보 확인</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <div class="modal-body">
                          <div class="card">
                            <div class="card_wrap">
                              <div v-if="pet.pet_img" class="img_col">
                                <div class="img_frame">
                                  <img :src="require(`../../../back/uploads/uploadPet/${pet.pet_img}`)" alt="...">
                                </div>
                              </div>
                              <div v-else class="img_col">
                                <div class="img_frame">
                                  <img :src="require(`../assets/imgempty.svg`)" alt="null">
                                </div>
                              </div>
                              <div class="body_col">
                                <div class="card-body">
                                  <p class="card-text"><span class="bar"></span>동물등록번호: {{ pet.pet_no }}</p>
                                  <p class="card-text"><span class="bar"></span>동물 이름: {{ pet.pet_nm }}</p>
                                  <p class="card-text"><span class="bar"></span>동물 종류: {{ pet.pet_type }}</p>
                                  <p class="card-text"><span class="bar"></span>동물 연령: {{ pet.pet_age }}</p>
                                  <p class="card-text"><span class="bar"></span>동물 성별: {{ getPetSex(pet.pet_sex) }}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
                <!-- 모달끝! -->
              </template>
            </td>
            <td><button type="button" class="btn btn-outline-danger" @click="confirmDeleteUser(user)">삭제</button></td>
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
      userList: [],
      pet: [],
      docInfo: [],
      sortCase: "최근 가입 순",
      keyword: '',
      pageUserList: [],
      pageNum: 0,
      pageCnt: 0,
      onePageCnt: 10,
      docId1: '',
      docId2: ''
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    if (this.user.user_no == '') {
      // 일단은 로그인 상태 체크 
      this.$swal({
        icon: 'warning',
        title: '관리자 외 접근제한 페이지입니다.'
      })
      this.$router.push({ path: '/login' });
    }
    else {
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
          this.$swal({
            icon: 'warning',
            title: '관리자 외 접근제한 페이지입니다.'
          })
          this.$router.push({ path: '/' });
        }
      }).catch(() => {
        this.$swal({
          icon: 'error',
          title: '접속 오류'
        })
      })
    }
    this.getDocDate()
  },
  created() {
    this.getUserList()
  },
  methods: {
    setPage(page) {
      this.pageUserList = [];
      this.pageNum = page - 1;
      this.sliceList()
    },
    sliceList() {
      const start = 0 + this.pageNum * this.onePageCnt;
      this.pageUserList = this.userList.slice(start, start + this.onePageCnt);
      //console.log(this.pageUserList);
    },
    async getUserList(sortCaseNum) {
      let keyword = 'none';
      if (this.keyword != '') {
        keyword = this.keyword
      }
      try {
        const response = await axios.get(`http://localhost:3000/auth/admin/userlist/${sortCaseNum}/${keyword}`);
        this.userList = response.data;
        this.pageCnt = Math.ceil(this.userList.length / this.onePageCnt);
        this.setPage(1)
      } catch (error) {
        console.error(error);
      }
    },
    sortList(sortNum) {
      if (sortNum == 0) {
        this.sortCase = "최근 가입 순"
      } else if (sortNum == 1) {
        this.sortCase = "오래된 가입 순"
      }
      this.getUserList(sortNum)
        .then(() => {
          this.$router.push({ path: '/admin/userlist' });
        })
    },
    getSocialType(socialType) {
      if (socialType === 0) {
        return 'Local';
      } else if (socialType === 1) {
        return 'Kakao';
      } else if (socialType === 2) {
        return 'Naver';
      } else {
        return 'null';
      }
    },
    formatDateTime(dateTime) {
      const date = new Date(dateTime);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const formattedDateTime = date.toLocaleDateString("ko-KR", options);
      return formattedDateTime;
    },
    confirmDeleteUser(user) {
      this.$swal({
        title: `${user.user_nm} (${user.user_id}) 회원을 삭제하시겠습니까?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then(result => {
        if (result.value) {
          this.deleteUser(user);
          this.$swal({
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
    getPetSex(pet) {
      if (pet === 1) {
        return '수컷';
      } else {
        return '암컷';
      }
    },
    async deleteUser(user) {
      console.log('삭제 버튼 클릭 - 사용자 정보:', user);
      try {
        const response = await axios.delete(`http://localhost:3000/auth/admin/userlist/${user.user_no}`);
        console.log('사용자 삭제 성공:', response.data);
        this.userList = this.userList.filter(u => u.user_no !== user.user_no);
      } catch (error) {
        console.error('사용자 삭제 실패:', error);
      }
    },
    async viewPetInfo(user) {
      try {
        const response = await axios.get(`http://localhost:3000/auth/admin/getPetData/${user.user_no}`);
        //console.log('동물 데이터:', response.data);
        this.pet = response.data[0];
      } catch (error) {
        console.error('데이터 가져오기실패:', error);
      }
    },
    formatLongID(id){
      if (id.length > 10){
        let shortId = id.substr(0, 10);
        shortId += '...';
        return shortId;
      }
      return id;
    },
    async getDocDate() {
      try {
        const response = await axios.get("http://localhost:3000/auth/getDocData2");
        this.docInfo = response.data;
        console.log(this.docInfo);
        this.docId1 = response.data[0].DOC_ID;
        this.docId2 = response.data[1].DOC_ID;
        console.log(this.docId1);
        console.log(this.docId2);
      } catch(error) {
        console.error(error);
      }
    }
  }
}
</script>
<style src="../assets/css/admin.css" scoped></style>
<style scoped>
@import "../assets/css/global.css";

.modal-dialog {
  max-width: none;
  width: 100%;
  height: 100vh;
  margin: 0;
  position: relative;
  overflow: hidden;
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: block;
  width: fit-content;
}

.modal-header {
  padding: 1rem 1.5rem;
}

.modal-title {
  color: var(--color-orange);
}

.card_wrap {
  display: flex;
}

.img_col {
  width: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img_frame {
  width: 150px;
  height: 150px;
}

.card-body {
  text-align: left;
  margin: 20px 0;
  padding: 0 40px;
  border-left: 1px solid var(--color-lightgray);
}
</style>