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
import { watch, ref } from 'vue';
import { sleep } from '@/utils/common';

const props = defineProps<{
    num: number;
}>();

const currNum = ref(props.num);
const nextNum = ref(props.num);
let flipping = false;

const flipState = ref<'normal' | 'end'>('normal');

watch(
    () => props.num,
    async (newVaL, oldVal) => {
        currNum.value = oldVal;
        nextNum.value = Math.max(oldVal, newVaL);
        if (flipping) return;
        flipping = true;
        flipState.value = 'end';
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
    }
    .normal {
        transform: translateY(0);
    }
    .end {
        transition: transform 0.5s;
        transform: translateY(-50%);
    }
}
</style>
