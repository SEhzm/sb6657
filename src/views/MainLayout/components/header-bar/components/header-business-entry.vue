<template>
    <el-tooltip v-model:visible="visible" effect="light" placement="right-end" popper-style="margin-bottom: 0;">
        <slot />
        <template #content>
            接计算机类毕设(论文)，程序设计，
            <br />
            课设，广告，商务，
            <br />
            联系邮箱:he20020928@foxmail.com
        </template>
    </el-tooltip>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const visible = ref(false);
let showTimer: ReturnType<typeof setTimeout> | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
    showTimer = setTimeout(() => {
        visible.value = true;
    }, 2000);
    hideTimer = setTimeout(() => {
        visible.value = false;
    }, 5000);
});

onUnmounted(() => {
    if (showTimer) clearTimeout(showTimer);
    if (hideTimer) clearTimeout(hideTimer);
});
</script>
