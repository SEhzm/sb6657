<template>
    <div class="card pickHome">
        <div class="step">
            <span @click="handleOpen">
                <p class="context">2024年度TOP20烂梗评选🏆 <el-button link ><a href="https://cdn.dgq63136.icu/%E7%AC%AC%E4%B8%80%E8%BD%AEtop20%E6%8F%90%E5%90%8D%E7%BB%93%E6%9E%9C.xlsx">下载第一轮数据</a></el-button><el-button
                        link><a href="https://cdn.dgq63136.icu/%E7%AC%AC%E4%BA%8C%E8%BD%AEtop20%E6%8A%95%E7%A5%A8%E7%BB%93%E6%9E%9C.xlsx">下载第二轮</a></el-button><el-button link><a href="">下载第三轮</a></el-button>
                        <el-button @click="openTall" link>作者有话说</el-button>
                </p>
                <!-- 注意修改阶段active !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
                <el-steps :active="4" finish-status="success">
                    <el-step title="提名top100" description="12.11 - 12.17" />
                    <el-step title="提名top50" description="12.18 - 12.24" />
                    <el-step title="评选" description="12.25 - 12. 31" />
                    <el-step title="公布" description="2025.01.01" simple="false"></el-step>
                </el-steps>
            </span>

        </div>
        <el-button v-if="isTableVisible" class="loadBtn" type="primary" @click="openTop20">看看Top20烂梗</el-button>
        <el-table v-if="isTableVisible" v-loading="loading" @row-click="copyText" stripe :data="data.tableData"
            empty-text="你等了这么久,应该是没有这条烂梗,期待投稿" class="eldtable"
            :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
            :cell-style="{}">
            <el-table-column prop="barrage" min-width="100" label="获奖烂梗" />
            <el-table-column v-if="isHot" prop="awards" label="奖项" align="center" width="130">
                <template #default="scope">
                    <el-tag style="font-size: 13px;padding: 3px;" type="success" size="large" effect="plain" round> {{
                        scope.row.awards }}🏆</el-tag>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog v-model="tall" title="作者有话说" class="tall">
            <h2>衷心祝大家2025年身体健康，万事如意，天天开心，平平安安。</h2>
            <p style="text-indent: 2em;">随着弹幕文化的不断发展，今年的弹幕评选活动涌现了大量优质、幽默、有深度的作品，充分展现了观众的创意与热情。经过广泛的筛选和严格的数据统计，我们最终评选出了各大奖项的获奖弹幕，每条弹幕都从内容、影响力、互动性和娱乐性等多个维度脱颖而出。</p>
            <p style="text-indent: 2em;">每个奖项仅选出一条作为获奖烂梗。如有同一条弹幕获得多个奖项，则顺延评选，保证公平与独立性。其余TOP烂梗评选 <b><u>按照70%票数+30%评分参与计算</u></b>，最终评出20条优质、幽默、有深度的烂梗于网站公布。其余数据大家可按需下载浏览。</p>
            <h3>特别鸣谢<br></h3>
                <p style="text-indent: 2em;"> 感谢所有参与烂梗互动和评选的用户，让这场年度评选得以圆满举办。</p>

                <h3>完整获奖名单<br></h3>
                    <p style="text-indent: 2em;">请访问我们的官网查看完整榜单，参与讨论并分享属于你的“烂梗之最”!</p>
                    <h2><EM style="color: red;">最后的祝福</EM><br><span style="font-size: 18px;color: red;text-indent: 2em;">
                        新的一年，祝你眼里有星河，成就有篇章，生活无忧，万事胜意!</span>
                    </h2>
                    
        </el-dialog>

        <el-dialog v-model="top20" draggable title="Top20榜单" class="tall">
            <el-table v-if="isTableVisible" v-loading="loading" @row-click="copyText" stripe :data="data.top20Data" empty-text="正在加载..."
                class="eldtable"
                :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
                :cell-style="{}">
                <!-- <el-table-column width="50" prop="top" label="序号"></el-table-column> -->
                <el-table-column prop="top" width="55" label="TOP" >
                    <template #default="scope">
                        <el-tag style="font-size: 13px;padding: 3px;" type="success" size="large" effect="plain" round>
                            🥇 {{ scope.row.top }} &nbsp;</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="barrage" min-width="100" label="" />
            </el-table>
            <div class="pagination-wrapper" v-if="isTableVisible">
                <!-- 分页 -->
                <div v-if="isHot">
                    <el-pagination background layout="prev, pager, next, jumper" :total="data.total" :pager-count=3
                        :page-size="data.pageSize" @current-change="handleHotPageChange"></el-pagination>
                </div>
            </div>
        </el-dialog>


        <el-dialog class="custom-dialog" draggable v-model="dialogVisible" title="请为烂梗评分，将作为最后评选的参考部分">
            <p style="font-size: 16px;">🏆给这条烂梗选择一个奖项🏆 <span>⬆️记得评个分⬆️</span></p>
            <br>
            <el-radio-group ref="ref2" v-model="awards" size="large">
                <!-- 1不显示 0显示 -->
                <el-radio class="elr" :disabled="annualMostPromisingDevelopmentPotential" border
                    value="annualMostPromisingDevelopmentPotential" label="年度最具发展力奖🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="theMostOutstandingStringOfYear" border
                    value="theMostOutstandingStringOfYear" label="年度最具串子奖🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="annualMostInfluential" border
                    value="annualMostInfluential" label="年度最具影响力🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="theFunniestOfYear" border
                    value="theFunniestOfYear" label="年度最幽默奖🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="theMostPowerfulFormulaOfYear" border
                    value="theMostPowerfulFormulaOfYear" label="年度最具公式奖🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="annualMostPhilosophicalAward" border
                    value="annualMostPhilosophicalAward" label="年度最具哲学奖🏆"></el-radio>
            </el-radio-group>
            <el-divider />
            <b ref="ref1" style="font-size: 16px;margin-left: 100px;">记得给这条烂梗评个分</b>
            <br>
            <el-rate style="margin-left: 100px;" ref="ref1" allow-half v-model="star" size="large" :max="5" show-score
                text-color="#ff9900" />

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="pickHot">选取</el-button>
                </span>
            </template>
        </el-dialog>
        <el-tour mask show-arrow z-index="10000" v-model="open1">
            <el-tour-step mask :target="ref1?.$el" title="记得评分喔">
                <div>记得评分喔</div>
            </el-tour-step>
            <el-tour-step mask :target="ref2?.$el" title="记得给颁一个奖喔">
                <div>记得给颁一个奖喔</div>
            </el-tour-step>
        </el-tour>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, ElNotification} from 'element-plus'
