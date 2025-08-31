<template>
        <div class="circle" @click="handleClick">
            <div class="img-box" :class="{'img-box-check': isAnimating}">
                <img class="imgStyle" src="@/assets/imgs/likes.png" alt="" />
                <div class="like-count">{{ likeCount }}</div>
            </div>
        </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    likeCount: number;
}>();

const isAnimating = ref(false);

function handleClick() {
    isAnimating.value = true;
    setTimeout(() => {
        isAnimating.value = false;
    }, 300); // 动画持续时间
}
</script>

<style lang='scss' scoped>
.circle {
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0px 0px 0px 0px rgba(223, 46, 58, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 38px;
}

.img-box {
    width: 25px;
    height: 30px; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.imgStyle {
    width: 25px;
    height: 30px;
    transition: filter 0.3s ease; // 添加过渡效果
}

.like-count {
    font-size: 12px;
    margin-top: -7px;
}

.img-box-check {
    animation: anm 0.5s;
    -moz-animation: anm 0.5s;
    -webkit-animation: anm 0.5s;
    -o-animation: anm 0.5s;
}

@keyframes anm {
    0% {
        transform: scale(0);
        -webkit-transform: scale(0);
        -moz-transform: scale(0);
    }

    50% {
        transform: scale(1.3);
        -webkit-transform: scale(1.3);
        -moz-transform: scale(1.3);
    }

    100% {
        transform: scale(1);
        -webkit-transform: scale(1);
        -moz-transform: scale(1);
    }
}
</style>