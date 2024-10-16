<template>
    <div>
        <HeaderBar></HeaderBar>
        <div class="main">
            <RouterView />
        </div>
        <FooterBar></FooterBar>
        <StarrySky class="starrySky" />
    </div>

</template>

<script setup lang="ts">
import HeaderBar from '@/views/header-bar.vue';
import FooterBar from '@/views/footer-bar.vue';
</script>

<style scoped>
@media (max-width: 600px) {
    .starrySky {
        display: none;
    }
}
</style>