import { ref, reactive, computed, onMounted } from 'vue';
import httpInstance from "@/apis/httpInstance";
import { API } from "@/constants/backend";

const isTableVisible = ref(false);
const isQuery = ref(false);
const isHot = ref(true);
const pickSum = ref(0);

const open1 = ref(false)
const top20 = ref(false)
const tall = ref(false)
const ref1 = ref<ButtonInstance>()
const ref2 = ref<ButtonInstance>()

const awards = ref()
const pickCnt = ref(localStorage.getItem("pickCnt-final"));
const isFinish = ref(true);
const Preloader = () => {
    if (!localStorage.getItem('annualMostPromisingDevelopmentPotential')) {
        localStorage.setItem('annualMostPromisingDevelopmentPotential', '0');
    }
    if (!localStorage.getItem('theMostOutstandingStringOfYear')) {
        localStorage.setItem('theMostOutstandingStringOfYear', '0');
    }
    if (!localStorage.getItem('annualMostInfluential')) {
        localStorage.setItem('annualMostInfluential', '0');
    }
    if (!localStorage.getItem('theFunniestOfYear')) {
        localStorage.setItem('theFunniestOfYear', '0');
    }
    if (!localStorage.getItem('theMostPowerfulFormulaOfYear')) {
        localStorage.setItem('theMostPowerfulFormulaOfYear', '0');
    }
    if (!localStorage.getItem('annualMostPhilosophicalAward')) {
        localStorage.setItem('annualMostPhilosophicalAward', '0');
    }

    const storedPickCnt = localStorage.getItem("pickCnt-final");
    if (storedPickCnt === null) {
        localStorage.setItem("pickCnt-final", "6");
        pickCnt.value = "6";
    }
    if (localStorage.getItem("pickCnt-final") > 0) {
        isFinish.value = false;
    }
}
Preloader()

