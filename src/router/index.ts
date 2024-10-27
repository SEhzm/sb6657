import { createRouter, createWebHashHistory } from 'vue-router';
import NotFoundView from '@/views/404.vue';
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'MainLayout',
            component: () => import('@/views/MainLayout/MainLayout.vue'),
            redirect: '/home',
            children: [
                // 路由映射
                { path: 'home', name: 'Home', component: () => import('@/views/MainLayout/components/Home.vue') },
                { path: 'penPlayer', name: 'penPlayer', component: () => import('@/views/MainLayout/components/penPlayer.vue') },
                { path: 'penWJQ', name: 'penWJQ', component: () => import('@/views/MainLayout/components/penWJQ.vue') },
                { path: 'QMLW', name: 'QMLW', component: () => import('@/views/MainLayout/components/QMLW.vue') },
                { path: 'ZbjHuPen', name: 'ZbjHuPen', component: () => import('@/views/MainLayout/components/ZbjHuPen.vue') },
                { path: 'QUQU', name: 'QUQU', component: () => import('@/views/MainLayout/components/QUQU.vue') },
                { path: 'p1', name: 'p1', component: () => import('@/views/MainLayout/components/p1.vue') },
                { path: 'image', name: 'image', component: () => import('@/views/MainLayout/components/image.vue') },
                { path: 'AllBarrage', name: 'AllBarrage', component: () => import('@/views/MainLayout/components/AllBarrage.vue') },
                { path: 'test', name: 'test', component: () => import('@/views/MainLayout/components/test.vue') },
                { path: 'test2', name: 'test2', component: () => import('@/views/MainLayout/components/test2.vue') },
                { path: 'Starrysky', name: 'Starrysky', component: () => import('@/views/Starrysky.vue') },
                { path: 'mygo', name: 'mygo', component: () => import('@/views/MainLayout/components/mygo.vue') },
                { path: 'Tampermonkey', name: 'Tampermonkey', component: () => import('@/views/MainLayout/components/Tampermonkey.vue') },
                { path: 'ChatRoom', name: 'ChatRoom', component: () => import('@/components/ChatRoom.vue') },
            ],
        },
        {
            path: '/:catchAll(.*)', // 使用正则表达式捕获所有路径
            name: 'NotFound',
            component: NotFoundView,
        },
    ],
});

export default router;

