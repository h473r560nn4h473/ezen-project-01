import { createApp } from 'vue'
import App from './App.vue'
import mixins from './mixmin'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


//레이아웃
import defaultLayout from './layouts/defaultLayout.vue'
import adminLayout from './layouts/adminLayout.vue'
import mypageLayout from './layouts/mypageLayout.vue'
import pageLayout from './layouts/pageLayout.vue'
import docpageLayout from './layouts/docpageLayout.vue'
import subjectLayout from './layouts/subjectLayout.vue'

import findPage from './views/find.vue'
import JoinPage1 from './views/join1.vue'
import JoinPage2 from './views/join2.vue'
import JoinPage3 from './views/join3.vue'
import LoginPage from './views/login.vue'
import PetUpload from './views/petupload.vue'
import ResPage from './views/calendar.vue'
import ReviewPage from './views/review.vue'
import ReviewDetailPage from './views/reviewdetail.vue'
import mainPage from './views/main.vue'
import DocSelPage from './views/docSelect.vue'
import qnaMainPage from './views/qnamain.vue'
import qnaWritePage from './views/qnawrite.vue'
import qnaDetailPage from './views/qnaDetail.vue'
import dochistory from './views/docHistory.vue'
import goodsList from './views/goodslist.vue'
import introPage1 from './views/intro1.vue'
import introPage2 from './views/intro2.vue'
import introPage3 from './views/intro3.vue'
import introPage4 from './views/intro4.vue'
import greetings from './views/greetings.vue'
import vetHistory from './views/vetHistory.vue'

// 관리자 페이지
import UserInfo from './admin/userInfo.vue'
import ReviewList from './admin/review.vue'
import Qna from './admin/qna.vue'
import ReservationList from './admin/reservation.vue'
import GoodsMain from './admin/goods.vue'
import GoodsWrite from './admin/goodswrite.vue'
import GoodsModify from './admin/goodsmodify.vue'



//마이페이지
import MypagePage from './mypage/mypage.vue'
import MypageUpdate from './mypage/mypageupdate.vue'
import PetUpdate from './mypage/petupdate.vue'
import MyReview from './mypage/myReview.vue'
import MyReviewContent from './mypage/myReviewContent.vue'
import MyReservation from './mypage/myReservation.vue'
import MyQna from './mypage/myQna.vue'
import MyQnaDetail from './mypage/myQnaDetail.vue'
import PassPage from './mypage/pass.vue'

//의료진 페이지
import DocPage from './docpage/docpage.vue'
import DocpageUpdate from './docpage/docupdate.vue'
import DocQna from './docpage/docqna.vue'
import DocReview from './docpage/docreview.vue'
import DocReservation from './docpage/docreservation.vue'
import DocReservationDetail from './docpage/myReservationContent.vue'
import DocReviewDetail from './docpage/docreviewdetail.vue'
import DocQnaDetail from './docpage/docqnadetail.vue'
import DocReviewWrite from './docpage/reviewWrite.vue'

const routes = [
   {
        path: '/page',
        name: 'pageLayout',
        component: pageLayout,
        children: [
            {
                path: '/docHistory',
                component: dochistory,
            },
            {
                path: '/find',
                component: findPage,
            },
            {
                path: '/join1',
                component: JoinPage1,
            },
            {
                path: '/join2',
                component: JoinPage2,
            },
            {
                path: '/join3',
                component: JoinPage3,
            },
            {
                path: '/login',
                component: LoginPage,
            },
            {
                path: '/petupload',
                component: PetUpload,
            },
            {
                path: '/res',
                component: ResPage,
            },
            {
                path: '/docSelect',
                component: DocSelPage,
            },
            {
                path: '/qnaMain',
                component: qnaMainPage,
            },
            {
                path: '/qnaWrite',
                component: qnaWritePage,
            },
            {
                path: '/qnaMain/qnaDetail',
                component: qnaDetailPage,
            },
            {
                path: '/review',
                component: ReviewPage,
            },
            {
                path: '/review/reviewDetail',
                component: ReviewDetailPage,
            },
            {
                path: '/goodsList',
                component: goodsList,
            },
            {
                path: '/greetings',
                component: greetings,
            },
            {
                path: '/vetHistory',
                component: vetHistory,
            }
        ]
    },    
    {
        path: '/',
        name: 'defaultLayout',
        component: defaultLayout,
        children: [
            {
                path: '',
                component: mainPage,
            },
        ]
    }, 
    {
        path: '/subject/',
        name: 'subjectLayout',
        component: subjectLayout,
        children: [
            {
                path: 'intro1',
                component: introPage1,
            },
            {
                path: 'intro2',
                component: introPage2,
            },
            {
                path: 'intro3',
                component: introPage3,
            },
            {
                path: 'intro4',
                component: introPage4,
            },
        ]
    }, 
    {
        path: '/mypage/',
        name: 'mypageLayout',
        component: mypageLayout,
        children: [   
            {
                path: '',
                component: MypagePage,
            },
            {
                path: 'mypageupdate',
                component: MypageUpdate,
            },
            {
                path: 'petupdate',
                component: PetUpdate,
            },
            {
                path: 'myreservation',
                component: MyReservation,
            },
            {
                path: 'myreview',
                component: MyReview,
            },
            {
                path: 'myreview/reviewcontent',
                component: MyReviewContent,
            },
            {
                path: 'myqna',
                component: MyQna,
            },
            {
                path: 'myqna/myqnadetail',
                component: MyQnaDetail,
            },
            {
                path: 'pass',
                component: PassPage,
            },
        ]
    },
    {
        path: '/docpage/',
        name: 'docpageLayout',
        component: docpageLayout,
        children: [   
            {
                path: '',
                component: DocPage,
            },
            {
                path: 'docupdate',
                component: DocpageUpdate,
            },
            {
                path: 'docreservation',
                component: DocReservation,
            },
            {
                path: 'docreservation/resdetail',
                component: DocReservationDetail,
            },
            {
                path: 'docreview',
                component: DocReview,
            },
            {
                path: 'docreview/write',
                component: DocReviewWrite,
            },
            {
                path: 'docreview/reviewdetail',
                component: DocReviewDetail,
            },
            {
                path: 'docqna',
                component: DocQna,
            },
            {
                path: 'docqna/qnadetail',
                component: DocQnaDetail,
            },
        ]
    },
    {
        path: '/admin/',
        name: 'adminLayout',
        component: adminLayout,
        children: [
            {
                path: 'userlist',
                component: UserInfo,
            },
            {
                path: 'reviewlist',
                component: ReviewList,
            },
            {
                path: 'qnalist',
                component: Qna,
            },
            {
                path: 'reservationlist',
                component: ReservationList,
            },
            {
                path: 'goodslist',
                component: GoodsMain,
            },
            {
                path: 'goodswrite',
                component: GoodsWrite,
            },
            {
                path: 'goodslist/goodsmodify/',
                component: GoodsModify,
            },
        ]
    },    

];

// 카카오 발급키
window.Kakao.init('eca40114c12912aeb1322962de390162');


const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
});

const app = createApp(App)
app.use(router);
app.mixin(mixins);
app.use(store);
app.use(VueSweetalert2);
app.mount('#app');