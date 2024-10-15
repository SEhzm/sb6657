import {createRouter, createWebHashHistory} from 'vue-router'
import NotFoundView from '@/views/404.vue';
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Manager',
            component: () => import('@/views/Manager.vue'),
            redirect: '/home',
            children: [// 路由映射
                {path: 'home', name: 'Home', component: () => import('@/views/manager/Home.vue')},
                {path: 'penPlayer', name: 'penPlayer', component: () => import('@/views/manager/penPlayer.vue')},
                {path: 'penWJQ', name: 'penWJQ', component: () => import('@/views/manager/penWJQ.vue')},
                {path: 'QMLW', name: 'QMLW', component: () => import('@/views/manager/QMLW.vue')},
                {path: 'ZbjHuPen', name: 'ZbjHuPen', component: () => import('@/views/manager/ZbjHuPen.vue')},
                {path: 'QUQU', name: 'QUQU', component: () => import('@/views/manager/QUQU.vue')},
                {path: 'p1', name: 'p1', component: () => import('@/views/manager/p1.vue')},
                {path: 'image', name: 'image', component: () => import('@/views/manager/image.vue')},
                {path: 'AllBarrage', name: 'AllBarrage', component: () => import('@/views/manager/AllBarrage.vue')},
                {path: 'test', name: 'test', component: () => import('@/views/manager/test.vue')},
                {path: 'test2', name: 'test2', component: () => import('@/views/manager/test2.vue')},
                {path: 'Starrysky', name: 'Starrysky', component: () => import('@/views/Starrysky.vue')},
                {path: 'mygo', name: 'mygo', component: () => import('@/views/manager/mygo.vue')},
                {path: 'Tampermonkey', name: 'Tampermonkey', component: () => import('@/views/manager/Tampermonkey.vue')},
            ]
        },
        {
            path: '/:catchAll(.*)', // 使用正则表达式捕获所有路径
            name: 'NotFound',
            component: NotFoundView,
        }
    ]
})

export default router
