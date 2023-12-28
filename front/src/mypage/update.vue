<template>
    <main>

        <div class="container">
            <h2>내 정보 수정</h2>

            <div class="form">
                <label class="te">비밀번호</label>
                <div class="in">
                    <input type="password" class="form-control" v-model="loginUser.doc_pw" />
                </div>
            </div>
            <div class="form">
                <label class="te">이름</label>
                <div class="in">
                    <input type="text" class="form-control" v-model="loginUser.doc_nm" />
                </div>
            </div>
            <div class="form">
                <label class="te">나이</label>
                <div class="in">
                    <input type="number" class="form-control" v-model="loginUser.doc_age" />
                </div>
            </div>
            <div class="form">
                <label class="te">전화번호</label>
                <div class="in">
                    <input type="tel" class="form-control" @input="validatePhoneNumber" v-model="loginUser.doc_ph" />
                </div>
            </div>
            <div class="form">
                <label class="te">이메일</label>
                <div class="in">
                    <input type="email" class="form-control" v-model="loginUser.doc_eml" />
                </div>
            </div>
            <div class="form">
                <label class="te">약력</label>
                <div class="in">
                    <input type="text" class="form-control" v-model="loginUser.doc_bio" />
                </div>
            </div>
            <div class="form">
                <label class="te">전공</label>
                <div class="in">
                    <input type="text" class="form-control" v-model="loginUser.doc_mj" />
                </div>
            </div>
            <div>
                <label class="te">성별</label><br/>
                <select v-model="gender">
                    <option value=""></option>
                    <option value="M">남자</option>
                    <option value="F">여자</option>
                </select>
            </div>

            <div class="form">
                <button type="submit" class="btn" @click="onSubmitForm">수정하기</button>
            </div>
        </div>
    </main>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            loginUser: {},
            gender: ""
        };
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    mounted() {
        if (this.user.user_no === '') {
            this.$swal('로그인해주세요');
            this.$router.push({ path: '/login' });
        } else {
            axios
                .get('http://localhost:3000/mypage/getUserData', {
                    params: {
                        user_id: this.user.user_id,
                    },
                })
                .then((res) => {
                    if (res.data.length > 0) {
                        this.loginUser = res.data[0];
                        console.log
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, methods: {
        onSubmitForm() {
            if (this.loginUser.doc_pw === "" || this.loginUser.doc_nm === "" || this.loginUser.doc_age === "" || this.loginUser.doc_ph === "" || this.loginUser.doc_eml === "" || this.gender === "") {
                this.$swal("모든 항목을 입력해주세요");
            } else {
                axios
                    .post('http://localhost:3000/mypage/mypage/update', {
                        doc_pw: this.loginUser.doc_pw,
                        doc_nm: this.loginUser.doc_nm,
                        doc_age: this.loginUser.doc_age,
                        doc_ph: this.loginUser.doc_ph,
                        doc_eml: this.loginUser.doc_eml,
                        doc_bio: this.loginUser.doc_bio,
                        doc_mj: this.loginUser.doc_mj,
                        gender: this.gender,
                        user_id: this.user.user_id
                    })
                    .then((res) => {
                        if (res.data.message === 'docmypage_update') {
                            this.$swal("수정이 완료되었습니다");
                            this.$router.push({ path: '/mypage' });
                        } else {
                            this.$swal("수정에 실패했습니다.");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.$swal("수정에 실패했습니다!");
                    });
            }
        },
        validatePhoneNumber() {
            this.loginUser.doc_ph = this.loginUser.doc_ph.replace(/\D/g, ''); // 숫자 이외의 문자 제거
        },
    }
}
</script>
