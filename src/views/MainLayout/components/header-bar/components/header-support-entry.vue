<template>
    <el-tooltip v-model:visible="tooltipVisible" effect="light" placement="left">
        <slot :open="openSupportDialog" />
        <template #content>
            如果你喜欢这个网站
            <br />
            可以点我进行赞赏或GitHub点个star~
        </template>
    </el-tooltip>
    <el-dialog v-model="dialogVisible" title="谢谢老板~" :width="dialogWidth" append-to-body>
        <img src="https://cdn.hguofichp.cn/zfb.jpg" alt="" width="100%" />
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

defineProps<{
    dialogWidth: string;
}>();

const tooltipVisible = ref(true);
const dialogVisible = ref(false);
let tooltipTimer: ReturnType<typeof setTimeout> | undefined;
let firstOpenTimer: ReturnType<typeof setTimeout> | undefined;
let repeatOpenTimer: ReturnType<typeof setInterval> | undefined;

function openSupportDialog() {
    dialogVisible.value = true;
}

onMounted(() => {
    tooltipTimer = setTimeout(() => {
        tooltipVisible.value = false;
    }, 2000);

    firstOpenTimer = setTimeout(
        () => {
            dialogVisible.value = true;
            repeatOpenTimer = setInterval(
                () => {
                    dialogVisible.value = true;
                },
                15 * 60 * 1000
            );
        },
        15 * 60 * 1000
    );
});

onUnmounted(() => {
    if (tooltipTimer) clearTimeout(tooltipTimer);
    if (firstOpenTimer) clearTimeout(firstOpenTimer);
    if (repeatOpenTimer) clearInterval(repeatOpenTimer);
});
</script>
