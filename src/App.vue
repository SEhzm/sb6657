<template>
    <div>
        <RouterView />
        <StarrySky />
        <IdleScreensaver />
    </div>
</template>

<script setup lang="ts">
import StarrySky from '@/views/Starrysky.vue';
import IdleScreensaver from '@/views/IdleScreensaver.vue';
</script>

<style scoped lang="scss"></style>