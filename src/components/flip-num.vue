<template>
    <span class="container">
        <div class="place-holder">{{ nextNum }}</div>
        <div :class="`flip ${flipState}`">
            <div>{{ currNum }}</div>
            <div>{{ nextNum }}</div>
        </div>
    </span>
</template>
<script setup lang="ts">
import { watch, ref, nextTick } from 'vue';
import { sleep } from '@/utils/common';

const props = defineProps<{
    num: number;
}>();

const currNum = ref(props.num);
const nextNum = ref(props.num);
let flipping = false;

const flipState = ref<'normal' | 'end' | 'end flex-start'>('normal');

watch(
    () => props.num,
    async (newVaL, oldVal) => {
        currNum.value = oldVal;
        nextNum.value = newVaL;
        if (flipping) {
            currNum.value = newVaL;
            nextNum.value = newVaL;
            return;
        }
        flipping = true;
        // 防止浏览器合并渲染跳过滚动动画，强制渲染带end flex-start类名的那一帧
        await nextTick();
        // 这么写是因为对齐问题。宽度占位用的新值，所以在新值比旧值小的时候要靠左对齐，不然动画很诡异
        flipState.value = newVaL < oldVal ? 'end flex-start' : 'end';
        await sleep(500);
        currNum.value = newVaL;
        nextNum.value = newVaL;
        flipState.value = 'normal';
        flipping = false;
    }
);
</script>
<style scoped lang="scss">
.container {
    height: 14px;
    position: relative;
    overflow: hidden;
    .place-holder {
        opacity: 0;
    }
    .flip {
        position: absolute;
        top: 0px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .normal {
        transform: translateY(0);
    }
    .end {
        transition: transform 0.5s;
        transform: translateY(-50%);
    }
    .flex-start {
        align-items: flex-start;
    }
}
</style>
