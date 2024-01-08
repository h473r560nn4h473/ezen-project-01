<template>
    <main class="mt-5">
        <div class="login-form">
            <div class="logo">
                <img :src="require(`../assets/logo.png`)"/>
            </div>
            <div>
                <input type="id" @keyup.enter="login()" class="form-control" placeholder="아이디" v-model="user_id" />
                <label for="floatingInput"></label>
            </div>

            <div>
                <form><input type="password" @keyup.enter="login()" class="form-control" placeholder="비밀번호" v-model="user_pw" autoComplete="off"/></form>
                <label for="floatingPassword"></label>
            </div>

            <div>
                <button type="button" class="btn" @click="login()">로그인</button>
                <br>
                    <img :src="require(`../assets/btn_kakao.png`)" class="btn_kakao"/>
                    <div id="naverIdLogin" @click="naverlogin" img src="../assets/naver.png"></div>
            </div>
            <div class="find" @click="goToFind()">아이디 / 비밀번호 찾기</div>
            <div id="naverIdLogin"><button type="button" @click="logout">로그아웃</button></div>
        </div>
    </main>
</template>
    
<script>
import axios from 'axios';

export default {
    data() {
        return {
            user_id: '',
            naver_id: '',
            user_pw: '',
            naverLogin: [],
        };
    },
    computed: {
        user() {
            return this.$store.state.user; // user 정보가 바뀔 때마다 자동으로 user() 갱신
        },
    },
    mounted() {
        console.log(this.naverLogin.user);
        this.naverLogin = new window.naver.LoginWithNaverId({
            clientId: "Jrr3D4v8TvCF6ZHpaHY5",
            callbackUrl: "http://localhost:8080/login",
            isPopup: false,
            loginButton: {
                color: "green", type: 1, height: 45,
            },
        });
        //this.$store.commit("naverLogin", this.naverLogin);

        this.naverLogin.init();

        this.naverLogin.getLoginStatus((status) => {
            if (status) {
                console.log(status);
                console.log(this.naverLogin.user.name);

                const id = this.naverLogin.user.id;
                const nickname = this.naverLogin.user.nickname;

                this.naver_id = id;
                console.log(nickname)

            } else {
                console.log("callback처리 실패");
            }
        });

    },
    methods: {
        login() {
            axios({
                url: "http://localhost:3000/auth/login_process",
                method: "POST",
                data: {
                    user_id: this.user_id,
                    user_pw: this.user_pw
                },
            })
            .then(res => {
                if (res.data.message == 'undefined_id') {
                    this.$swal("존재하지 않는 아이디입니다.")
                }
                else if (res.data.message == 'incorrect_pw') {
                    this.$swal("비밀번호가 틀렸습니다.")
                }
                else {
                    this.$store.commit("user", { user_id: this.user_id, user_no: res.data.message })
                    this.$swal({
                        position: 'top',
                        icon: 'success',
                        title: '로그인 성공!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.$router.push({ path: '/' });  // 메인 화면으로 이동
                }
            })
            .catch(err => {
                console.log(err);
            })
        },
        goToFind() {
            this.$router.push({ path: 'find' });
        },
        naverlogin() {
            console.log("로그인함수 실행됨")
            axios({
                url: "http://localhost:3000/auth/naverlogin",
                method: "POST",
                data: {
                    naverlogin: this.naverLogin.user,

                },
            })
                .then(res => {

                    if (res.data.message == '저장완료') {

                        this.$swal({
                            icon: 'success',
                            title: '회원가입 성공!',
                            showConfirmButton: false,
                            timer: 1500
                        });



                    } else {
                        this.$store.commit("user", { user_id: this.naver_id, user_no: res.data.message })

                        this.$swal({
                            icon: 'success',
                            title: '로그인 성공!',
                            showConfirmButton: false,
                            timer: 1500,

                        }).then(() => {
                            window.location.href = "http://localhost:8080";
                        })


                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        logout() {
    const accessToken = this.naverLogin.accessToken.accessToken;
    const url = `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=Jrr3D4v8TvCF6ZHpaHY5&client_secret=V7qbNtySkJ&access_token=${accessToken}&service_provider=NAVER`;
    axios.get(url).then((res) => {
        console.log(res.data);
    });
}
    },
};
</script>

<style scoped>
@font-face {
    font-family: 'GmarketSansMedium';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}


* {
    padding: 0;
    margin: 0;

}

.logo img {
    width: auto;
    height: auto;
    max-width: 300px;
    display: block;
    margin: auto;
    position: relative;
    top: 20px;
}

.login-form {
    display: grid;
    width: 400px;
    height: 650px;
    margin: 6% auto;
    border: solid 2px rgb(237, 237, 237);
    background-color: #fcf9db;
    background: linear-gradient(180deg, rgb(253, 238, 204), rgb(253, 245, 221));
    box-shadow: 0px 1px 30px 2px rgb(238, 238, 238);
    border-radius: 30px;
}

.login-form .form-control {
    height: 48px;
    width: 240px;
    font-size: 16px;
    display: inline;
    margin-left: 20%;
    margin-bottom: 10px;
    border: solid 2px rgb(237, 237, 237);
    text-align: center;
    border-radius: 8px;
    position: relative;
    top: 20px;
    font-family: 'GmarketSansMedium';
}

input::placeholder {
    color: #aaa;
}

input:focus {
    outline: 2px solid #ffc905;
}

.login-form .btn {
    height: 48px;
    width: 242px;
    font-size: 16px;
    display: inline;
    margin-left: 20%;
    margin-bottom: 50px;
    border: solid 2px rgb(255, 204, 122);
    border-radius: 8px;
    background-color: rgb(255, 210, 107);
    position: relative;
    top: 50px;
    font-family: 'GmarketSansMedium';
}

.login-form .btn:hover {
    cursor: pointer;
}

/* sns btn */
/* .login-form .btn_kakao {
    scale: 50%;
    position: relative;
    left: 115px;
    top: 47px;


}

.login-form .btn_naver {
    scale: 24%;
    position: relative;
    left: 33px;
    top: 5px;

} */

.login-form .btn_kakao:hover {
    cursor: pointer;
}

.login-form .btn_naver:hover {
    cursor: pointer;
}

/* .login-form .img-fluid {
    width: 175px;
    height: 38px;
    cursor: pointer;
} */

.find {
    position: relative;
    bottom: 20px;
    height: 30px;
    text-align: center;
    padding-top: 20px;
    font-size: 0.8rem;
    color: #aaa;
    cursor: pointer;
    /* border: 1px solid red; */
}

.login-form .btn_kakao {
    margin-top: 5px;
    scale: 75%;
    position: relative;
    left: 75px;
    top: 5px;
}

/* .login-form .btn_naver {
    margin-top: 5px;
    scale: 75%;
    position: relative;
    left: 125px;
    top: 5px;
} */
</style>