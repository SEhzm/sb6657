<template>
    <div v-if="visible" class="screensaver-overlay" @click="dismiss">
        <img
            v-for="item in items"
            :key="item.id"
            :src="item.src"
            class="screensaver-gif"
            :style="item.style"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const GIF_LIST = [
    'https://pic1.imgdb.cn/item/6a2785833c9809430d39362d.gif',
    'https://pic1.imgdb.cn/item/6a27858b3c9809430d39362f.gif',
    'https://pic1.imgdb.cn/item/6a27858b3c9809430d39362e.gif',
];

const POOL_SIZE = 10;
const IDLE_TIMEOUT = 10 * 60 * 1000;

const visible = ref(false);
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let spawnTimer: ReturnType<typeof setInterval> | null = null;
let nextId = 0;

interface GifItem {
    id: number;
    src: string;
    style: Record<string, string>;
}

const items = ref<GifItem[]>([]);

function randBetween(a: number, b: number): number {
    return a + Math.random() * (b - a);
}

function createGifItem(): GifItem {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const src = GIF_LIST[Math.floor(Math.random() * GIF_LIST.length)];

    let size: number;
    let zIndex: number;
    let blur: number;
    size = 80 + Math.random() * 60;
        zIndex = 2;
        blur = 0;
    const duration = 8 + Math.random() * 12;
    const delay = Math.random() * 2;
    const edge = Math.floor(Math.random() * 4);
    let startX: number, startY: number, endX: number, endY: number;
    let easing: string;

    switch (edge) {
        case 0: // top -> bottom
            startX = randBetween(0, w - size);
            startY = -size;
            endX = startX + randBetween(-300, 300);
            endY = h + size;
            easing = Math.random() > 0.5 ? 'ease-in' : 'ease-out';
            break;
        case 1: // right -> left
            startX = w + size;
            startY = randBetween(0, h - size);
            endX = -size;
            endY = startY + randBetween(-200, 200);
            easing = Math.random() > 0.5 ? 'ease-in' : 'ease-out';
            break;
        case 2: // bottom -> top
            startX = randBetween(0, w - size);
            startY = h + size;
            endX = startX + randBetween(-300, 300);
            endY = -size;
            easing = Math.random() > 0.5 ? 'ease-in' : 'ease-out';
            break;
        default: // left -> right
            startX = -size;
            startY = randBetween(0, h - size);
            endX = w + size;
            endY = startY + randBetween(-200, 200);
            easing = Math.random() > 0.5 ? 'ease-in' : 'ease-out';
            break;
    }

    const id = nextId++;
    return {
        id,
        src,
        style: {
            width: `${size}px`,
            height: `${size}px`,
            left: `${startX}px`,
            top: `${startY}px`,
            zIndex: `${zIndex}`,
            filter: blur > 0 ? `blur(${blur}px)` : 'none',
            '--start-x': `${startX}px`,
            '--start-y': `${startY}px`,
            '--end-x': `${endX}px`,
            '--end-y': `${endY}px`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            animationTimingFunction: easing,
        },
    };
}

function removeItem(id: number) {
    items.value = items.value.filter(item => item.id !== id);
}

function spawnOne() {
    const item = createGifItem();
    items.value.push(item);
    const dur = (parseFloat(item.style.animationDuration) + parseFloat(item.style.animationDelay)) * 1000;
    setTimeout(() => removeItem(item.id), dur);
}

function maintainPool() {
    if (spawnTimer) clearInterval(spawnTimer);
    spawnTimer = setInterval(() => {
        // 根据当前在线数量动态调整补充间隔
        const needed = POOL_SIZE - items.value.length;
        for (let i = 0; i < needed; i++) {
            setTimeout(() => spawnOne(), i * randBetween(200, 800));
        }
    }, 800);
}

function show() {
    items.value = [];
    for (let i = 0; i < POOL_SIZE; i++) {
        setTimeout(() => spawnOne(), i * randBetween(150, 500));
    }
    visible.value = true;
    maintainPool();
}

function dismiss() {
    visible.value = false;
    items.value = [];
    if (spawnTimer) {
        clearInterval(spawnTimer);
        spawnTimer = null;
    }
    resetTimer();
}

function resetTimer() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(show, IDLE_TIMEOUT);
}

function onActivity() {
    if (visible.value) return;
    resetTimer();
}

onMounted(() => {
    document.addEventListener('mousemove', onActivity);
    document.addEventListener('keydown', onActivity);
    document.addEventListener('touchstart', onActivity);
    resetTimer();
});

onUnmounted(() => {
    if (idleTimer) clearTimeout(idleTimer);
    if (spawnTimer) clearInterval(spawnTimer);
    document.removeEventListener('mousemove', onActivity);
    document.removeEventListener('keydown', onActivity);
    document.removeEventListener('touchstart', onActivity);
});
</script>

<style scoped>
.screensaver-overlay {
    position: fixed;
    inset: 0;
    z-index: 99999;
    overflow: hidden;
    pointer-events: auto;
}

.screensaver-gif {
    position: fixed;
    object-fit: contain;
    pointer-events: none;
    animation: drift linear forwards;
    image-rendering: auto;
    will-change: left, top, opacity;
}

@keyframes drift {
    0% {
        left: var(--start-x);
        top: var(--start-y);
        opacity: 0;
    }
    15% {
        opacity: 1;
    }
    85% {
        opacity: 1;
    }
    100% {
        left: var(--end-x);
        top: var(--end-y);
        opacity: 0;
    }
}
</style>