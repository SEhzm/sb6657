<template>
    <div class="me-memes-view">
        <el-card>
            <template #header>
                <span><b>我的投稿</b>（确保在登录状态下投稿）</span>
            </template>
            <el-table :data="memeArr" stripe v-loading="loading" empty-text="暂无投稿~">
                <el-table-column label="烂梗" prop="barrage">
                    <template #default="scope">
                        <el-popover placement="top" :width="'auto'" trigger="hover">
                            <template #reference>
                                <span class="barrage-text">{{ scope.row.barrage }}</span>
                            </template>
                            <template #default>
                                <div style="display: flex; align-items: center; flex-wrap: wrap;">
                                    <div v-for="(item, index) in getDictLabel(scope.row.tags)" :key="index"
                                        style="margin-right: 8px;">
                                        <el-tag round effect="dark" :style="{ fontSize: '15px', cursor: 'pointer' }">
                                            <img v-if="item.iconUrl" :src="item.iconUrl"
                                                style=" width: 16px; height: 16px; object-fit: cover;vertical-align: middle;" />
                                            <span style="vertical-align: middle;"> {{ item.label }}</span>
                                        </el-tag>
                                    </div>
                                    <span
                                        style="position: absolute;bottom: 0;right: 0;font-size: 11px;min-width: 170px;">投稿时间:
                                        {{ formatSubmitTime(scope.row.createTime) }}</span>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="标签" align="center">
                    <template #default="scope">
                        <div style="display: flex; flex-wrap: wrap;">
                            <el-tag v-for="(item, index) in getDictLabel(scope.row.tags)" :key="index" round
                                effect="plain" style="margin-right: 4px;">
                                <img v-if="item.iconUrl" :src="item.iconUrl"
                                    style=" width: 22px; height: 22px; object-fit: cover;vertical-align: middle;" />
                                <span style="vertical-align: middle;">{{ item.label }}</span>
                            </el-tag>
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column label="审核状态" align="center" width="80">
                    <template #default="scope">
                        <el-tag v-if="scope.row.state === 1" type="success">已通过</el-tag>
                        <el-tag v-else-if="scope.row.state === 0" type="info">审核中</el-tag>
                        <el-tag v-else type="danger">未通过</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="投稿时间" align="center" width="100">
                    <template #default="scope">
                        {{ formatSubmitTime(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="复制次数" align="center" width="100" prop="cnt">
                    <template #default="scope">
                        {{ scope.row.cnt || 0 }}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-wrapper">
                <el-pagination v-if="!loading" background layout="prev, pager, next, jumper" :current-page="currentPage"
                    :total="total" :pager-count="5" :page-size="pageSize" @current-change="handlePageChange" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import httpInstance from '@/apis/httpInstance';

interface MemeItem {
    barrage: string;
    tags: string;
    state: number;
    createTime: string;
}

interface DictItem {
    dictValue: string;
    dictLabel: string;
    iconUrl: string;
}

const memeArr = ref<MemeItem[]>([]);
const total = ref(0);
const pageSize = 50;
const currentPage = ref(1);
const loading = ref(true);
const dictData = ref<DictItem[]>([]);

// 获取标签字典
const getDict = () => {
    httpInstance.get('/machine/dictList').then((res: any) => {
        if (res.code === 200) {
            dictData.value = res.data as DictItem[];
        }
    }).catch((err: any) => {
        console.error('获取字典数据失败', err);
    });
};

// 标签映射
const getDictLabel = (tags: string | null | undefined): { label: string; iconUrl: string }[] => {
    if (!tags || tags.trim() === '') {
        return [];
    }
    const tagList = Array.from(new Set(tags.split(',').map(tag => tag.trim())));
    if (!dictData.value) {
        return tagList.map(() => ({ label: '', iconUrl: '' }));
    }
    const dictMap = new Map(
        (dictData.value as DictItem[]).map(item => [String(item.dictValue).trim(), item])
    );
    const labels = tagList.map(tag => {
        const dictItem = dictMap.get(tag);
        return dictItem ? { label: dictItem.dictLabel, iconUrl: dictItem.iconUrl } : { label: '', iconUrl: '' };
    });
    return labels;
};

// 格式化时间
const formatSubmitTime = (timeString: string): string => {
    if (!timeString) return '';
    return timeString.replace('T', ' ').split('.')[0];
};

// 获取我的投稿
const getMeMemes = (pageNum = 1) => {
    loading.value = true;
    httpInstance.get('/machine/MeMemesPageList', {
        params: {
            pageNum,
            pageSize
        }
    }).then((res: any) => {
        memeArr.value = (res.data.list || []) as MemeItem[];
        total.value = res.data.total || 0;
        loading.value = false;
    }).catch(() => {
        memeArr.value = [];
        total.value = 0;
        loading.value = false;
    });
};

const handlePageChange = (page: number) => {
    currentPage.value = page;
    getMeMemes(page);
};

onMounted(() => {
    getDict();
    getMeMemes(1);
});
</script>

<style lang="scss" scoped>
.me-memes-view {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 20px;
}

.barrage-text {
    font-size: 16px;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 16px;
    margin-bottom: 40px;
}
</style>
