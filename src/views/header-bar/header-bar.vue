<template>
    <div class="header">
        <div style="flex: 1">
            <div class="header-content">
                <a href="https://www.douyu.com/6657" target="_blank" class="logo-link">
                    <img src="/public/favicon.ico" alt="大狗头" class="logo-img" />
                    <p class="header-title">斗鱼玩机器烂梗收集</p>
                </a>

                <div class="header-actions">
                    <img src="@/assets/imgs/hot.png" alt="热门"
                        style="width: 24px;height: 24px;cursor:pointer;margin-right: 10px" class="hotBarrageImg"
                        @click="hotDialog = true" />
                    <div @click="hotDialog = true" class="hotBarrage"
                        style="cursor:pointer;width:300px;overflow: hidden; text-overflow: ellipsis;color: #e4d6b8;white-space: nowrap;">
                        <transition name="fade">
                            <span :key="currentBarrageIndex" class="hotBarrageSpan">
                                热门：{{ data.hotBarrageOf10[currentBarrageIndex]?.barrage }}
                            </span>
                        </transition>
                    </div>

                    <div style="margin-right: 20px;" class="elinput">
                        <el-input v-model="searchQuery" placeholder="搜索烂梗" clearable style=""
                            @input="onSearchQueryChange">
                            <template #append>
                                <el-button type="primary" @click="queryBarrage"><el-icon>
                                        <Search />
                                    </el-icon></el-button>
                            </template>
                        </el-input>
                    </div>

                    <el-button type="primary" @click="complaintButton" class="complaint-button">
                        <span>
                            上传照片
                            <br />建议/提交BUG
                        </span>
                    </el-button>
                    <a href="https://sb6657.cn/#/Tampermonkey">
                        <img src="https://pic.imgdb.cn/item/6704f830d29ded1a8c738f70.png" alt="gitee"
                            class="icon-img" />
                    </a>
                    <a href="https://gitee.com/hzming1/sb6657" target="_blank">
                        <img src="@/assets/imgs/gitee.png" alt="gitee" class="icon-img" />
                    </a>
                    <a href="https://yuba.douyu.com/feed/2639094748291342931" target="_blank">
                        <img src="@/assets/imgs/douyu.png" alt="douyu" class="icon-img" />
                    </a>
                    <a href="https://github.com/SEhzm/sb6657/" target="_blank">
                        <img src="@/assets/imgs/github.png" alt="github" class="icon-img" />
                    </a>
                    <el-image id="myDiv" class="icon-img-rounded" :src="url" :hide-on-click-modal="true"
                        :zoom-rate="1.2" :max-scale="7" lazy :min-scale="0.2"
                        :preview-src-list="['http://cdn.dgq63136.icu/zfb.jpg']" :initial-index="4" fit="cover" />
                    <el-image class="icon-img-rounded" :src="wxurl" :hide-on-click-modal="true" :zoom-rate="1.2" lazy
                        :max-scale="7" :min-scale="0.2" :preview-src-list="['http://cdn.dgq63136.icu/wx.jpg']"
                        :initial-index="4" fit="cover" />
                </div>
            </div>

            <!-- 24h热门弹幕弹出框 -->
            <el-dialog v-model="hotDialog" title="24h热门烂梗" style="width: 100%;">
                <template #title>
                    <span>24h热门烂梗</span>
                    <el-button style="float: right;" @click="openHotDialogOf7day">查看近七天热门</el-button>
                </template>
                <el-table v-loading="loading" stripe :data="data.hotBarrageOf10" empty-text="我还没有加载完喔~~"
                    class="eldtable"
                    :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
                    :cell-style="{ cursor: 'Pointer' }" @row-click="copyText">
                    <el-table-column width="45" fixed prop label="top10">
                        <template #default="scope">{{ scope.$index + 1 }}</template>
                    </el-table-column>
                    <el-table-column prop="barrage" min-width="90" label="烂梗" />
                    <el-table-column label align="center" width="85">
                        <el-button type="primary" label="操作">复制</el-button>
                    </el-table-column>
                    <el-table-column prop="cnt" label="复制次数" width="55">
                        <template #default="scope">{{ scope.row.cnt }}</template>
                    </el-table-column>
                </el-table>
            </el-dialog>

            <!-- 七天热门弹幕弹出框 -->
            <el-dialog v-model="hotDialogOf7day" title="七天热门烂梗" style="width: 100%;">
                <el-table v-loading="loading" stripe :data="data.hotBarrageOf7day" empty-text="我还没有加载完喔~~"
                    class="eldtable"
                    :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
                    :cell-style="{ cursor: 'Pointer' }" @row-click="copyText">
                    <el-table-column width="35" fixed prop label="排名">
                        <template #default="scope">{{ scope.$index + 1 }}</template>
                    </el-table-column>
                    <el-table-column prop="barrage" min-width="90" label="烂梗" />
                    <el-table-column label align="center" width="85">
                        <el-button type="primary" label="操作">复制</el-button>
                    </el-table-column>
                    <el-table-column prop="cnt" label="复制次数" width="55">
                        <template #default="scope">{{ scope.row.cnt }}</template>
                    </el-table-column>
                </el-table>
            </el-dialog>

            <div class="QueryTable" v-if="isInput">
                <el-button class="close-button" @click="closeQueryTable"><svg t="1725098483582" class="icon"
                        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4538" width="16"
                        height="16">
                        <path d="M0 0h1024v1024H0z" fill="#FF0033" fill-opacity="0" p-id="4539"></path>
                        <path
                            d="M240.448 168l2.346667 2.154667 289.92 289.941333 279.253333-279.253333a42.666667 42.666667 0 0 1 62.506667 58.026666l-2.133334 2.346667-279.296 279.210667 279.274667 279.253333a42.666667 42.666667 0 0 1-58.005333 62.528l-2.346667-2.176-279.253333-279.253333-289.92 289.962666a42.666667 42.666667 0 0 1-62.506667-58.005333l2.154667-2.346667 289.941333-289.962666-289.92-289.92a42.666667 42.666667 0 0 1 57.984-62.506667z"
                            fill="#111111" p-id="4540"></path>
                    </svg></el-button>
                <el-table v-loading="loading" :data="data.filteredItems" stripe @row-click="copyToQueryTableText"
                    style="cursor:pointer" empty-text="可能没有这条烂梗或请手动刷新页面">
                    <el-table-column prop="barrage" label="弹幕"></el-table-column>
                    <el-table-column label align="center" width="85">
                        <el-button type="primary">复制</el-button>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, } from "vue";
