<template>
    <el-dialog v-model="dialogFormVisible" draggable title="投稿烂梗" :width="dialogWidth">
        <MemeSubmission :active="dialogFormVisible" />
    </el-dialog>
</template>

<script setup>
import MemeSubmission from '@/components/meme-submission.vue';
import { useIsMobile } from '@/utils/common';
import { computed } from 'vue';

const dialogFormVisible = defineModel();
const isMobile = useIsMobile();
const dialogWidth = computed(() => (isMobile.value ? '98%' : '82%'));
</script>
