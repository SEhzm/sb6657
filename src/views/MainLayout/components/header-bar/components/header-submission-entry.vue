<template>
    <slot :open="openSubmissionDialog" />
    <SubmissionDialog v-model="submissionDialogVisible" />
</template>

<script setup lang="ts">
import SubmissionDialog from '@/components/submission-dialog.vue';
import { ref } from 'vue';

const submissionDialogVisible = ref(false);

function openSubmissionDialog() {
    submissionDialogVisible.value = true;
}
</script>
