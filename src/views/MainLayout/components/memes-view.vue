<template>
    <div class="memes-view">
        <div class="card-table">
            <div class="card" v-if="route.path === '/memes/AllBarrage'">
                <h4>按标签查看烂梗<el-popover :width="300">
                        <template #reference>
                            <el-icon size="16">
                                <Warning />
                            </el-icon>
                        </template>
                        为解决烂梗分栏不足和分类不清晰问题。<br>
                        <b>点击标签即可添加</b>
                    </el-popover>
                    <el-button link type="success" style="margin-left: 50%">投稿标签
                        <el-popover :width="300">
                            <template #reference>
                                <el-icon size="16">
                                    <QuestionFilled />
                                </el-icon>
                            </template>
                            <b>功能待完善(后续更新将添加)，请在上方(建议/提交)问卷投稿，sry。</b><br>
                            <b>审核巨严格，(重复，相似等)将不通过</b>
                        </el-popover>
                    </el-button>
                </h4>

                <div class="preset-tags-container">
                    <div class="preset-tags">
                        <el-tag round v-for="(tag, index) in presetTags" :key="index" closable
                            @close="removeTagFromPreset(tag)" @click="removeTagFromPreset(tag)"
                            style=" padding:15px; cursor: pointer;font-size: 16px;" type="primary">
                            {{ tag.label }}
                        </el-tag>
                    </div>
                </div>

                <!-- 已添加标签 -->
                <h4>包含标签
                    <el-popover >
                        <template #reference>
                            <el-icon size="16">
                                <Warning />
                            </el-icon>
                        </template>
                        <b>烂梗包含该标签</b>
                    </el-popover>
                </h4>

                <div class="added-tags">
                    <el-tag round v-for="(tag, index) in addedTags" :key="index" closable @click="removeTag(tag)"
                        @close="removeTag(tag)" style="padding:15px; cursor: pointer;font-size: 16px;" effect="dark">
                        {{ tag.label }}
                    </el-tag>
                </div>
            </div>
            <div class="top">
                <div class="submit-tips">想要补充更多烂梗？点击这里投稿→</div>
                <el-button type="primary" @click="handleSubmit">烂梗投稿</el-button>
                <el-button v-if="route.path === '/memes/AllBarrage'" class="btn-animate btn-animate__ball-collision"
                    color="#66CCFF" @click="sortMeme(1)">按复制次数排序</el-button>
            </div>

            <el-table class="main-table" :data="memeArr" stripe v-loading="loading" cell-class-name="hover-pointer" empty-text="该标签组合为空，期待投稿！"
                @row-click="copyMeme_countPlus1">
                <el-table-column align="center" width="60">
                    <template #default="scope">
                        <el-tag round effect="plain">{{ scope.row.id }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="content">
                    <template #default="scope">
                        <el-popover placement="top" :width="'auto'" trigger="hover" :visible="scope.row.popoverVisible">
                            <template #reference>
                                <div style="cursor: pointer;" @touchstart="handleTouchStart(scope.row)" @touchend="handleTouchEnd(scope.row)">
                                    <span class="barrage-text">{{ scope.row.content }}</span>
                                </div>
                            </template>
                            <template #default>
                                <div style="display: flex; align-items: center; flex-wrap: wrap;">
                                    <div v-for="(item, index) in getDictLabel(scope.row.tags)" :key="index"
                                        style="margin-right: 8px;">
                                        <el-tag round effect="dark" :style="{ fontSize: '16px', cursor: 'pointer' }">
                                            <img v-if="item.iconUrl" :src="item.iconUrl"
                                                style=" width: 16px; height: 16px; object-fit: cover;vertical-align: middle;" />
                                            {{ item.label }}
                                        </el-tag>
                                    </div>
                                </div>
                            </template>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- <el-table-column align="center" width="40">
                    <template #default="scope">
                        <LikeNum :likeCount="scope.row.likes" @click.stop="likeMeme_countPlus1(scope.row)"/>
                    </template>
                </el-table-column> -->
                <el-table-column align="center" width="100">
                    <template #default="scope">
                        <el-button type="primary" class="copy-btn" @click.stop="copyMeme_countPlus1(scope.row)">复制
                            🎈<flip-num :num="scope.row.copyCount" /></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-wrapper">
                <el-pagination v-if="!loading" background="red" layout="prev, pager, next, jumper"
                    :current-page="currentPage" :total="total" :pager-count="4" :page-size="pageSize"
                    @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <submission-dialog v-model="dialogFormVisible"></submission-dialog>
        <el-backtop :right="50" :bottom="50">UP</el-backtop>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MemeCategory } from '@/constants/backend';
