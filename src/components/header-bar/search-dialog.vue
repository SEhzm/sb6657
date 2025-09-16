<template>
    <div>
        <el-dialog draggable v-model="showDialog" class="dialog-main">
            <!-- Header -->
            <template #header>
                <span class="search-tips">烂梗搜索结果:</span>
            </template>

            <!-- 高级筛选 -->
            <div class="advanced-search">
                <div class="title">
                    <div class="title-left">
                        <span class="title-text">高级筛选</span>
                        <el-button text @click="toggleAdvancedSearch" class="collapse-btn">
                            <span class="collapse-text">{{ isAdvancedSearchCollapsed ? '展开' : '收起' }}</span>
                            <el-icon>
                                <component :is="isAdvancedSearchCollapsed ? 'ArrowDown' : 'ArrowUp'" />
                            </el-icon>
                        </el-button>
                        <el-button v-if="sortType === 'id'" text type="info" @click="sortByCopyCount"
                            :size="isMobile ? 'small' : 'default'">
                            {{ isMobile ? '复制数排序' : '点击按复制次数排序' }}
                        </el-button>
                        <el-button v-else-if="sortType === 'copy'" text type="info" @click="sortById"
                            :size="isMobile ? 'small' : 'default'">
                            {{ isMobile ? '时间排序' : '点击按id(时间)排序' }}
                        </el-button>
                    </div>
                    <el-button text type="danger" @click="clearAdvancedSearch">
                        {{ isMobile ? '清空筛选' : '清空已选高级搜索' }}
                    </el-button>
                </div>
                <transition name="collapse">
                    <div v-show="!isAdvancedSearchCollapsed" class="collapsible-content">
                        <div class="time-container">
                            <el-date-picker class="time-picker" v-model="submitTime" type="daterange"
                                range-separator="到" value-format="YYYY-MM-DD" start-placeholder="起始"
                                end-placeholder="结束" :disabled-date="disabledDate" />
                        </div>
                        <div class="tags-container">
                            <div class="selected-tags">
                                <div class="tags-title">已选标签:</div>
                                <div class="tags" v-if="selectedTags.length > 0">
                                    <el-tag class="tag1" v-for="tag in selectedTags" :key="tag.dictValue" round
                                        @click="removeTag(tag)">
                                        <div class="tag-icon-wrapper">
                                            <img v-if="tag.iconUrl" :src="tag.iconUrl" class="tag-icon" />
                                            <span class="tag-label">{{ tag.dictLabel }}</span>
                                            <el-icon>
                                                <Close />
                                            </el-icon>
                                        </div>
                                    </el-tag>
                                </div>
                                <div v-if="selectedTags.length === 0" class="empty-tips">
                                    暂无已选标签(点击下面标签进行筛选)
                                </div>
                            </div>
                            <div class="all-tags">
                                <div class="tags-title">所有标签:</div>
                                <div class="tags">
                                    <el-tag class="tag1" v-for="tag in allTags" :key="tag.dictValue" round
                                        @click="addTag(tag)">
                                        <div class="tag-icon-wrapper">
                                            <img v-if="tag.iconUrl" :src="tag.iconUrl" class="tag-icon" />
                                            <span class="tag-label">{{ tag.dictLabel }}</span>
                                            <el-icon>
                                                <Plus />
                                            </el-icon>
                                        </div>
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <!-- Table -->
            <el-table :data="highlightedMemeArr" stripe cell-class-name="hover-pointer" row-key="id" :lazy="true">
                <!-- 自定义空状态插槽 -->
                <template #empty>
                    <div class="empty-state">
                        <el-icon v-if="emptyText !== '没有找到搜索结果。想要补充更多烂梗？请去首页投稿！'" class="loading-icon">
                            <Loading />
                        </el-icon>
                        <span>{{ emptyText }}</span>
                    </div>
                </template>
                <!-- 序号列 -->
                <el-table-column align="center" width="70">
                    <template #default="scope">
                        <div class="row-number" v-memo="[scope.$index]">{{ scope.row.id }}</div>
                    </template>
                </el-table-column>

                <!-- 内容列 -->
                <el-table-column prop="content">
                    <template #default="scope">
                        <div v-memo="[scope.row.id, scope.row.highlightedContent, props.searchKey]">
                            <el-popover placement="top" width="auto" trigger="hover">
                                <template #reference>
                                    <div class="barrage-text"
                                        v-html="scope.row.highlightedContent || scope.row.content">
                                    </div>
                                </template>
                                <template #default>
                                    <div class="popover-details">
                                        <div class="tag-list">
                                            <div v-for="item in getDictLabel(scope.row.tags)" :key="item.label">
                                                <el-tag round effect="dark" class="tag-item">
                                                    <div class="tag-icon-wrapper">
                                                        <img v-if="item.iconUrl" :src="item.iconUrl" class="tag-icon" />
                                                        <span class="tag-label">{{ item.label }}</span>
                                                    </div>
                                                </el-tag>
                                            </div>
                                        </div>
                                        <div class="submit-time">投稿时间: {{ formatSubmitTime(scope.row.submitTime) }}
                                        </div>
                                    </div>
                                </template>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>

                <!-- 操作列 -->
                <el-table-column align="center" width="100">
                    <template #default="scope">
                        <div v-memo="[scope.row.id, scope.row.copyCount]">
                            <el-button type="primary" class="copy-btn" @click.stop="handleCopyMeme(scope.row)">
                                复制 (<flip-num :num="scope.row.copyCount" />)
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页组件 -->
            <div class="pagination-container" v-if="total > 0">
                <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total"
                    :layout="isMobile ? 'prev, pager, next' : 'total, prev, pager, next, jumper'" size="small"
                    background />
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { throttle, debounce } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy } from '@/utils/clipboard';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';
import { searchMeme } from '@/apis/getMeme';
import flipNum from '@/components/flip-num.vue';
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMemeTagsStore } from '@/stores/memeTags';
import type { getMemeTags as memeTag } from '@/types/meme';
import { Plus, Close, ArrowDown, ArrowUp, Loading } from '@element-plus/icons-vue'
import { useIsMobile } from '@/utils/common';

