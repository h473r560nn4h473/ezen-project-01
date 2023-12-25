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
import JoinPage from './views/join.vue'
import JoincondPage from './views/joincond.vue'
import LoginPage from './views/login.vue'
import nReviewPage from './views/review.vue'
import nReviewDetailPage from './views/reviewdetail.vue'

// 관리자 페이지
import UserInfo from './admin/userInfo.vue'
import ReviewList from './admin/review.vue'
import Qna from './admin/qna.vue'
import ReservationList from './admin/reservation.vue'
import aReviewDetailPage from './admin/reviewdetail.vue'

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