import httpInstance from "@/apis/httpInstance";
import { ElMessage, ElNotification } from "element-plus";
const hotDialog = ref(false);
const hotDialogOf7day = ref(false);
const loading = ref(true);


const searchQuery = ref("");
const isInput = ref(false)
const data = reactive({
    filteredItems: [],
    tableData: [],
    table: "",
    barrage: "",
    hotBarrageOf10: [],
    hotBarrageOf7day: [],
});

//搜索
const queryBarrage = () => {
    console.log(searchQuery.value)
    httpInstance.post('/machine/Query', {
        QueryBarrage: searchQuery.value
    }).then(res => {
        isInput.value = true;
        loading.value = false;
        data.filteredItems = res.data || [];
    })
}

const hotBarrageOf10 = () => {
    httpInstance
        .get("/machine/hotBarrageOfAll")
        .then((res) => {
            data.hotBarrageOf10 = res.data.slice(0, 10) || [];
            // console.log(data.hotBarrageOf10)
            loading.value = false;
        })
        .catch((err) => {
            console.error("加载数据失败:", err);
        });
};
hotBarrageOf10();
const hotBarrageOf7 = () => {
    httpInstance
        .get("/machine/hotBarrageOf7Day")
        .then((res) => {
            loading.value = false;
            data.hotBarrageOf7day = res.data || [];
        })
        .catch((err) => {
            console.error("加载数据失败:", err);
        });
};
const openHotDialogOf7day = () => {
    hotDialog.value = false;
    hotDialogOf7day.value = true;
    hotBarrageOf7();
}

const currentBarrageIndex = ref(0);
let intervalId;

// 开始切换
function startSwitching() {
    intervalId = setInterval(() => {
        currentBarrageIndex.value =
            (currentBarrageIndex.value + 1) % data.hotBarrageOf10.length;
    }, 5000); // 每五秒切换一次
}

// 在组件挂载时启动定时器
onMounted(() => {
    startSwitching();
});

// 在组件销毁前清除定时器
onUnmounted(() => {
    clearInterval(intervalId);
});

// 过滤搜索结果
const open2 = () => {
    ElMessage({
        message: "复制成功",
        type: "success",
    });
};

const open4 = () => {
    ElMessage({
        message:
            "复制失败，请检查浏览器是否禁用navigator.clipboard对象或手动复制,请勿使用夸克浏览器",
        type: "error",
    });
};

