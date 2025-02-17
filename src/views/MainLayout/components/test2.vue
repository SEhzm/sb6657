<template>
    <div class="card">
        <div class="circle flex-h" @click="handleClick" :class="isUp ? 'check' : ''">
            <div class="img-box" :class="isUp ? 'img-box-check' : ''">
                <img v-if="isUp" class="imgStyle" src="@/assets/imgs/likes.png" alt="" />
                <img v-else class="imgStyle" src="@/assets/imgs/likes2.png" alt="" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const isUp = ref(false);

function handleClick() {
    isUp.value = !isUp.value;
}
</script>

<style lang='scss' scoped>
.circle {
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0px 0px 0px 0px rgba(223, 46, 58, 0.5);

    .img-box {
        width: 50px;
        height: 50px;

        .imgStyle {
            width: 48px;
            height: 48px;
            transition: filter 0.3s ease; // 添加过渡效果
        }

        &:hover .imgStyle {
            color: blue;
        }
    }
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