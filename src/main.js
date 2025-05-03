import { createApp } from 'vue';
import { createPinia } from 'pinia'
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import '@/assets/css/global.css';

const app = createApp(App);
const pinia = createPinia()
/**
 * 统一命名
 * allbarrage
 * mygo
 * p1
 * penPlayer
 * penWJQ
 * QMLW
 * QUQU
 * ZbjHuPen
 */

app.use(router);
app.use(ElementPlus, {
    locale: zhCn,
});
app.use(pinia)

// 设置全局定时器
setInterval(() => {
    location.reload();
}, 86400000);


//生产环境去除console
const VITE_NODE_ENV = import.meta.env.VITE_NODE_ENV;
if (VITE_NODE_ENV !== 'development') {
    console.log = function () {}
    //console.error = function(){}
    console.dir = function(){}
    console.warn = function(){}
}
app.mount('#app');
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
