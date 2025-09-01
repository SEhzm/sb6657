<template>
    <div>
        <el-dialog draggable v-model="showDialog" class="dialog-main">
            <!-- Header -->
            <template #header>
                <span class="search-tips">烂梗搜索结果:</span>
            </template>

            <!-- Table -->
            <el-table :data="memeArr" stripe :empty-text="emptyText" cell-class-name="hover-pointer">
                <!-- 序号列 -->
                <el-table-column align="center" width="60">
                    <template #default="scope">
                        <el-tag round effect="plain">{{ scope.$index + 1 }}</el-tag>
                    </template>
                </el-table-column>

                <!-- 内容列 -->
                <el-table-column prop="content">
                    <template #default="scope">
                        <el-popover placement="top" :width="'auto'" trigger="hover">
                            <template #reference>
                                <div class="barrage-text" v-html="hightLightData(scope.row.content, props.searchKey)">
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
                                    <div class="submit-time">投稿时间: {{ formatSubmitTime(scope.row.submitTime) }}</div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>

                <!-- 操作列 -->
                <el-table-column align="center" width="100">
                    <template #default="scope">
                        <el-button type="primary" class="copy-btn" @click.stop="copyMeme_countPlus1(scope.row)">
                            复制 (<flip-num :num="scope.row.copyCount" />)
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { throttle } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy } from '@/utils/clipboard';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';
import { searchMeme } from '@/apis/getMeme';
import flipNum from '@/components/flip-num.vue';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useMemeTagsStore } from '@/stores/memeTags';

// --- Pinia Store ---
// 使用 Pinia store 获取标签字典数据
const memeTagsStore = useMemeTagsStore();
// 使用 storeToRefs 来保证解构出的数据是响应式的，这是最佳实践
const { memeTags: dictData } = storeToRefs(memeTagsStore);

// --- Props & Model ---
const showDialog = defineModel<boolean>();
const props = defineProps<{
    searchKey: string;
}>();

// --- Component State ---
const memeArr = ref<Meme[]>([]);
const loading = ref(false);
const emptyText = ref('正在搜索中...坐和放宽...');

// --- API Functions ---
/**
 * 执行高级搜索请求，并更新表格数据
 * @param searchKey 搜索关键词
 * @param tags 标签数组 (可选)
 * @param submitTime 时间范围 (可选)
 */
async function advancedSearch(searchKey: string, tags?: string[], submitTime?: [string, string]) {
    const res = await searchMeme(searchKey, tags, submitTime);
    if (!res || res === 'notfound') {
        memeArr.value = []; // 清空数组以触发 empty-text
        emptyText.value = '没有找到搜索结果。想要补充更多烂梗？请去首页投稿！';
    } else {
        memeArr.value = res;
    }
}

// --- Watchers ---
// 监听外部传入的 searchKey 变化，自动触发搜索
watch(
    () => props.searchKey,
    async (newVal) => {
        if (newVal === null || newVal === '') return;
        loading.value = true;
        await advancedSearch(props.searchKey);
        loading.value = false;
    },
    { immediate: true }
); // immediate: true 可以在组件创建时立即执行一次

// --- Event Handlers ---
// 使用节流函数包装复制操作，防止2秒内重复触发
const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);

/**
 * 处理复制按钮点击事件
 * 1. 调用节流复制函数
 * 2. 如果复制成功，向后端发送请求使复制数+1
 * 3. 刷新当前搜索结果以显示最新的复制数
 */
async function copyMeme_countPlus1(meme: Meme) {
    const res = copyMeme(meme.content);
    if (!res || res === 'limitedSuccess') return;

    copySuccess();
    const success = await copyCountPlus1('', meme.id);
    if (success) {
        // 成功后，重新搜索以刷新数据，而不是整个页面刷新
        await advancedSearch(props.searchKey);
    } else {
        plus1Error();
    }
}

// --- Utility Functions ---
/**
 * [重点重构] 根据标签字符串（如 "1,2,3"）从 Pinia store 中查找并返回对应的标签对象数组
 * @param tags 逗号分隔的标签值字符串
 * @returns 包含 label 和 iconUrl 的对象数组
 */
function getDictLabel(tags: string | null | undefined): { label: string; iconUrl: string }[] {
    // 1. 边缘情况处理：如果 tags 为空或只包含空白，直接返回空数组
    if (!tags || tags.trim() === '') {
        return [];
    }

    // 2. 数据准备：将 "1, 2, 1" 这样的字符串处理成 ["1", "2"] 这样的唯一值数组
    const tagArray = tags.split(','); // "1, 2, 1" -> ["1", " 2", " 1"]
    const trimmedTags = tagArray.map((tag) => tag.trim()); // -> ["1", "2", "1"]
    const uniqueTags = [...new Set(trimmedTags)]; // 使用 Set 去重 -> ["1", "2"]

    // 3. 性能优化：如果字典数据还没加载好，先返回一个占位结构
    if (!dictData.value) {
        return uniqueTags.map((tag) => ({ label: tag, iconUrl: '' }));
    }

    // 4. 创建快速查找表：将数组 [ {dictValue: '1', ...}, ... ] 转换成 Map 结构
    //    这样可以通过 key (dictValue) 快速找到对象，避免每次都遍历整个数组，性能更高。
    const dictMap = new Map(dictData.value.map((item) => [String(item.dictValue).trim(), item]));

    // 5. 查找并返回结果：遍历去重后的标签数组，从 Map 中查找对应的标签信息
    return uniqueTags.map((tag) => {
        const dictItem = dictMap.get(tag);
        return dictItem ? { label: dictItem.dictLabel, iconUrl: dictItem.iconUrl } : { label: '未知标签', iconUrl: '' }; // 给未找到的标签一个默认值
    });
}

/**
 * 格式化 ISO 格式的时间字符串
 * @param timeString "2024-01-01T12:00:00.000Z"
 * @returns "2024-01-01 12:00:00"
 */
function formatSubmitTime(timeString: string): string {
    if (!timeString) return '';
    return timeString.replace('T', ' ').split('.')[0];
}

// 转义特殊字符串正则
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
// 高亮搜索关键字
function hightLightData(text: string, key: string) {
    if (!text || !key) return '';
    // 以搜索词做正则匹配，不区分大小写
    const regex = new RegExp(escapeRegExp(key), 'gi');
    // 把之前搜索完成后的数组，加上高亮
    return text.replace(regex, (match) => `<span style="background-color: yellow">${match}</span>`);
}
</script>

<style scoped lang="scss">
.search-tips {
    font-size: x-large;
}

:deep(.dialog-main) {
    width: 95%;
    max-width: 1200px;
}

:deep(.hover-pointer .cell) {
    cursor: pointer;
}

.barrage-text {
    width: 100%;
    cursor: pointer;
}

// Popover 内部样式
.popover-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tag-list {
    display: flex;
    align-items: center;
    flex-wrap: wrap; // 自动换行
    gap: 8px; // 标签之间的间距
}

.tag-item {
    font-size: 16px;
    cursor: pointer;
}

.tag-icon-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 4px;
}

.tag-icon {
    width: 16px;
    height: 16px;
    object-fit: cover;
    vertical-align: middle;
}

.tag-label {
    vertical-align: middle;
}

.submit-time {
    color: #909399;
    font-size: 14px;
}

.copy-btn {
    width: 90px;
}
</style>