// ==================== 类型定义 ====================
interface Meme {
    id: string;
    content: string;
    tags: string;
    submitTime: string;
    copyCount: number;
    highlightedContent?: string;
}

// ==================== Props & Model ====================
const showDialog = defineModel<boolean>();
const props = defineProps<{
    searchKey: string;
}>();
const isMobile = useIsMobile();

// ==================== Store ====================
const memeTagsStore = useMemeTagsStore();
const { memeTags } = storeToRefs(memeTagsStore);

// ==================== 搜索功能模块 ====================
const memeArr = ref<Meme[]>([]);
const loading = ref(false);
const emptyText = ref('正在搜索中...坐和放宽...');
const sortType = ref<'id' | 'copy'>('id');

// 搜索相关工具函数
function resetSearchState() {
    memeArr.value = [];
    currentPage.value = 1;
    total.value = 0;
    emptyText.value = '正在搜索中...坐和放宽...';
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 搜索业务逻辑
async function performSearch(searchKey: string, tags?: string[], timeRange?: [string, string] | []) {
    const res = await searchMeme(searchKey, tags, timeRange);

    if (!res || res === 'notfound') {
        memeArr.value = [];
        total.value = 0;
        currentPage.value = 1;
        emptyText.value = '没有找到搜索结果。想要补充更多烂梗？请去首页投稿！';
    } else {
        memeArr.value = res as Meme[];
        total.value = res.length;
        currentPage.value = 1;
    }
}

// 排序功能
function sortByCopyCount() {
    memeArr.value.sort((a, b) => b.copyCount - a.copyCount);
    sortType.value = 'copy';
}

function sortById() {
    memeArr.value.sort((a, b) => Number(b.id) - Number(a.id));
    sortType.value = 'id';
}

// 防抖搜索
const debouncedSearch = debounce(async (searchKey: string) => {
    if (!searchKey) return;
    loading.value = true;
    resetSearchState();
    await performSearch(searchKey);
    loading.value = false;
}, 300);

const debouncedAdvancedSearch = debounce(async (searchKey: string, tags?: string[], time?: [string, string] | []) => {
    memeArr.value = [];
    await performSearch(searchKey, tags, time);
}, 300);

// ==================== 分页功能模块 ====================
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

// 分页计算属性
const paginatedMemeArr = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return memeArr.value.slice(start, end);
});

