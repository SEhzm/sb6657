<template>
    <el-dropdown trigger="hover">
        <slot :total="totalUnreadMessages" />
        <template #dropdown>
            <el-dropdown-menu>
                <router-link to="/me-msg">
                    <el-dropdown-item>评论 ({{ commentNum }})</el-dropdown-item>
                    <el-dropdown-item>赞和表态 ({{ likeAndStatementNum }})</el-dropdown-item>
                </router-link>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import httpInstance from '@/apis/httpInstance';
import { computed, onMounted, onUnmounted, ref } from 'vue';

interface MessageCountData {
    likeAndStatementNum: number;
    commentNum: number;
}

interface MessageCountResponse {
    code: number;
    data?: MessageCountData;
}

const likeAndStatementNum = ref(0);
const commentNum = ref(0);
const totalUnreadMessages = computed(() => likeAndStatementNum.value + commentNum.value);
let pollingTimer: ReturnType<typeof setInterval> | undefined;

async function fetchMsgNum() {
    try {
        const res = (await httpInstance.get('/machine/SysMessage/getMsgNum')) as unknown as MessageCountResponse;
        if (res.code === 200 && res.data) {
            likeAndStatementNum.value = res.data.likeAndStatementNum;
            commentNum.value = res.data.commentNum;
            return;
        }

        likeAndStatementNum.value = 0;
        commentNum.value = 0;
    } catch (error) {
        console.error('获取消息数量失败:', error);
    }
}

onMounted(() => {
    void fetchMsgNum();
    pollingTimer = setInterval(
        () => {
            void fetchMsgNum();
        },
        30 * 60 * 1000
    );
});

onUnmounted(() => {
    if (pollingTimer) clearInterval(pollingTimer);
});
</script>
