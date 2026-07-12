<template>
    <SearchDialogHost />
    <SubmissionDialog v-model="visible" />
</template>

<script setup lang="ts">
import SearchDialogHost from '@/components/search-dialog-host.vue';
import SubmissionDialog from '@/components/submission-dialog.vue';
import { useSubmissionDialogStore } from '@/stores/useSubmissionDialogStore';
import { storeToRefs } from 'pinia';

const submissionDialogStore = useSubmissionDialogStore();
const { visible } = storeToRefs(submissionDialogStore);
</script>
