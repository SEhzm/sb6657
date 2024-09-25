import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import StarrySky from './views/StarrySky.vue'
import '@/assets/css/global.css'

const app = createApp(App)



app.use(router)
app.use(ElementPlus, {
    locale: zhCn,
})

// 设置全局定时器
setInterval(() => {
    location.reload(); // 刷新整个页面
}, 86400000); //设置时间，ms

app.component('StarrySky', StarrySky);
// app.component('audioPlay', audioPlay);
// app.component('videoPlay', videoPlay);

app.mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


