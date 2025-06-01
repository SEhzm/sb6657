import { createRouter, createWebHashHistory } from 'vue-router';
import NotFoundView from '@/views/404.vue';
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'MainLayout',
            component: () => import('@/views/MainLayout/MainLayout.vue'),
            redirect: '/home',
            children: [
                // 路由映射
                { path: 'home', name: 'Home', component: () => import('@/views/MainLayout/components/Home.vue') },
                { path: 'ChatRoom', name: 'ChatRoom', component: () => import('@/components/ChatRoom.vue') },
                { path: 'image', name: 'image', component: () => import('@/views/MainLayout/components/image.vue') },
                { path: 'test', name: 'test', component: () => import('@/views/MainLayout/components/test.vue') },
                { path: 'test2', name: 'test2', component: () => import('@/views/MainLayout/components/test2.vue') },
                { path: 'Starrysky', name: 'Starrysky', component: () => import('@/views/Starrysky.vue') },
                { path: 'Tampermonkey', name: 'Tampermonkey', component: () => import('@/views/MainLayout/components/Tampermonkey.vue') },
                { path: 'UserInfo', name: 'UserInfo', component: () => import('@/views/MainLayout/components/user/components/index.vue') },
                { path: 'post-bar', name: 'post-bar', component: () => import('@/views/MainLayout/components/post-bar/post-bar-main.vue') },
                { path: 'me-post', name: 'me-post', component: () => import('@/views/MainLayout/components/post-bar/Me-Post.vue') },
                { path: 'me-msg', name: 'me-msg', component: () => import('@/views/MainLayout/components/post-bar/Post-Message.vue') },
                { path: 'memes/:category', name: 'memes', component: () => import('@/views/MainLayout/components/memes-view.vue') },
                { path: 'cs2-major', name: 'CS2Major', component: () => import('@/views/MatchPrediction/CS2Major.vue') },
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

