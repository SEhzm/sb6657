<template>
    <RouterView />
    <StarrySky class="starrySky" />
</template>

<script setup lang="ts">
import StarrySky from '@/views/Starrysky.vue';
</script>

<style scoped>
@media (max-width: 600px) {
    .starrySky {
        display: none;
    }
}
</style>