import { getMemeList } from '@/apis/getMeme';
import { throttle } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy, limitedLike} from '@/utils/clipboard';
import { copyCountPlus1, likeCountPlus1, plus1Error ,likePlus1Error} from '@/apis/setMeme';
import { API } from '@/constants/backend';
import submissionDialog from '@/components/submission-dialog.vue';
import flipNum from '@/components/flip-num.vue';
import LikeNum from '@/components/like-num.vue';
import httpInstance from '@/apis/httpInstance';

const route = useRoute();
const router = useRouter();
/**
 * currentCategory可能为空，代表没匹配到路由对应分类。
 * 不过正常情况路由只有点击tab能改变，这时候都是能匹配到的，出现空只可能是用户自己瞎几把改url。
 * 所以我采取的方法是匹配不到就定位到404页。建议后面用currentCategory的地方都这么处理
 */
const currentCategory = computed(() => {
    //清空已选标签
    addedDictValues.value=[]
    return MemeCategory.find((item) => item.path === route.path);
});

const loading = ref(true);
const memeArr = ref<Meme[]>([]);
const total = ref(0);
const pageSize = 50;
const currentPage = ref(1);
const isSort = ref(false)
const dictData = ref([]);

// 预设标签
const presetTags = ref([]);

// 已添加标签
const addedTags = ref([]);

// 已添加标签的 dictValue 数组
const addedDictValues = ref([]);
async function refreshMeme(pageNum: number) {
    const category = currentCategory.value?.category;
    if (!category) {
        router.push('/404');
        return;
    }
    let res;
    console.log(addedDictValues.value.join(','));
    
    if (addedDictValues.value.length==0) {  //没选标签就加载全部烂梗
        res = await getMemeList(category, pageNum, pageSize);
    } else {
        res = await getMemeList(category, pageNum, pageSize, addedDictValues.value.join(','));
    }

    // if (!res) return;   //没有就是没有数据

    memeArr.value = res.memeArr;
    total.value = res.total;
    loading.value = false;
}
refreshMeme(1);

/** 
 * 排序功能
*/
async function sortMeme(pageNum: number) {
    getDict();
    httpInstance.get(API.GET_SORTED_ALL_MEME, {
        params: {
            pageNum: pageNum,
            pageSize: pageSize,
            tags: `${addedDictValues.value}`
        }
    }).then(res => {
        isSort.value = true
        memeArr.value = res.data.list.map((item) => {
            return {
                total: item.total,
                content: item.barrage,
                id: item.id,
                copyCount: +item.cnt,
                tags: item.tags,
            };
        });
    }).catch(err => {
        memeArr.value = [];
    })
}

watch(
    () => route.path,
    () => {
        console.log('当前页面path:', route.path);
        isSort.value = false
        currentPage.value = 1;
        loading.value = true;
        refreshMeme(1);
    }
);

const scrollToTop = () => {
    window.scrollTo({
        // top: document.documentElement.offsetHeight, //回到底部
        top: 0, //回到顶部
        behavior: 'smooth', //smooth 平滑；auto:瞬间
    });
};
const handlePageChange = (page: number) => {
    currentPage.value = page;
    scrollToTop();
    if (isSort.value == false) {
        refreshMeme(page);
    } else {
        sortMeme(page)
    }
};

// 2s节流。节流期间触发了就调第二个回调。表示2s内多次点击复制只取其中一次发请求给后台
const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);
//like复用copy
const likeMeme = throttle(copyToClipboard, limitedLike, 2000);

async function copyMeme_countPlus1(meme: Meme) {
    const memeText = meme.content;
    const res = copyMeme(memeText);
    if (!res || res === 'limitedSuccess') return;
    copySuccess();
    if (isSort.value == true) {
        if (await copyCountPlus1('allbarrage', meme.id, currentPage.value, pageSize, 'desc')) {
            await sortMeme(currentPage.value);
            return;
        }
    } else {
        if (await copyCountPlus1(meme.category, meme.id, currentPage.value, pageSize)) {
            await refreshMeme(currentPage.value);
            return;
        }
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
        await refreshMeme(currentPage.value);
        return;
    }
    likePlus1Error();
}
const dialogFormVisible = ref(false);

