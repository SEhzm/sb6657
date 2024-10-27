<template>
    <RouterView />
    <StarrySky class="starrySky" />
</template>

<script setup lang="ts">

</script>

<style scoped>
@media (max-width: 600px) {
    .starrySky {
        display: none;
    }
}
</style>