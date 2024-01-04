import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
//import Vuetify from 'vuetify' 


// 레이아웃
import defaultLayout from './layouts/defaultLayout.vue'
import adminLayout from './layouts/adminLayout.vue'

// 유저 페이지
import HelloWorld from './views/HelloWorld.vue'
import JoinPage from './views/join2.vue'
import JoincondPage from './views/join1.vue'
import LoginPage from './views/login.vue'
import FindPage from './views/find.vue'
import nReviewPage from './views/review.vue'
import nReviewDetailPage from './views/reviewdetail.vue'

// 관리자 페이지
import UserInfo from './admin/userInfo.vue'
import ReviewList from './admin/review.vue'
import Qna from './admin/qna.vue'
import ReservationList from './admin/reservation.vue'
import aReviewDetailPage from './admin/reviewdetail.vue'

//의사 페이지
import DocmypagePage from './mypage/docmypage.vue'
import UpdatemypagePage from './mypage/update.vue'
import DocReview from './mypage/docreview.vue'
import DocReviewWrite from './mypage/docreviewwrite.vue'
import DocReviewDetail from './mypage/docreviewdetail.vue'
import DocReviewModify from './mypage/docreviewmodify.vue'
import DocQna from './mypage/docqna.vue'
import DocQnaWrite from './mypage/docqnawrite.vue'
import DocQnaDetail from './mypage/docqnadetail.vue'
import DocQnaModify from './mypage/docqnamodify.vue'
import DocReservation from './mypage/docreservation.vue'

const routes = [
    {
        path: '/',
        name: 'defaultLayout',
        component: defaultLayout,
        children: [
            {
                path: '/',
                component: HelloWorld,
            },
            {
                path: '/login',
                component: LoginPage,
            },
            {
                path: '/find',
                component: FindPage,
            },
            {
                path: '/join',
                component: JoinPage,
            },
            {
                path: '/joincond',
                component: JoincondPage,
            },
            {
                path: '/review',
                component: nReviewPage,
            },
            {
                path: '/review/reviewdetail/',
                component: nReviewDetailPage,
            },
            {
                path: '/mypage',
                component: DocmypagePage
            },
            {
                path: '/mypage/update',
                component: UpdatemypagePage
            },
            {
                 path: '/mypage/docreview',
                 component: DocReview
            },
            {
                path: '/mypage/docreview/write',
                component: DocReviewWrite
            },
            {
                path: '/mypage/docreview/detail',
                component: DocReviewDetail
            },
            {
                path: '/mypage/docreview/detail/modify',
                component: DocReviewModify
            },
            {
                path: '/mypage/docqna',
                component: DocQna
            },
            {
                path: '/mypage/docqna/detail/write',
                component: DocQnaWrite
            },
            {
                path: '/mypage/docqna/detail',
                component: DocQnaDetail
            },
            {
                path: '/mypage/docqna/detail/modify',
                component: DocQnaModify
            },
            {
                path: '/mypage/docreservation',
                component: DocReservation
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
                path: 'reviewlist/reviewdetail/',
                component: aReviewDetailPage,
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App)
app.use(router);
app.use(store);
app.use(VueSweetalert2);
//app.use(Vuetify);
app.mount('#app')