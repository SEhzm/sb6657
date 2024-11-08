<template>
    <div>
        <div class="cardTable" style="position: relative">
            <el-button type="primary" class="handleAdd" @click="handleAdd">投稿弹幕</el-button>

            <el-table v-loading="loading" stripe :data="data.tableData" empty-text="我还没有加载完喔~~" class="eldtable"
                :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
                :cell-style="{ cursor: 'Pointer' }" @row-click="copyText">
                <el-table-column width="58" prop="id" label="序号"></el-table-column>
                <el-table-column prop="barrage" min-width="90" label="弹幕" />
                <el-table-column label="" align="center" width="85">
                    <el-button type="primary" label="操作">复制</el-button>
                </el-table-column>
                <el-table-column prop="cnt" label="复制次数" width="55" />
            </el-table>
        </div>

        <div class="pagination-wrapper">
            <!-- 分页 -->
            <div>
                <el-pagination background="red" layout="prev, pager, next, jumper" :current-page="data.currentPage"
                    :total="data.total" :pager-count="4" :page-size="data.pageSize"
                    @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <el-dialog v-model="data.dialogFormVisible" draggable title="投稿弹幕" width="82%">
            <el-form :model="data" label-width="100px" :rules="rules" label-position="right">
                <el-form-item label="分栏" :label-width="100" prop="table">
                    <el-select v-model="data.table" placeholder="选择上传的分栏">
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
                    <el-input maxlength="255" v-model="data.barrage" autocomplete="off"
                        :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit type="textarea" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="data.dialogFormVisible = false">关闭</el-button>
                    <el-button type="primary" @click="saveBarrage(1)">投稿并关闭</el-button>
                    <el-button type="primary" @click="saveBarrage(2)">连续投稿</el-button>
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
import { useRoute } from 'vue-router';
import { MemeCategory } from '@/constants/backend';

const route = useRoute();

const currentCategory = computed(() => {
    return MemeCategory.find((item) => item.path === route.path);
});

const loading = ref(true);

const rules = {
    table: [{ required: true, message: '请选择分栏', trigger: 'blur' }],
    barrage: [{ required: true, message: '请输入弹幕', trigger: 'blur' }],
};

const data = reactive({
    tableData: [],
    total: 0,
    pageSize: 50, //每页个数
    currentPage: 1, //起始页码
    dialogFormVisible: false,
    table: '',
    barrage: '',
});

const load = (pageNum = 1) => {
    httpInstance
        .get(currentCategory.value!.api!, {
            params: {
                pageNum: pageNum,
                pageSize: data.pageSize,
            },
        })
        .then((res) => {
            data.tableData = res.data?.list || [];
            data.total = res.data?.total || 0;
            loading.value = false;
        })
        .catch((err) => {
            console.error('加载数据失败:', err);
        });
};

load(data.currentPage);

watch(
    () => route.path,
    () => {
        data.currentPage = 1;
        loading.value = true;
        load(1);
    }
);

const scrollToTop = () => {
    window.scrollTo({
        // top: document.documentElement.offsetHeight, //回到底部
        top: 0, //回到顶部
        behavior: 'smooth', //smooth 平滑；auto:瞬间
    });
};
const handlePageChange = (page) => {
    data.currentPage = page;
    scrollToTop();
    load(page);
};

const open2 = () => {
    ElNotification({
        message: '复制成功',
        type: 'success',
    });
};

const open4 = () => {
    ElNotification({
        message: '复制失败',
        type: 'error',
    });
};

let lastCallTime = 0;
let lastMousePosition = null;
let mousePositionCnt = 0;
const copyText = (row) => {
    const currentTime = new Date().getTime();
    const currentMousePosition = { x: event.clientX, y: event.clientY };
    // 检查鼠标位置是否变化
    if (lastMousePosition && lastMousePosition.x === currentMousePosition.x && lastMousePosition.y === currentMousePosition.y) {
        mousePositionCnt++;
        if (mousePositionCnt > 4) {
            ElMessageBox.alert('😡😡😡你在刷次数😡😡😡', '请勿使用连点器', {
                confirmButtonText: '好吧，我错了',
            });
        }
    } else {
        mousePositionCnt = 0;
    }
    // 检查是否已经过了 1.5 秒
    if (currentTime - lastCallTime < 1500) {
        ElNotification({
            title: '请勿刷次数',
            message: '复制成功，但次数没有增加',
            type: 'warning',
        });
        const textToCopy = row.barrage;
        let tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select(); // 选择对象
        try {
            document.execCommand('Copy'); // 执行浏览器复制命令
        } catch (err) {
            // 复制失败，可以显示错误信息
            ElNotification({
                title: '复制失败',
                message: '复制操作失败，请稍后重试',
                type: 'error',
            });
            console.error('复制失败:', err);
        }
        document.body.removeChild(tempInput); // 清理临时元素
        lastCallTime = currentTime;
        lastMousePosition = currentMousePosition;
        return;
    }
    lastMousePosition = currentMousePosition;
    lastCallTime = currentTime;
    const textToCopy = row.barrage;
    let tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select(); // 选择对象
    try {
        document.execCommand('Copy'); // 执行浏览器复制命令
        // 复制成功，可以显示提示信息
        open2();
        console.log('内容已复制到剪贴板', currentCategory);
        httpInstance
            .post('/machine/addCnt', {
                PageNum: data.currentPage,
                PageSize: data.pageSize,
                table: currentCategory.value?.category,
                id: row.id,
            })
            .then((res) => {
                setTimeout(() => load(data.currentPage), 200);
            });
    } catch (err) {
        // 复制失败，可以显示错误信息
        ElNotification({
            title: '复制失败',
            message: '复制操作失败，请稍后重试',
            type: 'error',
        });
        console.error('复制失败:', err);
        open4();
    }
    document.body.removeChild(tempInput); // 清理临时元素
};

//点击新增按钮
const handleAdd = () => {
    data.table = '';
    data.barrage = '';
    data.dialogFormVisible = true;
};
/**
 * 提交投稿
 * continuous：是否连续提交 1：非连续  2：连续
 */
const saveBarrage = (continuous: Number) => {
    if (data.table === '' || data.barrage === '') {
        ElNotification.error('请选择分栏或输入弹幕');
    } else {
        httpInstance
            .post('/machine/addUnaudit', {
                table: data.table,
                barrage: data.barrage,
            })
            .then((res) => {
                load();
                if (continuous === 1) {//1：非连续投稿  关闭弹窗
                    data.dialogFormVisible = false;
                }
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

    .dialogFormVisible {
        font-size: 15px;
    }

    .handleAdd {
        z-index: 100;
        position: absolute;
        font-size: 13px;
        margin-left: 100px;
    }
}
</style>
