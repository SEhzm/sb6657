<template>
    <div>
        <LikeButton :likeCount="likeCount" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import LikeButton from '@/components/like-num.vue';

const likeCount = ref(100);
</script>

<style lang='scss' scoped>
/* 你可以在这里添加 test2.vue 特定的样式 */
</style>