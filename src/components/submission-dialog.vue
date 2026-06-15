<template>
    <el-dialog v-model="dialogFormVisible" class="submission-dialog" draggable title="投稿烂梗" width="82%">
        <MemeSubmission :active="dialogFormVisible" />
    </el-dialog>
</template>

<script setup>
import MemeSubmission from '@/components/meme-submission.vue';

const dialogFormVisible = defineModel();
</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {
    :deep(.submission-dialog) {
        width: 95% !important;
        margin: 10px auto !important;
    }
}
</style>
