<template xmlns="http://www.w3.org/1999/html">
    <div class="boomouder">
        <img src="https://gcore.jsdelivr.net/gh/9WiSHao/AnythingStorage/img/6657boom.webp" alt="6657boom"
            class="boom6657">
    </div>
    <div class="home">
        <div class="card first-card">
            <div>
                <b>
                    <p class="announcement">
                        新增时光相册(可评论)，新增在线投稿弹幕。玩神照片可以在上方上传照片上传至相册。<b>锐意创新：<span style="color: blue;cursor: pointer;" @click="simulateClick">用户调研</span></b>
                    </p>
                </b>
            </div>
        </div>

        <div class="card second-card">
            <p>
                这是一个收集6657烂梗的网站:
                <span class="dgq63136">
                    <a href="https://sb6657.cn">sb6657.cn</a>
                </span>
                尽情欣赏你们的烂梗吧。
                <b>开放注册功能(内测)，可能会出现收不到邮件的情况。</b>
                
            </p>
        </div>

        <div class="card third-card">
            <div>
                <el-button type="primary" @click="getRandOne">点我随机一条弹幕</el-button>
                <el-table v-loading="loading" :data="data.tableData" class="barrage-table" @row-click="copyText">
                    <el-table-column prop="barrage">
                        <template #default="scope">
                            <el-popover placement="top" :width="'auto'" trigger="hover"
                                :visible="scope.row.popoverVisible">
                                <template #reference>
                                    <div style="cursor: pointer;" @touchstart="handleTouchStart(scope.row)"
                                        @touchend="handleTouchEnd(scope.row)">
                                        <span class="barrage-text">{{ scope.row.barrage }}</span>
                                    </div>
                                </template>
                                <template #default>
                                    <div style="display: flex; align-items: center; flex-wrap: wrap;">
                                        <div v-for="(item, index) in getDictLabel(scope.row.tags)" :key="index"
                                            style="margin-right: 8px;">
                                            <el-tag round effect="dark"
                                                :style="{ fontSize: '16px', cursor: 'pointer' }">
                                                <img v-if="item.iconUrl" :src="item.iconUrl"
                                                    style=" width: 22px; height: 22px; object-fit: cover;vertical-align: middle;" />
                                                <span style="vertical-align: middle;"> {{ item.label }}</span>
                                            </el-tag>
                                        </div>
                                    </div>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="" align="center" width="85">
                        <el-button type="primary">复制</el-button>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="card fourth-card">
            <div>
                <div style="display: flex;">
                    <el-input v-model="searchQuery" :placeholder="searchBarrageMeg" @keydown.enter="queryBarrage"
                        clearable class="search-input" @input="onSearchQueryChange">
                        <template #append>
                            <el-button type="primary" @click="queryBarrage">
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-input>
                    <el-checkbox v-model="SearchMaxPro" label="高级检索 >" @change="reSet" style="margin-left: 10px;" />
                </div>
                <div v-show="SearchMaxPro">
                    <div>
                        <span style="display: block;color: var(--el-text-color-secondary);font-size: 14px;">烂梗收集时间范围(可选)</span>
                        <el-date-picker v-model="submitTime" type="daterange" range-separator="到" value-format="YYYY-MM-DD" start-placeholder="起始" end-placeholder="结束" :disabled-date="disabledDate" />
                        <span style="display: block;color: var(--el-text-color-secondary);font-size: 14px;">烂梗包含标签(可选)</span>
                        <div class="added-tags">
                            <el-tag round v-for="(tag, index) in addedQueryTags" :key="index" closable
                                @click="removeQueryTag(tag)" @close="removeQueryTag(tag)"
                                style="padding:15px; cursor: pointer;font-size: 16px;" effect="dark">
                                {{ tag.label }}
                            </el-tag>
                        </div>
                    </div>
                    
                    <div class="preset-tags-container">
                        <div class="preset-tags">
                            <el-tag round v-for="(tag, index) in presetTags" :key="index" closable
                                @close="removeQueryTagFromPreset(tag)" @click="removeQueryTagFromPreset(tag)"
                                style=" padding:15px; cursor: pointer;font-size: 16px;" type="primary">
                                <img v-if="tag.iconUrl" :src="tag.iconUrl"
                                    style=" width: 22px; height: 22px; object-fit: cover;vertical-align: middle;" />
                                <span style="vertical-align: middle;"> {{ tag.label }}</span>
                            </el-tag>
                        </div>
                    </div>
                </div>
                <el-table v-loading="loading" v-if="isInput" :data="data.filteredItems" stripe @row-click="copyText"
                    :empty-text="emptyText" :cell-style="{ cursor: 'Pointer', fontSize: 'large' }">
                    <el-table-column prop="barrage">
                        <template #default="scope">
                            <el-popover placement="top" :width="'auto'" trigger="hover"
                                :popper-class="customPopoverClass">
                                <template #reference>
                                    <div style="cursor: pointer;">
                                        <span class="barrage-text">{{ scope.row.barrage }}</span>
                                    </div>
                                </template>
                                <template #default>
                                    <div style="display: flex; align-items: center; flex-wrap: wrap;">
                                        <div v-for="(item, index) in getDictLabel(scope.row.tags)" :key="index"
                                            style="margin-right: 8px;">
                                            <el-tag round effect="dark"
                                                :style="{ fontSize: '16px', cursor: 'pointer' }">
                                                <img v-if="item.iconUrl" :src="item.iconUrl"
                                                    style=" width: 22px; height: 22px; object-fit: cover;vertical-align: middle;" />
                                                <span style="vertical-align: middle;"> {{ item.label }}</span>
                                            </el-tag>
                                        </div>
                                    </div>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <el-table-column align="center" width="100">
                        <template #default="scope">
                            <el-button type="primary" class="copy-btn" @click.stop="copyMeme_countPlus1(scope.row)">复制
                                🎈<flip-num :num="scope.row.cnt" /></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="card fifth-card">
            <div>
                <span>可选标签<el-popover :width="300">
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
                </span>

                <div class="preset-tags-container">
                    <div class="preset-tags">
                        <el-tag round v-for="(tag, index) in presetTags" :key="index" closable
                            @close="removeTagFromPreset(tag)" @click="removeTagFromPreset(tag)"
                            style=" padding:15px; cursor: pointer;font-size: 16px;" type="primary">
                            <img v-if="tag.iconUrl" :src="tag.iconUrl"
                                style=" width: 22px; height: 22px; object-fit: cover;vertical-align: middle;" />
                            <span style="vertical-align: middle;"> {{ tag.label }}</span>
                        </el-tag>
                    </div>
                </div>

                <!-- 已添加标签 -->
                <span>已选标签
                    <el-popover :width="250">
                        <template #reference>
                            <el-icon size="16">
                                <Warning />
                            </el-icon>
                        </template>
                        <b>最少一个标签，最多五个标签。</b>
                    </el-popover>
                </span>

                <div class="added-tags">
                    <el-tag round v-for="(tag, index) in addedTags" :key="index" closable @click="removeTag(tag)"
                        @close="removeTag(tag)" style="padding:15px; cursor: pointer;font-size: 16px;" effect="dark">
                        {{ tag.label }}
                    </el-tag>
                </div>
                <el-input v-model="barrage" maxlength="255" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }"
                    show-word-limit type="textarea" placeholder=" 烂梗...."></el-input>
                <el-button class="saveBnt" type="primary" @click="saveBarrage">投稿</el-button>
            </div>
            <el-backtop :right="50" :bottom="50" />
        </div>
        <ChatRoom class="ChatRoom card"></ChatRoom>
        <div class="card sixth-card">
            友情链接 <a href="https://dgq63136.cn" target="_blank">dgq63136.cn</a>&nbsp;&nbsp;&nbsp;
            <a href="https://sb6657.cn/#/Starrysky" target="_blank">星空背景</a>
        </div>
        <div class="wordCloudDiv"><span style="background-color: white;border-radius: 25px;padding: 5px;">搜索词云<el-icon
                    size="20" style="cursor: pointer;animation: rotating 4s linear infinite reverse;"
                    @click="refreshWordCloud()">
                    <Refresh />
                </el-icon></span>
            <wordCloud ref="wordCloudRef"></wordCloud>
        </div>
    </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import httpInstance from "@/apis/httpInstance";