// ==================== 高级搜索功能模块 ====================
const isAdvancedSearchCollapsed = ref(true);
const allTags = ref<memeTag[]>([]);
const selectedTags = ref<memeTag[]>([]);
const submitTime = ref<[string, string] | []>([]);
let tagLoaded = false;

// 高级搜索相关函数
function resetAdvancedSearch() {
    selectedTags.value = [];
    allTags.value = [...memeTags.value];
    submitTime.value = [];
}

function toggleAdvancedSearch() {
    isAdvancedSearchCollapsed.value = !isAdvancedSearchCollapsed.value;
}

function clearAdvancedSearch() {
    if (selectedTags.value.length === 0 && submitTime.value.length === 0) return;
    resetAdvancedSearch();
    resetSearchState();
}

const disabledDate = (time: Date) => {
    return time.getTime() < new Date('2024-09-24').getTime();
};

// ==================== 标签功能模块 ====================
// 标签操作函数
function addTag(tag: memeTag) {
    selectedTags.value.push(tag);
    allTags.value = allTags.value.filter(t => t.dictValue !== tag.dictValue);
}

function removeTag(tag: memeTag) {
    allTags.value.push(tag);
    selectedTags.value = selectedTags.value.filter(t => t.dictValue !== tag.dictValue);
}

// 标签解析工具函数
function getDictLabel(tags: string | null | undefined): { label: string; iconUrl: string }[] {
    if (!tags || tags.trim() === '') return [];

    const uniqueTags = [...new Set(tags.split(',').map(tag => tag.trim()))];

    if (!memeTags.value) {
        return uniqueTags.map(tag => ({ label: tag, iconUrl: '' }));
    }

    const dictMap = new Map(memeTags.value.map(item => [String(item.dictValue).trim(), item]));

    return uniqueTags.map(tag => {
        const dictItem = dictMap.get(tag);
        return dictItem
            ? { label: dictItem.dictLabel, iconUrl: dictItem.iconUrl }
            : { label: '未知标签', iconUrl: '' };
    });
}

// ==================== 复制功能模块 ====================
// 复制相关函数
const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);

async function handleCopyMeme(meme: Meme) {
    const copyResult = copyMeme(meme.content);
    if (!copyResult || copyResult === 'limitedSuccess') return;

    copySuccess();
    const success = await copyCountPlus1('', meme.id);

    if (success) {
        const targetIndex = memeArr.value.findIndex(item => item.id === meme.id);
        if (targetIndex !== -1) {
            memeArr.value[targetIndex].copyCount += 1;
        }
    } else {
        plus1Error();
    }
}

// ==================== 工具函数模块 ====================
function formatSubmitTime(timeString: string): string {
    if (!timeString) return '';
    return timeString.replace('T', ' ').split('.')[0];
}

// ==================== 计算属性模块 ====================
const highlightedMemeArr = computed(() => {
    if (!props.searchKey || !paginatedMemeArr.value.length) return paginatedMemeArr.value;

    const regex = new RegExp(escapeRegExp(props.searchKey), 'gi');
    return paginatedMemeArr.value.map(meme => ({
        ...meme,
        highlightedContent: meme.content.replace(regex, match =>
            `<span style="background-color: yellow">${match}</span>`
        )
    }));
});

// ==================== 监听器模块 ====================
// 监听对话框显示状态
watch(showDialog, (newVal) => {
    if (!newVal) {
        resetSearchState();
        resetAdvancedSearch();
    }
});

// 监听搜索关键词变化
watch(
    () => props.searchKey,
    (newVal) => debouncedSearch(newVal),
    { immediate: true }
);

// 监听标签数据加载
watch(memeTags, (newVal) => {
    if (tagLoaded || newVal.length === 0) return;
    tagLoaded = true;
    allTags.value = [...newVal];
});