//复制搜索结果方法
let lastCallTime = 0;
let lastMousePosition = null;
let mousePositionCnt = 0;
const copyToQueryTableText = (row) => {
    const currentTime = new Date().getTime();
    const currentMousePosition = { x: event.clientX, y: event.clientY };
    if (lastMousePosition && lastMousePosition.x === currentMousePosition.x && lastMousePosition.y === currentMousePosition.y) {
        mousePositionCnt++;
        if (mousePositionCnt > 4) {
            ElMessageBox.alert('😡😡😡你在刷次数😡😡😡', '请勿使用连点器', {
                confirmButtonText: '好吧，我错了',
            })
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
        console.log('内容已复制到剪贴板');
        httpInstance.post("/machine/addCnt", {
            table: 'allbarrage',
            id: row.id,
        });
        setTimeout(() => hotBarrageOf10(), 200); // 200 毫秒后执行 hotBarrageOf10
        setTimeout(() => hotBarrageOf7(), 200); // 200 毫秒后执行 hotBarrageOf10

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

// 复制热门弹幕方法
const copyText = (row) => {
    const currentTime = new Date().getTime();
    // 检查是否已经过了 1.5 秒
    const currentMousePosition = { x: event.clientX, y: event.clientY };
    if (lastMousePosition && lastMousePosition.x === currentMousePosition.x && lastMousePosition.y === currentMousePosition.y) {
        mousePositionCnt++;
        console.log(mousePositionCnt)
        if (mousePositionCnt > 4) {
            ElMessageBox.alert('😡😡😡你在刷次数😡😡😡', '请勿使用连点器', {
                confirmButtonText: '好吧，我错了',
            })
        }
    }
    mousePositionCnt = 0;
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
        return;
    }
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
        console.log('内容已复制到剪贴板');
        httpInstance.post("/machine/addCnt", {
            table: row.tableName,
            id: row.barrageId,
        });
        setTimeout(() => hotBarrageOf10(), 200); // 200 毫秒后执行 hotBarrageOf10
        setTimeout(() => hotBarrageOf7(), 200); // 200 毫秒后执行 hotBarrageOf10

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

//定时一小时弹出支持我！！！
setTimeout(function () {
    const myDiv = document.getElementById("myDiv");
    if (myDiv) {
        const e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        myDiv.dispatchEvent(e);
    }

}, 60 * 60 * 1000); // 一小时
//上传按钮
const complaintButton = () => {
    window.open("https://www.wjx.cn/vm/rQUgnS0.aspx#");
};
const onSearchQueryChange = () => {
    data.filteredItems = [];
    isInput.value = false;
};

const closeQueryTable = () => {
    searchQuery.value = '';
    isInput.value = false;
};

const url = "https://pic.imgdb.cn/item/66992905d9c307b7e9f0136e.png";
const wxurl = "https://pic.imgdb.cn/item/66dd952dd9c307b7e9321a73.png";
</script>

<style scoped lang="scss">
.close-button {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
    border: none;
}

@media (min-width: 601px) {
    .el-dialog {
        --el-dialog-width: 50%;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .hotBarrageSpan {
        color: #e4d6b8;
        border-bottom: 1px solid #e4d6b8;
        padding-bottom: 1px;
    }

    .QueryTable {
        padding: 20px;
        z-index: 100;
        position: absolute;
        width: 500px;
        background-color: white;
        border-radius: 10px;
        right: 265px;
        box-shadow: 0px 0px 35px rgb(37, 19, 19);
    }

    .elinput {
        .el-input__wrapper {
            border-radius: 95px;
            border: 0;
            box-shadow: 0 0 0 0px;
        }
    }

    .header {
        height: 55px;
        display: flex;
        align-items: center;
        width: 100%;
        z-index: 1000;
    }

    .header-content {
        padding-left: 20px;
        display: flex;
        align-items: center;
    }

    .logo-link {
        display: block;
        width: 370px;
        height: 50px;
    }

    .logo-img {
        height: 40px;
        float: left;
        margin: 5px;
        border-radius: 5px;
    }

    .header-title {
        color: #ff552e;
        font-size: 30px;
        align-items: center;
    }

    .header-actions {
        display: flex;
        justify-content: flex-end;
        margin-left: auto;
    }

    .complaint-button {
        margin-right: 10px;
    }

    .icon-img {
        width: 31px;
        margin-right: 15px;
    }

    .icon-img-rounded {
        width: 31px;
        height: 31px;
        margin-right: 15px;
        border-radius: 5px;
    }
}

@media (max-width: 600px) {
    .hotBarrageSpan {
        color: black;
        border-bottom: 1px solid black;
        padding-bottom: 1px;
    }

    .el-overlay-dialog {
        z-index: 3;
    }

    .hotBarrage {
        position: absolute;
        margin-top: 200px;
        left: 30px;
        z-index: 1;
        color: black;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.5s;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }

    .QueryTable {
        padding: 20px;
        z-index: 1000;
        position: absolute;
        width: 100%;
        background-color: white;
        border-radius: 10px;
        right: 0px;
        box-shadow: 0px 0px 35px rgb(37, 19, 19);
    }

    .eldtable {
        width: 100% !important;
    }

    .elinput {
        .el-input__wrapper {
            border-radius: 95px;
            border: 0;
            box-shadow: 0 0 0 0px;
        }
    }

    .icon-img-rounded {
        margin-top: 5px;
        width: 22px;
        height: 20px;
        border-radius: 5px;
        margin-right: 5px;
    }

    .complaint-button {
        width: 80px;
        height: 30px;
        font-size: 11px;
        margin-right: 5px;
    }

    .icon-img {
        margin-top: 5px;
        height: 20px;
        width: 20px;
        margin-right: 5px;
    }

    .header {
        background-color: #fff;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ddd;
    }
}
</style>