// 年度最具发展力
const annualMostPromisingDevelopmentPotential = ref(localStorage.getItem('annualMostPromisingDevelopmentPotential') === '1');
// 年度最具串子
const theMostOutstandingStringOfYear = ref(localStorage.getItem('theMostOutstandingStringOfYear') === '1');
// 年度最具影响力
const annualMostInfluential = ref(localStorage.getItem('annualMostInfluential') === '1');
// 年度最幽默
const theFunniestOfYear = ref(localStorage.getItem('theFunniestOfYear') === '1');
// 年度最具公式
const theMostPowerfulFormulaOfYear = ref(localStorage.getItem('theMostPowerfulFormulaOfYear') === '1');
// 年度最具哲学奖
const annualMostPhilosophicalAward = ref(localStorage.getItem('annualMostPhilosophicalAward') === '1');


const star = ref()
const loading = ref(true)

const data = reactive({
    tableData: [],
    top20Data: [],
    total: 0,
    pageSize: 10,
    currentPage: 1,
})

const dialogVisible = ref(false);

const selectedRow = ref(null);
const open = async (row: any) => {
    if (localStorage.getItem("pickCnt-final") > 5) {
        setTimeout(() => {
            open1.value = true, 1500
        })
    }
    awards.value = ''
    star.value = 2.5
    dialogVisible.value = true
    selectedRow.value = row;
}


const pickHot = () => {
    if (pickCnt.value <= 0) {
        isFinish.value = true
        ElMessageBox.alert('你已经投过八次票了!', '期待最终评奖结果吧!', {
            confirmButtonText: 'OK',
        });
        dialogVisible.value = false
        return;
    }
    if (!awards.value) {
        ElMessageBox.alert('', '请给这条烂梗评一个奖!', {
            confirmButtonText: 'OK',
        });
        return;
    }
    httpInstance.post('/machine/hotTop20/pick', {
        barrageId: selectedRow.value.barrageId,
        barrage: selectedRow.value.barrage,
        star: star.value,
        awards: awards.value
    }).then(res => {
        localStorage.setItem(awards.value, '1');

        dialogVisible.value = false
        if (res.code == 600) {
            ElMessageBox.alert('你已经提名过这条烂梗!', '换一条提名吧!', {
                confirmButtonText: 'OK',
            });
            return
        } else if (res.code == 500) {
            isFinish.value = false
            pickCnt.value = 0;

            //下一轮投票记得改localStorage的KeyName!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            localStorage.setItem("pickCnt-final", pickCnt.value.toString());
            ElMessageBox.alert('你已经投过六次票了!', '期待最终评奖结果吧!', {
                confirmButtonText: 'OK',
            });
            return
        }
        ElMessageBox.alert(selectedRow.value.barrage, '你投了一票,一共可以投六票，结果会根据评分,票数和奖项选定', {
            confirmButtonText: 'OK',
        });
        pickCnt.value -= 1;

        //下一轮投票记得改localStorage的KeyName!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        localStorage.setItem("pickCnt-final", pickCnt.value.toString());
        switch (awards.value) {
            case 'annualMostPromisingDevelopmentPotential':
                annualMostPromisingDevelopmentPotential.value = true;
                break;
            case 'theMostOutstandingStringOfYear':
                theMostOutstandingStringOfYear.value = true;
                break;
            case 'annualMostInfluential':
                annualMostInfluential.value = true;
                break;
            case 'theFunniestOfYear':
                theFunniestOfYear.value = true;
                break;
            case 'theMostPowerfulFormulaOfYear':
                theMostPowerfulFormulaOfYear.value = true;
                break;
            case 'annualMostPhilosophicalAward':
                annualMostPhilosophicalAward.value = true;
                break;
        }
    })
}

