import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { Fireworks } from 'fireworks-js';
import '@/assets/css/global.css';

const app = createApp(App);

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

// 设置全局定时器
setInterval(() => {
    location.reload();
}, 86400000);


// 监听鼠标点击事件，触发烟花效果
document.addEventListener('mousedown', (event) => {
    // 移除之前的 canvas 容器
    const previousContainers = document.querySelectorAll('.fireworks-container');
    previousContainers.forEach(container => {
        container.remove();
    });

    const container = document.createElement('div');
    container.className = 'fireworks-container'; // 添加类名以便后续移除
    container.style.position = 'fixed'; // 使用 fixed 确保覆盖整个屏幕
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const fireworks = new Fireworks(container, {
        traceLength: 5,              // 烟花轨迹的长度
        size: 300,                     // 烟花粒子的大小
        rocketSpeed: 50,             // 烟花火箭的速度
        rocketAcceleration: 1,    // 烟花火箭的加速度
        particleFriction: 3.95,      // 烟花粒子的摩擦力
        particleGravity: 2.9,        // 烟花粒子的重力
        colors: ['#00f', '#f00', '#0ff', '#ff0', '#f0f'], // 烟花的颜色数组
        explosionLength: 2,          // 烟花爆炸的长度
        flickering: 150,             // 烟花闪烁的效果
        delay: { min: 30, max: 30 },
        particles: 100
    });

    fireworks.start();
    setTimeout(() => {
        fireworks.stop();
        document.body.removeChild(container);
    }, 1850);
});


app.mount('#app');

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}