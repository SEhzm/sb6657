<template>
    <search-dialog v-model="showSearchDialog" :searchKey="searchKey" />
</template>

<script setup lang="ts">
import SearchDialog from '@/components/search-dialog.vue';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const SEARCH_QUERY_KEY = 'search';

const route = useRoute();
const router = useRouter();

const searchKey = ref('');
const showSearchDialog = ref(false);

const routeSearchKey = computed(() => {
    const rawSearchKey = route.query[SEARCH_QUERY_KEY];

    if (Array.isArray(rawSearchKey)) {
        return rawSearchKey[0] ?? '';
    }
    return rawSearchKey ?? '';
});

watch(
    routeSearchKey,
    (newSearchKey) => {
        const nextSearchKey = newSearchKey.trim();

        searchKey.value = nextSearchKey;
        showSearchDialog.value = Boolean(nextSearchKey);
    },
    { immediate: true }
);

watch(showSearchDialog, (show) => {
    if (show || !routeSearchKey.value.trim()) return;

    const nextQuery = { ...route.query };
    delete nextQuery[SEARCH_QUERY_KEY];

    router.replace({ query: nextQuery });
});
</script>
