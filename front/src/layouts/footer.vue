<template>
    <footer class="footer_form">
        <div class="f_add">
            <p>&copy; 2023</p>
            <p>회사소개 | 개인정보처리방침 | 이용약관 | 사업자정보<br>
            대표자 | PETERAN | 사업자등록번호 666-66-66666<br>주소 서울 종로구 종로 78 미려빌딩 이젠 아카데미 컴퓨터 학원<br>
            팩스 | 66-666-6666 | 이메일 empty@naver.com</p>
        </div>
    </footer>
</template>

<script>
export default ({

})
</script>

<style>
  body{
    margin: 0;
    padding: 0;
  }
  
.footer_form{
    margin: 0;
    padding: 0;
    left: 0;   
    bottom: 0;
    list-style: none;
    text-decoration: none;
    /* border: solid 1px red; */
}
    .f_add{
        position: relative;
        height: auto;
        width: 100%;
        left: 0;       
        bottom: 0; 
        padding: 10px;
        background: #f2f2f2;
    }

    p{
        margin-left: 20px;
        line-height: 24px;
        font-size: 12px;
        color: rgb(173, 173, 173);
    }
</style>