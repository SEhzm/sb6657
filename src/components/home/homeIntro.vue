<template>
    <div>
        <p class="announcement">
            <b>这是一个收集6657烂梗的网站：</b>
            <span class="web-url">
                <a href="https://sb6657.cn">sb6657.cn</a>
            </span>
            尽情欣赏你们的烂梗吧。
        </p>
        <h2 style="color: red;">sb6657专属支付宝拼手气红包口令：sb6657cn加油 </h2>
        <p class="sub-info">
            <b>
                油猴插件(已支持斗鱼新UI)
                <a href="https://cdn.hguofichp.cn/sb6657.cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js" target="_blank">点击下载</a>
                可在斗鱼直播间一键发送烂梗
            </b>
        </p>
        <p class="sub-info">开放注册功能，可能会出现收不到邮件的情况。</p>
        <p class="sub-info">目前已支持玩机器直播间开播提醒</p>
        <p class="sub-info">目前已优化Ai造梗功能，响应时间大幅提升</p>
        <p class="sub-info">
            <RouterLink to="/update">网站更新日志</RouterLink>
        </p>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped lang="scss">
.announcement {
    font-size: 16px;
    margin-bottom: 8px;
    .web-url {
        font-size: 20px;
        font-weight: bold;

        a {
            color: red;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }
}
.sub-info {
    font-size: 14px;
    margin-top: 8px;

    a {
        color: #409eff;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
