<template>
    <div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div class="icon-bar admin-bar">
            <i></i>
            <router-link to="/">
                <i class="fa fa-home"></i>
                <p>홈페이지</p>
            </router-link> 
            <router-link to="/admin/userlist">
                <i class="fa fa-user-circle"></i>
                <p>회원 관리</p>
            </router-link>
            <router-link to="/admin/reviewlist">
                <i class="fa fa-user-circle"></i>
                <p>진료 기록 관리</p>
            </router-link>    
            <router-link to="/admin/qnalist">
                <i class="fa fa-question"></i>
                <p>QnA 답변</p>
            </router-link>
            <router-link to="/admin/reservationlist">
                <i class="fa fa-user-circle"></i>
                <p>예약 관리</p>
            </router-link>
            <br />
            <button type="button" class="big_red_btn" @click="logout">로그아웃</button>
        </div>
    </div>
</template>
<script>

export default {
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        logout() {
            this.$store.commit("user", {});
            this.$swal({
                position: 'top',
                icon: 'success',
                title: '로그아웃되셨습니다.',
                showConfirmButton: false,
                timer: 1000
            })
            .then(() => {
                window.location.href = "http://localhost:8080";
            })
        }
    }
}
</script>
<style>

.big_red_btn {
	font-size: 14px;
	width: 80px;
	height: 50px;
	background-color: red;
	border: none;
	border-radius: 4px;
	margin: 0 auto;
    display:block;
}

.admin-bar p {
    margin: auto;
    font-size: 14px;
}

.admin-bar {
    height: 100%;
    width: 100px;
    background-color: #555;
    position: fixed; 
    /*z-index: 1;*/ /* Stay on top */
    top: 0; /* Stay at the top */
    left: 0;
    overflow-x: hidden; /* Disable horizontal scroll */
  }

  .admin-bar a {
    display: block;
    text-align: center;
    padding-top: 18px;
    padding-bottom: 18px;
    transition: all 0.3s ease;
    color: white;
    text-decoration: none;
    font-size: 18px;
  }


  .admin-bar a:hover {
    background-color: #858585;
  }

  .active {
    background-color: #5eaf13;
  }

</style>