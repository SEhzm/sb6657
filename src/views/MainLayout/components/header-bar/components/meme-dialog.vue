<template>
    <div>
        <el-dialog v-model="showDialog" class="dialog-main">
            <template #header>
                <slot></slot>
            </template>
            <el-table :data="memeArr" stripe v-loading="loading" :empty-text="emptyText" cell-class-name="hover-pointer" @row-click="copyMeme_countPlus1">
                <el-table-column align="center" width="60">
                    <template #default="scope">
                        <el-tag round effect="plain">{{ scope.$index + 1 }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="content">
                    <template #default="scope">
                            <el-popover placement="top" :width="'auto'" trigger="hover" >
                                <template #reference>
                                    <div style="cursor: pointer;">
                                        <span class="barrage-text">{{ scope.row.content }}</span>
                                    </div>
                                </template>
                                <template #default>
                                <div style="display: flex; align-items: center; flex-wrap: wrap;">
                                    <div v-for="(item, index) in getDictLabel(scope.row.tags)" :key="index" style="margin-right: 8px;">
                                        <el-tag round effect="dark"
                                            :style="{ fontSize: '16px', cursor: 'pointer' }">
                                            <img v-if="item.iconUrl" :src="item.iconUrl" style=" width: 16px; height: 16px; object-fit: cover;vertical-align: middle;" />
                                            {{ item.label }}
                                        </el-tag>
                                    </div>
                                </div>
                            </template>
                            </el-popover>
                        </template>
                </el-table-column>
                <!-- <el-table-column align="center" width="100">
                    <template #default="scope">
                        <el-button type="primary" class="copy-btn" @click.stop="likeMeme_countPlus1(scope.row)">点赞👍(<flip-num :num="scope.row.likes" />)</el-button>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" width="100">
                    <template #default="scope">
                        <el-button type="primary" class="copy-btn" @click.stop="copyMeme_countPlus1(scope.row)">复制 (<flip-num :num="scope.row.copyCount" />)</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { throttle } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy } from '@/utils/clipboard';
import { copyCountPlus1, likeCountPlus1, plus1Error ,likePlus1Error} from '@/apis/setMeme';
import flipNum from '@/components/flip-num.vue';
import httpInstance from '@/apis/httpInstance';
import { ref } from 'vue';

/**
 * 组件输入:
 * 1.插槽，弹窗头部的内容。主要是描述，标题，切换其他弹窗按钮之类的。(注意，我把对话框的title删了，因为插槽放在header，设置插槽就行，会覆盖title)
 * 2.v-model，控制提示框的展示与否。注意这是个v-model，父组件要用v-model绑定。vue3.4新增的语法
 * 3.memeArr，烂梗数组
 * 4.loading，是否加载中
 * 5.emptyText，加载中或者搜索为空时候的提示词
 * 6.refresh，刷新函数，其实就是获取此烂梗的函数，这里复制完调用一次，刷新+1结果
 */
const showDialog = defineModel();
const props = defineProps<{
    memeArr: Meme[];
    loading: boolean;
    emptyText: string;
}>();
const emit = defineEmits<{
    refresh: [];
}>();

// 2s节流。节流期间触发了就调第二个回调。表示2s内多次点击复制只取其中一次发请求给后台
const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);
//like复用copy
const likeMeme = throttle(copyToClipboard, limitedCopy, 2000);

async function copyMeme_countPlus1(meme: Meme) {
    const memeText = meme.content;
    /**
     * 三种返回值情况
     * 1. false，代表错误了，用户没能正确复制到剪贴板
     *    由第一个回调函数copyToClipboard里自行捕获到错误并且出弹窗提醒
     * 2. 'limitedSuccess'，表示byd在连续点击，被节流函数制裁了
     *    由第二个回调函数limitedCopy里出弹窗提醒
     * 3. true，这是正常复制，自行处理，这里出个弹窗提醒并且向后端发请求让复制次数+1
     */
    const res = copyMeme(memeText);
    if (!res || res === 'limitedSuccess') return;
    copySuccess();
    if (await copyCountPlus1(meme.category, meme.id)) {
        emit('refresh');
        return;
    }
    plus1Error();
}
//like复用copy
async function likeMeme_countPlus1(meme: Meme) {
    const memeText = meme.content;
    /**
     * 三种返回值情况
     * 1. false，代表错误了，用户没能正确复制到剪贴板
     *    由第一个回调函数copyToClipboard里自行捕获到错误并且出弹窗提醒
     * 2. 'limitedSuccess'，表示byd在连续点击，被节流函数制裁了
     *    由第二个回调函数limitedCopy里出弹窗提醒
     * 3. true，这是正常复制，自行处理，这里出个弹窗提醒并且向后端发请求让复制次数+1
     */
    const res = likeMeme(memeText);
    if (!res || res === 'limitedSuccess') return;
    // copySuccess();
    if (await likeCountPlus1(meme.id)) {
        emit('refresh');
        return;
    }
    likePlus1Error();
}
const dictData = ref([]);

const getDict = () => {
    httpInstance.get('/machine/dictList').then(res => {
        if (res.code === '200') {
            dictData.value = res.data;
        }
    }).catch(err => {
        console.error('获取字典数据失败', err);
    });
};
const getDictLabel = (tags: string | null | undefined): { label: string; iconUrl: string }[] => {
    if (!tags || tags.trim() === '') {
        return [];
    }
    const tagList = Array.from(new Set(tags.split(',').map(tag => tag.trim())));
    if (!dictData.value) {
        return tagList.map(() => ({ label: '', iconUrl: '' }));
    }
    const dictMap = new Map(
        dictData.value.map(item => [String(item.dictValue).trim(), item])
    );
    const labels = tagList.map(tag => {
        const dictItem = dictMap.get(tag);
        return dictItem ? { label: dictItem.dictLabel, iconUrl: dictItem.iconUrl } : { label: '', iconUrl: '' };
    });

    return labels;
};
getDict()
</script>

<style scoped lang="scss">
// 坑：element-plus表格类样式，在开启scoped的style里，要用deep才能生效
:deep(.dialog-main) {
    width: 95%;
}

:deep(.hover-pointer) {
    cursor: pointer;
}

.index {
    font-size: large;
}

.copy-btn {
    width: 90px;
}
</style>
