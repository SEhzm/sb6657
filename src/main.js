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
    // 移除之前的烟花
    const existing = document.querySelector('.mini-firework');
    if (existing) existing.remove();

    // 创建烟花容器
    const container = document.createElement('div');
    container.className = 'mini-firework';
    Object.assign(container.style, {
        position: 'fixed',
        left: `${event.clientX}px`,
        top: `${event.clientY-140}px`,
        width: '300px',   // 控制烟花显示区域
        height: '300px',
        transform: 'translate(-50%, -50%)', // 居中定位
        pointerEvents: 'none',
        zIndex: 9999
    });
    document.body.appendChild(container);

    // 小型烟花配置
    const fireworks = new Fireworks(container, {
        autoresize: false,
        acceleration: 1.02,
        friction: 0.96,
        gravity: 1.2,
        particles: 50,    // 减少粒子数量
        explosion: 3,     // 减小爆炸强度
        traceLength: 5,
        hue: { min: 0, max: 360 },
        brightness: { min: 60, max: 80 },
        mouse: { click: false }, // 禁用鼠标追踪
        boundaries: {
            x: 50,        // 限制爆炸范围
            y: 50,
            width: 200,
            height: 200
        },
        sound: { enable: false },
        delay: { min: 5, max: 15 },
        lineWidth: {
            explosion: { min: 1, max: 2 }, // 更细的线条
            trace: { min: 1, max: 2 }
        }
    });

    fireworks.start();
    
    // 1.5秒后自动清理
    setTimeout(() => {
        fireworks.stop();
        container.remove();
    }, 1500);
});

//生产环境去除console
const VITE_NODE_ENV = import.meta.env.VITE_NODE_ENV;
if (VITE_NODE_ENV !== 'development') {
    console.log = function () {}
    console.error = function(){}
    console.dir = function(){}
    console.warn = function(){}
}
app.mount('#app');
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}