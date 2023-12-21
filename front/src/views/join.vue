<template>
    <div class="join_onhead">
        <div style="float: left;">회원가입</div>
        <div style="float: right;">01.약관동의 02.정보입력 03.가입완료</div>
    </div>
    <br />
    <br />
    <div>* 표시된 항목들은 필수 항목입니다.</div>
    <br />
    <div class="join_box">
        <div class="background" @submit.prevent="onSubmitForm">
            <form id="sendForm">
                <div>이용자 정보</div>
                <input type="text" v-model="user_id" placeholder="아이디*"><br>
                <input type="password" v-model="user_pw" placeholder="비밀번호*"><br>
                <input type="password" v-model="user_pw_ck" placeholder="비밀번호 확인*"><br>
                <input type="text" v-model="user_nm" placeholder="이름*"><br>
                <input type="tel" @input="validatePhoneNumber" v-model="user_ph" placeholder="전화번호*"><br>
                <br>
                <div>환자 정보</div>
                <input type="text" v-model="pet_no" placeholder = "펫번호*"><br>
                <input type="text" size="40" maxlength="80" v-model="pet_nm" placeholder="펫이름*"><br>
                <input type="text" v-model="pet_age" placeholder="펫나이*"><br>
                <div id="sex">
                    <span>펫성별*</span>
                    <label><input type="radio" v-model="pet_sex" value="1">수컷</label>
                    <label><input type="radio" v-model="pet_sex" value="0">암컷</label>
                </div>
                <input type="text" v-model="pet_type" placeholder="펫종류*"><br>

                <br />
                <div>연락처는 회원님의 질문에 대한 답변과 입원한 환자에 대한 정보를 더 쉽게 제공하기 위한 용도로만 사용됩니다.</div>
                <button width="100px" class="btn" type="submit">가입</button>
                <button width="100px" class="btn"  onclick="history.back();">뒤로가기</button>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            user_id: '',
            user_pw: '',
            user_nm: '',
            user_ph: '',
            pet_no: '',
            pet_nm: '',
            pet_age: '',
            pet_sex: '',
            pet_type: '',

            user_pw_ck: '',
        }
    },
    methods: {
        onSubmitForm() {
            if (!this.validationCheck()) {
                return;
            }
            axios({
                url: "http://localhost:3000/auth/join_process",
                method: "POST",
                data: {
                    user_id: this.user_id,
                    user_pw: this.user_pw,
                    user_nm: this.user_nm,
                    user_ph: this.user_ph,
                    pet_no: this.pet_no,
                    pet_nm: this.pet_nm,
                    pet_age: this.pet_age,
                    pet_sex: this.pet_sex,
                    pet_type: this.pet_type,
                },
            })
                .then(res => {
                    if (res.data.message == 'already_exist_id') {
                        this.$swal("이미 존재하는 아이디입니다.")
                    }
                    else if (res.data.message == 'DB_error') {
                        this.$swal("DB 에러 발생")
                    }
                    else {
                        this.$swal({
                            position: 'top',
                            icon: 'success',
                            title: '회원가입이 완료되었습니다!',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        this.$router.push({ path: '/' }); // 로그인 화면으로 이동
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        validationCheck() {
            if (this.user_id == "") {
                this.$swal("아이디를 입력하세요.");
                return false;
            }

            if (this.user_pw == "") {
                this.$swal("비밀번호를 입력하세요.");
                return false;
            }

            if (this.user_pw_ck !== this.user_pw) {
                this.$swal("비밀번호가 일치하지 않습니다.");
                return false;
            }

            if (this.user_nm == "") {
                this.$swal("이름을 입력하세요.");
                return false;
            }

            if (this.user_ph == "") {
                this.$swal('전화번호를 정확히 입력해주세요.');
                return false;
            }

            if (this.pet_no == "") {
                this.$swal("동물등록번호를 입력하세요.");
                return false;
            }

            if (this.pet_nm == "") {
                this.$swal("동물 이름을 입력하세요.");
                return false;
            }

            if (this.pet_age == "") {
                this.$swal("동물 나이를 입력하세요.");
                return false;
            }

            if (this.pet_sex == "") {
                this.$swal("동물 성별을 입력하세요.");
                return false;
            }

            if (this.pet_type == "") {
                this.$swal("동물 타입을 입력하세요.");
                return false;
            }
            return true;
        },
        validatePhoneNumber() {
            this.user_ph = this.user_ph.replace(/\D/g, ''); // 숫자 이외의 문자 제거
        },
    },
}


</script>