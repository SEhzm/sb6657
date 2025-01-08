<template>
    <div class="memes-view">
        <div class="card-table">
            <div class="top">
                <div class="submit-tips">想要补充更多烂梗？点击这里投稿→</div>
                <el-button type="primary" @click="handleSubmit">烂梗投稿</el-button>
                <el-button v-if="route.path === '/memes/AllBarrage'" class="btn-animate btn-animate__ball-collision"
                    color="#66CCFF" @click="sortMeme(1)">按复制次数排序</el-button>
            </div>

            <el-table class="main-table" :data="memeArr" stripe v-loading="loading" cell-class-name="hover-pointer"
                @row-click="copyMeme_countPlus1">
                <el-table-column align="center" width="60">
                    <template #default="scope">
                        <el-tag round effect="plain" >{{ scope.row.id }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="content">
                    <template #default="scope">
                        {{ scope.row.content }}
                    </template>
                </el-table-column>
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
import { copyToClipboard, copySuccess, limitedCopy } from '@/utils/clipboard';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';
import { API } from '@/constants/backend';
import submissionDialog from '@/components/submission-dialog.vue';
import flipNum from '@/components/flip-num.vue';
import httpInstance from '@/apis/httpInstance';
import { fa } from 'element-plus/es/locales.mjs';
const route = useRoute();
const router = useRouter();
/**
 * currentCategory可能为空，代表没匹配到路由对应分类。
 * 不过正常情况路由只有点击tab能改变，这时候都是能匹配到的，出现空只可能是用户自己瞎几把改url。
 * 所以我采取的方法是匹配不到就定位到404页。建议后面用currentCategory的地方都这么处理
 */
const currentCategory = computed(() => {
    return MemeCategory.find((item) => item.path === route.path);
});

const loading = ref(true);
const memeArr = ref<Meme[]>([]);
const total = ref(0);
const pageSize = 50;
const currentPage = ref(1);
const isSort = ref(false)

async function refreshMeme(pageNum: number) {
    const category = currentCategory.value?.category;
    if (!category) {
        router.push('/404');
        return;
    }
    const res = await getMemeList(category, pageNum, pageSize);
    if (!res) return;

    memeArr.value = res.memeArr;
    total.value = res.total;
    loading.value = false;
}
refreshMeme(1);

/** 
 * 排序功能
*/
async function sortMeme(pageNum: number) {
    httpInstance.get(API.GET_SORTED_ALL_MEME, {
        params: {
            pageNum: pageNum,
            pageSize: pageSize,
            order: 'desc'
        }
    }).then(res => {
        isSort.value = true
        memeArr.value = res.data.list.map((item) => {
            return {
                total: item.total,
                content: item.barrage,
                id: item.id,
                copyCount: +item.cnt,
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
        isSort.value=false
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

async function copyMeme_countPlus1(meme: Meme) {
    const memeText = meme.content;
    const res = copyMeme(memeText);
    if (!res || res === 'limitedSuccess') return;
    copySuccess();
    if (isSort.value == true) {
        if(await copyCountPlus1('allbarrage', meme.id, currentPage.value, pageSize,'desc')){
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

const dialogFormVisible = ref(false);

// 弹出投稿弹窗按钮
const handleSubmit = () => {
    dialogFormVisible.value = true;
};
</script>

<style scoped lang="scss">
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
