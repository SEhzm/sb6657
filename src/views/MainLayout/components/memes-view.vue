<template>
    <div>
        <div class="cardTable" style="position: relative">
            <el-button type="primary" class="handleAdd" @click="handleAdd">投稿弹幕</el-button>

            <el-table v-loading="loading" stripe :data="memeArr" empty-text="我还没有加载完喔~~" class="eldtable" :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }" :cell-style="{ cursor: 'Pointer' }" @row-click="copyMeme_countPlus1">
                <el-table-column width="58" prop="id" label="序号"></el-table-column>
                <el-table-column prop="content" min-width="90" label="弹幕" />
                <el-table-column label="" align="center" width="85">
                    <el-button type="primary" label="操作">复制</el-button>
                </el-table-column>
                <el-table-column prop="copyCount" label="复制次数" width="55" />
            </el-table>
        </div>

        <div class="pagination-wrapper">
            <!-- 分页 -->
            <div>
                <el-pagination background="red" layout="prev, pager, next, jumper" :current-page="currentPage" :total="total" :pager-count="4" :page-size="pageSize" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <el-dialog v-model="dialogFormVisible" draggable title="投稿弹幕" width="82%">
            <el-form :model="inputMeme" label-width="100px" :rules="rules" label-position="right">
                <el-form-item label="分栏" :label-width="100" prop="table">
                    <el-select v-model="inputMeme.category" placeholder="选择上传的分栏">
                        <el-option label="喷玩机器篇" value="machine_penWJQ" />
                        <el-option label="木柜子篇" value="machine_mygo" />
                        <el-option label="直播间互喷篇" value="machine_ZbjHuPen" />
                        <el-option label="喷选手篇" value="machine_penPlayer" />
                        <el-option label="+1" value="machine_p1" />
                        <el-option label="群魔乱舞篇" value="machine_QMLW" />
                        <el-option label="QUQU" value="machine_QUQU" />
                    </el-select>
                </el-form-item>
                <el-form-item label="弹幕内容" prop="barrage">
                    <el-input maxlength="255" v-model="inputMeme.content" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit type="textarea" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">关闭</el-button>
                    <el-button type="primary" @click="saveBarrage">投稿并关闭</el-button>
                    <el-button type="primary" @click="continuousSaveBarrage">连续投稿</el-button>
                </div>
            </template>
        </el-dialog>
    </div>

    <el-backtop :right="50" :bottom="50">UP</el-backtop>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import httpInstance from '@/apis/httpInstance';
import { ElNotification } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { MemeCategory } from '@/constants/backend';
import { getMemeList } from '@/apis/getMeme';
import { throttle } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy } from '@/utils/clipboard';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';

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

watch(
    () => route.path,
    () => {
        console.log('当前页面path:', route.path);
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
    refreshMeme(page);
};

// 2s节流。节流期间触发了就调第二个回调。表示2s内多次点击复制只取其中一次发请求给后台
const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);

async function copyMeme_countPlus1(meme: Meme) {
    const memeText = meme.content;
    const res = copyMeme(memeText);
    if (!res || res === 'limitedSuccess') return;
    copySuccess();
    if (await copyCountPlus1(meme.category, meme.id, currentPage.value, pageSize)) {
        await refreshMeme(currentPage.value);
        return;
    }
    plus1Error();
}

const rules = {
    table: [{ required: true, message: '请选择分栏', trigger: 'blur' }],
    barrage: [{ required: true, message: '请输入弹幕', trigger: 'blur' }],
};
const dialogFormVisible = ref(false);
const inputMeme = reactive({
    category: '',
    content: '',
});
//点击新增按钮
const handleAdd = () => {
    inputMeme.category = '';
    inputMeme.content = '';
    dialogFormVisible.value = true;
};
//提交并关闭
const saveBarrage = () => {
    if (inputMeme.category === '' || inputMeme.content === '') {
        ElNotification.error('请选择分栏或输入弹幕');
    } else {
        httpInstance
            .post('/machine/addUnaudit', {
                table: inputMeme.category,
                barrage: inputMeme.content,
            })
            .then((res) => {
                refreshMeme(1);
                dialogFormVisible.value = false;
                if (res.code === '200') {
                    ElNotification.success('投稿成功，待审核(一天内)');
                } else {
                    ElNotification.error('请求失败');
                }
            });
    }
};

//连续提交
const continuousSaveBarrage = () => {
    if (inputMeme.category === '' || inputMeme.content === '') {
        ElNotification.error('请选择分栏或输入弹幕');
    } else {
        httpInstance
            .post('/machine/addUnaudit', {
                table: inputMeme.category,
                barrage: inputMeme.content,
            })
            .then((res) => {
                refreshMeme(1);
                inputMeme.content = '';
                if (res.code === '200') {
                    ElNotification.success('投稿成功，待审核(一天内)');
                    data.barrage = '';
                } else {
                    ElNotification.error('投稿失败，必要时请及时反馈');
                }
            });
    }
};
</script>

<style scoped>
.eldtable {
    z-index: 3;
    font-size: 18px;
    white-space: nowrap;
    overflow-x: auto;
}

.pagination-wrapper {
    display: flex;
    margin-top: 20px;
}

.handleAdd {
    z-index: 100;
    position: absolute;
    font-size: 18px;
    margin-top: 4px;
    margin-left: 150px;
}

@media (min-width: 601px) {
    .cardTable {
        width: 80%;
    }
}

@media (max-width: 600px) {
    .el-pagination {
        margin: 0;
        --el-pagination-button-width: 22px;
    }

    .eldtable {
        font-size: 16px;
        white-space: nowrap;
        overflow-x: auto;
        cursor: cell;
    }

    .handleAdd {
        z-index: 100;
        position: absolute;
        font-size: 13px;
        margin-left: 100px;
    }
}
</style>