import { ElMessage, ElNotification } from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import autoExecPng from "@/assets/autoexec.vue";
import { throttle } from '@/utils/throttle';
import { copyToClipboard, copySuccess, limitedCopy} from '@/utils/clipboard';
import { copyCountPlus1, plus1Error } from '@/apis/setMeme';
import flipNum from '@/components/flip-num.vue';
import LikeNum from '@/components/like-num.vue';
import ChatRoom from '@/components/ChatRoom.vue';
import wordCloud from '@/components/wordCloud.vue';
import { API } from '@/constants/backend';
const customPopoverClass = 'custom-popover';

const simulateClick = () => {
  const diaochaButton = document.getElementById('diaocha');
  if (diaochaButton) {
    diaochaButton.click();
  } else {
    console.error('Element with id "diaocha" not found');
  }
};
const loading = ref(true)
const isInput = ref(false)
const emptyText = ref("数据为空")
const data = reactive({
    getRandOne: [],
    filteredItems: [],
    tableData: [],
    table: '',
    barrage: '',
})
const autoexec = () => {
    if (!sessionStorage.getItem("firstOpening")) {
        httpInstance.get("https://api.vvhan.com/api/visitor.info")
            .then(res => {
                const resData = res;
                localStorage.setItem("ip", res.ip)
                ElNotification({
                    icon: autoExecPng,
                    dangerouslyUseHTMLString: true,
                    title: '你好',
                    message: /* HTML */`
            <p>
                欢迎来自<b>${resData.location || '地球'}</b>的朋友<br/>  
                ${resData.system || '外星操作系统'} ${resData.browser || '牛逼浏览器'}<br/>
                IP: ${resData.ip || '地球'}
            </p>
            `,
                    offset: 50,
                    customClass: "myClass",
                    duration: 1000
                })
                sessionStorage.setItem("firstOpening", 1)
            })
    }
}