const load = (pageNum = 1) => {
    isHot.value = true;
    isQuery.value = false;
    loading.value = true;
    httpInstance.get('/machine/hotTop20/loadTop20J', {
        params: {
            isFinish: isFinish.value
        }
    }).then(res => {
        data.tableData = res.data?.list || [];
        loading.value = false;
    });
    // httpInstance.get('/machine/hotTop20/pickSum').then(res => {
    //     pickSum.value = res.data;
    // });
}

const loadTop20 = (pageNum = 1) => {
    isHot.value = true;
    isQuery.value = false;
    loading.value = true;
    httpInstance.get('/machine/hotTop20/loadTop20', {
        params: {
            pageNum: pageNum,
            pageSize: data.pageSize,
        }
    }).then(res => {
        data.total = res.data?.total || 0;
        data.top20Data = res.data?.list || [];
        loading.value = false;
    });
}
const openTop20 = () => {
    data.currentPage=1
    top20.value = true
    loadTop20(1)
}

const handleHotPageChange = (page: number) => {
    data.currentPage = page;
    loadTop20(page);
}

const handleOpen = () => {
    if(!data.tableData.length){
        load(data.currentPage)
    }
    isTableVisible.value = !isTableVisible.value;
}
const openTall = () => {
    tall.value = !tall.value;
}
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
        httpInstance.post('/machine/addCnt', {
            PageNum: data.currentPage,
            table: 'allbarrage',
            id: row.barrageId
        }).then();
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
</script>

<style scoped>
.step {
    cursor: pointer;
    max-width: 780px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@media(min-width:601px) {

    ::v-deep .el-rate__icon {
        font-size: 35px;
    }


    .text {
        color: black;
        font-size: 17px;
    }

    .pickSum {
        color: black;
        font-size: 15px;
        margin-left: 5px;
    }

    .pickHome {
        width: 820px;
    }

    @keyframes text-style-1 {
        0% {
            background-position: 0 0;
        }

        100% {
            background-position: -100% 0;
        }
    }

    .context {
        font-size: 30px;
        background-image: linear-gradient(to right, red, yellow, green, yellow, red);
        background-clip: text;
        -webkit-background-clip: text;
        background-size: 200% 100%;
        color: transparent;
        animation: text-style-1 3.5s infinite linear;
    }

}

@media(max-width: 600px) {
    ::v-deep .tall {
        width: 90vw;
    }

    ::v-deep .el-rate__icon {
        font-size: 30px;
    }

    ::v-deep .custom-dialog {
        z-index: 100;
        width: 90%;
        /* 在较小的屏幕上使用百分比宽度 */
    }

    .elr {
        margin-left: 100px;
    }

    .text {
        color: black;
        font-size: 13px;
    }

    .loadBtn {
        margin-left: 5px;
        margin-right: 0px;
    }

    .pickSum {
        color: black;
        font-size: 12px;
        margin-left: 0px;
    }

    .context {
        font-size: 21px;
        background-image: linear-gradient(to right, red, yellow, green, yellow, red);
        background-clip: text;
        -webkit-background-clip: text;
        background-size: 200% 100%;
        color: transparent;
        animation: text-style-1 3.5s infinite linear;
    }

    @keyframes text-style-1 {
        0% {
            background-position: 0 0;
        }

        100% {
            background-position: -100% 0;
        }
    }
}
</style>