// 监听高级搜索条件变化
watch(
    [selectedTags, submitTime],
    ([tags, time]) => {
        const tagArr = tags.map(t => t.dictValue);
        debouncedAdvancedSearch(props.searchKey, tagArr, time);
    },
    { deep: true }
);
</script>

<style scoped lang="scss">
// 根容器
:deep(.dialog-main) {
    width: 96%;
    max-width: 1200px;

    // Header 部分
    .search-tips {
        font-size: x-large;
    }

    // 高级筛选部分
    .advanced-search {
        border: 1px solid #e4e7ed;
        padding: 0 6px;
        background-color: #eee;

        .title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;

            .title-left {
                display: flex;
                align-items: center;
                gap: 4px;

                .title-text {
                    font-weight: 600;
                    font-size: 16px;
                    color: #303133;
                }

                .collapse-btn {
                    padding: 4px 8px;
                    min-height: auto;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #409eff;

                    .collapse-text {
                        font-size: 13px;
                    }

                    .el-icon {
                        font-size: 14px;
                    }

                    &:hover {
                        background-color: #ecf5ff;
                    }
                }
            }
        }

        // 折叠动画
        .collapse-enter-active,
        .collapse-leave-active {
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .collapse-enter-from,
        .collapse-leave-to {
            max-height: 0;
            opacity: 0;
            transform: translateY(-10px);
        }

        .collapse-enter-to,
        .collapse-leave-from {
            max-height: 500px;
            opacity: 1;
            transform: translateY(0);
        }

        .collapsible-content {
            overflow: hidden;

            .time-container {
                .time-picker {
                    // 时间选择器样式可以在这里添加
                }
            }

            .tags-container {

                .selected-tags,
                .all-tags {
                    margin-bottom: 16px;

                    .tags-title {
                        font-weight: 500;
                        margin-bottom: 10px;
                        color: #606266;
                        font-size: 14px;
                    }

                    .tags {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;

                        .tag1 {
                            margin: 0;
                            cursor: pointer;
                            border: 1px solid #dcdfe6;
                            background-color: #f5f7fa;

                            &:hover {
                                border-color: #409eff;
                                background-color: #ecf5ff;
                            }

                            .tag-icon-wrapper {
                                display: flex;
                                align-items: center;
                                gap: 4px;

                                .tag-icon {
                                    width: 18px;
                                    object-fit: cover;
                                }

                                .tag-label {
                                    font-size: 13px;
                                }
                            }
                        }
                    }

                    .empty-tips {
                        color: #909399;
                        font-size: 13px;
                        font-style: italic;
                    }
                }
            }
        }
    }

    // Table 部分
    .el-table {
        .empty-state {

            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 20px 0;
            color: #909399;

            .loading-icon {
                font-size: 24px;
                animation: rotate 1s linear infinite;
            }

            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                }

                to {
                    transform: rotate(360deg);
                }
            }
        }

        .row-number {
            font-size: 20px;
            font-weight: 600;
            color: #888888;
            line-height: 1;
            font-style: italic;
        }

        .barrage-text {
            width: 100%;
            cursor: pointer;
        }

        .copy-btn {
            width: 90px;
        }
    }

    // 分页组件
    .pagination-container {
        display: flex;
        justify-content: center;
        margin-top: 16px;
        padding: 0 16px;
    }
}

// Table 全局样式
:deep(.hover-pointer .cell) {
    cursor: pointer;
}

// Popover 内部样式
.popover-details {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .tag-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;

        .tag-item {
            font-size: 16px;
            cursor: pointer;

            .tag-icon-wrapper {
                height: 100%;
                width: 100%;
                display: flex;
                align-items: center;
                gap: 4px;
                cursor: pointer;

                .tag-icon {
                    width: 18px;
                    object-fit: cover;
                    vertical-align: middle;
                }

                .tag-label {
                    vertical-align: middle;
                }
            }
        }
    }

    .submit-time {
        color: #909399;
        font-size: 14px;
    }
}
</style>
