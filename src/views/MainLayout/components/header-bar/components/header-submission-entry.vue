<template>
    <slot :open="submissionDialogStore.open" />
</template>

<script setup lang="ts">
import { useSubmissionDialogStore } from '@/stores/useSubmissionDialogStore';

const submissionDialogStore = useSubmissionDialogStore();
</script>
