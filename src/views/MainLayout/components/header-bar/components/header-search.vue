<template>
    <el-input v-model="enteringSearchKey" type="search" placeholder="输入以搜索烂梗..." clearable @keyup.enter="handleSearchMemeOnEnter">
        <template #append>
            <el-button type="primary" @click="handleSearchMeme">
                <el-icon>
                    <Search />
                </el-icon>
            </el-button>
        </template>
    </el-input>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const SEARCH_QUERY_KEY = 'search';
const enteringSearchKey = ref('');
const route = useRoute();
const router = useRouter();

function handleSearchMeme() {
    const nextSearchKey = enteringSearchKey.value.trim();
    if (nextSearchKey === '') {
        ElMessage.warning('请输入搜索内容');
        return;
    }

    void router.push({
        query: {
            ...route.query,
            [SEARCH_QUERY_KEY]: nextSearchKey,
        },
    });
}

function handleSearchMemeOnEnter(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    handleSearchMeme();
    (event.target as HTMLInputElement)?.blur();
}
</script>
