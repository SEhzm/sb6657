<template>
    <div>
        <RouterView />
        <StarrySky />
        <IdleScreensaver />
        <AnnouncementDialog />
    </div>
</template>

<script setup lang="ts">
import StarrySky from '@/views/Starrysky.vue';
import IdleScreensaver from '@/views/IdleScreensaver.vue';
import AnnouncementDialog from '@/components/AnnouncementDialog.vue';
</script>

<style scoped lang="scss"></style>