<template>
    <div class="footer">
        <div class="content">
            <div class="date-font">距服务器到期还有<span>{{ serverDate }}</span>天</div>
            <div>本站已完全支持ipv6访问，基于腾讯云服务器搭建 域名所有: <a href="https://yuba.douyu.com/member/LW7rKJ9qVVwG/main/news" target="_blank">@陈苏何</a></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const serverDate = ref(0);
const txServerDate = new Date('2025-02-20'); // 服务器到期日期
const currentDate = new Date();
serverDate.value = Math.ceil((txServerDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
</script>

<style scoped lang="scss">
.footer {
    height: 40px;
    width: 100%;
    font-family: Arial;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        .date-font {
            font-weight: bold;
            span {
                color: red;
            }
        }
    }

}
</style>