// 弹出投稿弹窗按钮
const handleSubmit = () => {
    dialogFormVisible.value = true;
};

const getDict = () => {
    httpInstance.get('/machine/dictList').then(res => {
        if (res.code === '200') {
            dictData.value = res.data;
            presetTags.value = res.data.map(item => ({
                label: item.dictLabel,
                value: item.dictValue
            }));
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


// 删除已添加标签
const removeTag = (tag) => {
    addedTags.value = addedTags.value.filter(t => t.value !== tag.value);
    addedDictValues.value = addedDictValues.value.filter(value => value !== tag.value);
    presetTags.value.push(tag);
    refreshMeme(1);
};

// 添加标签的点击事件
const removeTagFromPreset = (tag) => {
    // 当删除预设标签时，将其移到已添加标签
    if (!addedTags.value.some(t => t.value === tag.value)) {
        addedTags.value.push(tag);
        addedDictValues.value.push(tag.value);
        presetTags.value = presetTags.value.filter(t => t.value !== tag.value);
    }
    console.log(addedDictValues.value);
    refreshMeme(1);
};
//移动端的触摸展示
const handleTouchStart = (row: any) => {
    row.touchStartTime = Date.now();
};

const handleTouchEnd = (row: any) => {
    const touchEndTime = Date.now();
    if (touchEndTime - row.touchStartTime > 200) { //200ms 长按时长
        row.popoverVisible = true;
        setTimeout(()=>{
            row.popoverVisible=false
        },1500)
    }
};
</script>

<style scoped lang="scss">
/* 预设标签容器 */
.preset-tags-container {
    max-height: 100px;
    overflow-y: auto;
}

/* 预设标签按钮的样式 */
.preset-tags {
    display: flex;
    flex-wrap: wrap;
}

.preset-tags .el-tag {
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
}

::v-deep .preset-tags .el-tag__close {
    font-size: 30px;
    transform: rotate(45deg);
}

.added-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
}

.added-tags .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

.memes-view {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .card-table {
        width: 100%;
        max-width: 1400px;

        .top {
            display: flex;
            align-items: center;
            padding-top: 10px;
            padding-left: 10px;
            gap: 6px;
            background-color: #fff;

            .submit-tips {
                font-size: small;
                font-weight: bold;
            }

            .btn-animate {
                margin: 0;
                font-size: 16px;
                border: none;
                border-radius: 5px;
                background: #027efb;
                color: #fff;
                text-align: center;
            }

            @keyframes crissCrossLeft {
                0% {
                    left: -20px
                }

                50% {
                    left: 50%;
                    width: 20px;
                    height: 20px;
                }

                100% {
                    left: 50%;
                    width: 375px;
                    height: 375px;
                }
            }

            @keyframes crissCrossRight {
                0% {
                    right: -20px
                }

                50% {
                    right: 50%;
                    width: 20px;
                    height: 20px;
                }

                100% {
                    right: 50%;
                    width: 375px;
                    height: 375px;
                }
            }


            .btn-animate__ball-collision {
                position: relative;
                overflow: hidden;
                z-index: 1;

                &::before,
                &::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 20px;
                    height: 20px;
                    background-color: #90cf5b;
                    border-radius: 50%;
                    opacity: 0.5;
                    transition: all 0.6s;
                    z-index: -1;
                }

                &::before {
                    left: -20px;
                    transform: translate(-50%, -50%);
                }

                &::after {
                    right: -20px;
                    transform: translate(50%, -50%);
                }

                &:hover {
                    &::before {
                        opacity: 1;
                        animation: crissCrossLeft .8s both;
                    }

                    &::after {
                        opacity: 1;
                        animation: crissCrossRight .8s both;
                    }
                }
            }
        }

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

        .pagination-wrapper {
            display: flex;
            justify-content: center;
            margin-top: 16px;
            margin-bottom: 40px;
        }
    }
}

@media (min-width: 600px) {
    .main-table {
        font-size: large;
    }
}

@media (max-width: 601px) {
    .main-table {
        font-size: medium;
    }
}
</style>
