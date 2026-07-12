<template>
    <slot :current="currentMeme" :rotation="rotationIndex" :open="openHotMeme24h" />

    <MemeDialog v-model="showHotMeme24h" :meme-arr="hotMeme24h" :loading="hotMeme24hLoading" :empty-text="loadingTips" @refresh="refreshHotMeme24h">
        <div class="dialog-header">
            <div>24h热门烂梗</div>
            <div><el-button @click="openHotMeme7d">查看近七天热门</el-button></div>
        </div>
    </MemeDialog>

    <MemeDialog v-model="showHotMeme7d" :meme-arr="hotMeme7d" :loading="hotMeme7dLoading" :empty-text="loadingTips" @refresh="refreshHotMeme7d">
        <div class="dialog-header">
            <div>七天热门烂梗</div>
            <div><el-button @click="openHotMeme24h">查看近24h热门</el-button></div>
        </div>
    </MemeDialog>
</template>

<script setup lang="ts">
import { getHotMeme24h, getHotMeme7d } from '@/apis/getMeme';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import MemeDialog from './meme-dialog.vue';

const loadingTips = '我还没有加载完喔~~';
const showHotMeme24h = ref(false);
const hotMeme24h = ref<Meme[]>([]);
const hotMeme24hLoading = ref(true);
const showHotMeme7d = ref(false);
const hotMeme7d = ref<Meme[]>([]);
const hotMeme7dLoading = ref(true);
const rotationIndex = ref(0);
const currentMeme = computed(() => hotMeme24h.value[rotationIndex.value]?.content ?? '');
let rotationTimer: ReturnType<typeof setInterval> | undefined;

async function refreshHotMeme24h() {
    const memeArr = await getHotMeme24h();
    if (!memeArr) return;
    hotMeme24h.value = memeArr;
    hotMeme24hLoading.value = false;
}

function openHotMeme24h() {
    showHotMeme24h.value = true;
    showHotMeme7d.value = false;
    hotMeme24hLoading.value = true;
    void refreshHotMeme24h();
}

async function refreshHotMeme7d() {
    const memeArr = await getHotMeme7d();
    if (!memeArr) return;
    hotMeme7d.value = memeArr;
    hotMeme7dLoading.value = false;
}

function openHotMeme7d() {
    showHotMeme24h.value = false;
    showHotMeme7d.value = true;
    hotMeme7dLoading.value = true;
    void refreshHotMeme7d();
}

onMounted(() => {
    void refreshHotMeme24h();
    rotationTimer = setInterval(() => {
        const length = hotMeme24h.value.length;
        if (length > 0) rotationIndex.value = (rotationIndex.value + 1) % length;
    }, 5000);
});

onUnmounted(() => {
    if (rotationTimer) clearInterval(rotationTimer);
});
</script>

<style scoped lang="scss">
.dialog-header {
    display: flex;
    justify-content: space-between;
}
</style>
