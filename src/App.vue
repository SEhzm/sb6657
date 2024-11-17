<template>
    <div class="maintenance">
        <div>
            <p>抱歉:停机维护<br>预计时间一小时
                <el-countdown prefix :value="value" :value-style="{ color: '#f00', fontSize: '70px'}" />
            </p>
        </div>
    </div>

    <RouterView />
    <StarrySky class="starrySky" />
</template>

<script setup lang="ts">
import StarrySky from '@/views/Starrysky.vue';
const value = new Date("2024-11-18 00:30:00")  //1

</script>

<style scoped lang="scss">
@media (min-width: 601px) {
    .maintenance {
        backdrop-filter: blur(6px);
        z-index: 999999;
        width: 100vw;
        height: 100vh;
        position: fixed;
        p {
            margin-top: 300px;
            text-align: center;
            color: red;
            font-size: 100px;
        }
    }
}

@media (max-width: 600px) {
    .starrySky {
        display: none;
    }

    .maintenance {
        backdrop-filter: blur(6px);
        z-index: 999999;
        width: 100vw;
        height: 100vh;
        position: fixed;
        p {
            margin-top: 300px;
            text-align: center;
            background-color: white;
            color: red;
            font-size: 50px;
        }
    }
}
</style>