autoexec()


const dictData = ref([]);

const getDict = () => {
    httpInstance.get('/machine/dictList').then(res => {
        if (res.code === 200) {
            dictData.value = res.data;
            presetTags.value = res.data.map(item => ({
                iconUrl: item.iconUrl,
                label: item.dictLabel,
                value: item.dictValue
            }));
        }
    }).catch(err => {
        console.error('获取字典数据失败', err);
    });
};
const getDictLabel = (tags) => {
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

const searchQuery = ref('');
//高级检索
const SearchMaxPro = ref(false)
//投稿时间范围
const submitTime = ref([])

const barrage = ref('');
// 所有预设标签
const presetTags = ref([]);

// 已添加投稿标签
const addedTags = ref([]);

// 已添加搜索标签
const addedQueryTags = ref([]);

// 已添加的投稿标签数组
const addedDictValues = ref([]);

// 已添加的高级搜索标签数组
const queryDictValues = ref([]);
// 删除已添加投稿标签
const removeTag = (tag) => {
    addedTags.value = addedTags.value.filter(t => t.value !== tag.value);
    addedDictValues.value = addedDictValues.value.filter(value => value !== tag.value);
    presetTags.value.push(tag);
};

// 添加投稿标签的点击事件
const removeTagFromPreset = (tag) => {
    if (addedDictValues.value.length >= 5) {
        ElNotification.info("最多5个标签")
        return
    }
    // 当删除预设标签时，将其移到已添加标签
    if (!addedTags.value.some(t => t.value === tag.value)) {
        addedTags.value.push(tag);
        addedDictValues.value.push(tag.value);
        presetTags.value = presetTags.value.filter(t => t.value !== tag.value);
    }
};

const saveBarrage = () => {
    if (addedDictValues.value.length === 0 || barrage.value === '' || barrage.value === null) {
        ElNotification.error("请选择标签或输入弹幕");
    } else {
        if (addedDictValues.value.length > 5) {
            ElNotification.error('最少一个标签，最多五个标签。');
            return;
        }
        httpInstance.post(API.SUBMIT_MEME, {
            tags: addedDictValues.value.join(','),
            barrage: barrage.value
        }).then(res => {
            barrage.value = '';
            if (res.code === 200) {
                ElNotification.success("投稿成功，待审核(一天内)");
            } else if (res.code === 500) {
                ElNotification.error("烂梗已经有了，勿重复提交")
            }
            else {
                ElNotification.error("请求失败");
            }
        }).catch(err => {
            console.error('投稿失败', err);
            ElNotification.error("请求失败");
        });
    }
};

// 删除已添加搜索标签
const removeQueryTag = (tag) => {
    addedQueryTags.value = addedQueryTags.value.filter(t => t.value !== tag.value);
    queryDictValues.value = queryDictValues.value.filter(value => value !== tag.value);
    presetTags.value.push(tag);
};

// 添加搜索标签的点击事件
const removeQueryTagFromPreset = (tag) => {
    if (queryDictValues.value.length >= 5) {
        ElNotification.info("最多5个标签")
        return
    }
    // 当删除预设标签时，将其移到已添加标签
    if (!addedQueryTags.value.some(t => t.value === tag.value)) {
        addedQueryTags.value.push(tag);
        queryDictValues.value.push(tag.value);
        presetTags.value = presetTags.value.filter(t => t.value !== tag.value);
    }
};
function reSet() {
    submitTime.value=[];
    while (addedQueryTags.value.length > 0) {
        removeQueryTag(addedQueryTags.value[0]);
    }
}
//限制开始时间为系统收集开始时间2024-09-25
const disabledDate = (time) => {
    return time.getTime() < new Date('2024-09-24').getTime();
};
//搜索
const queryBarrage = () => {
    // console.log(submitTime.value)
    if(searchQuery==null||searchQuery.value==""){
        emptyText.value="请输入搜索词..."
    }
    httpInstance.post(API.SEARCH_MEME, {
        tags: queryDictValues.value.join(','),
        barrage: searchQuery.value,
        submitTime: submitTime.value
    }).then(res => {
        isInput.value = true;
        loading.value = false;
        data.filteredItems = res.data || [];
    })
}


var searchBarrageMeg = ref('搜索烂梗...');


const getRandOne = () => {
    httpInstance.get(API.GET_RAND_ONE_MEME)
        .then(res => {
            data.tableData = [res.data];
            // console.log(res)
            loading.value = false;
        }).catch(err => {
            console.error("随机失败")
        })
}
getRandOne();


const open2 = () => {
    ElMessage({
        message: '复制成功',
        type: 'success',
    })
};

const open4 = () => {
    ElMessage({
        message: '复制失败，请检查浏览器是否禁用navigator.clipboard对象或手动复制,请勿使用夸克浏览器',
        type: 'error',
    })
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
        console.log(mousePositionCnt)
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
        console.log('内容已复制到剪贴板');
        httpInstance.get('/machine/addCnt/'+`${row.id}`).then(() => {
            //setTimeout(() => load(data.currentPage), 50); // 50 毫秒后执行 load
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

const onSearchQueryChange = () => {
    data.filteredItems = [];
    isInput.value = false;
};
//移动端的触摸展示
const handleTouchStart = (row) => {
    row.touchStartTime = Date.now();
};

const handleTouchEnd = (row) => {
    const touchEndTime = Date.now();
    if (touchEndTime - row.touchStartTime > 200) { //200ms 长按时长
        row.popoverVisible = true;
        setTimeout(()=>{
            row.popoverVisible=false
        },1500)
    }
};
// 2s节流。节流期间触发了就调第二个回调。表示2s内多次点击复制只取其中一次发请求给后台
const copyMeme = throttle(copyToClipboard, limitedCopy, 2000);


async function copyMeme_countPlus1(meme) {
    const memeText = meme.barrage;
    const res = copyMeme(memeText);
    if (!res || res === 'limitedSuccess') return;
    httpInstance.get(API.INCREASE_COPY_COUNT+`/` +meme.id)
    copySuccess();
    queryBarrage();
    return;
    plus1Error();
}
const wordCloudRef = ref(null);

function refreshWordCloud() {
    if (wordCloudRef.value) {
        wordCloudRef.value.getData();
    }
}
</script>

<style scoped lang="scss">
/* 预设标签容器 */
.preset-tags-container {
    max-height: 75px;
    overflow-y: auto;
    margin-top: 10px;
    margin-bottom: 20px;
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
}

.added-tags .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

.custom-popover {
    background-color: #f0f9eb; // 自定义背景色
    border: 1px solid #e1f3d8; // 自定义边框颜色
    border-radius: 4px; // 自定义边框圆角
    padding: 10px; // 自定义内边距
}

.boomouder {
    height: 150px;
    .boom6657 {
        left: calc(50vw - 153px);
        position: absolute;
        height: 150px;
        border-radius: 10px;
    }
}

.home {
    height: auto;
    width: 80%;

    .card {
        line-height: 25px;

        &.first-card {
            margin-top: 10px;
        }

        &.second-card {
            margin-top: 8px;
        }

        &.third-card {
            line-height: 0px;
            margin-top: 8px;
        }

        &.fourth-card {
            
            margin-top: 10px; 
            margin-bottom: 0px;
        }

        &.fifth-card {
            margin-top: 8px;

            .saveBnt {
                margin-left: 40%;
                width: 100px;
                margin-top: 10px;
            }
        }

        &.sixth-card {
            margin-top: 10px;
        }
    }

    .announcement {
        font-size: 14px;
    }

    .announcement-highlight {
        font-size: 18px;
        color: red;

        a {
            color: red;
        }
    }

    .barrage-table {
        font-family: 微软雅黑;
        font-size: 20px;
        cursor: pointer;

        ::v-deep(.el-table__header-wrapper) {
            font-size: 14px;
            white-space: normal !important;
        }
    }

    .search-input {
        font-size: 16px;
    }

    .submit-button {
        font-size: 20px;
    }

    .dgq63136 {
        font-size: 23px;
        font-weight: bold;

        a {
            color: red;
        }
    }
    
}

@media (min-width: 601px) {
    .home{
        .wordCloudDiv{
            position: fixed;
            bottom: 10px;
            right: 10px;
        }
    }
    .ChatRoom {
        display: none;
    }

    .AnnualHotList {
        display: none;
    }
}

@media(max-width :600px) {
    .AnnualHotList {
        margin-bottom: 20px;
    }

    .boomouder {
        height: 150px;

        .boom6657 {
            position: absolute;
            border-radius: 10px;
            width: 192px;
            height: 108px;
            left: 25%;
        }
    }

    .home {
        width: 100%;

        .wordCloudDiv{
            margin-top: 10px;
        }
    }

    .ChatRoom {
        margin: 10px 0;
    }
}
</style>