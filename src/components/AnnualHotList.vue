<template>
    <div class="card pickHome">
        <div class="step">
            <span @click="handleOpen">
                <p class="context">2025年度TOP20烂梗评选🏆  <a @click="openPickDialog" class="pickSum" style="color: blue;">规则></a>
                    <br>
                    <span class="pickSum">总提名数：{{ pickSum }}</span>
                    <!-- <el-button link ><a href="https://cdn.dgq63136.icu/%E7%AC%AC%E4%B8%80%E8%BD%AEtop20%E6%8F%90%E5%90%8D%E7%BB%93%E6%9E%9C.xlsx">下载第一轮数据</a></el-button> -->
                    <!-- <el-button link><a href="https://cdn.dgq63136.icu/%E7%AC%AC%E4%BA%8C%E8%BD%AEtop20%E6%8A%95%E7%A5%A8%E7%BB%93%E6%9E%9C.xlsx">下载第二轮</a></el-button> -->
                    <!-- <el-button link><a href="https://cdn.dgq63136.icu/%E7%AC%AC%E4%B8%89%E8%BD%AEtop20%E6%8A%95%E7%A5%A8%E7%BB%93%E6%9E%9C.xlsx">下载第三轮</a></el-button> -->
                    <!-- <el-button @click="openTall" link>作者有话说</el-button> -->
                </p>

                <el-steps :active=stage-1 finish-status="success">
                    <el-step title="提名top200" description="12.01 - 12.11" />
                    <el-step title="提名top100" description="12.12 - 12.21" />
                    <el-step title="评选top20" description="12.22 - 12.31" />
                    <el-step title="公布" description="2026.01.01" simple="false"></el-step>
                </el-steps>
            </span>

        </div>
        <!-- 阶段2和3显示Top20按钮 -->
        <el-button v-if="(stage === 4) && isTableVisible" class="loadBtn" type="primary"
            @click="openTop20">看看Top20烂梗</el-button>
        <!-- <el-table v-if="isTableVisible" v-loading="loading" @row-click="handleRowClick" stripe
            :data="stage === 1 ? data.tableData : data.top20Data" empty-text="你等了这么久,应该是没有这条烂梗,期待投稿" class="eldtable"
            :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
            :cell-style="{}">
            <el-table-column v-if="stage === 2 || stage === 3" prop="top" width="55" label="TOP">
                <template #default="scope">
                    <el-tag style="font-size: 13px;padding: 3px;" type="success" size="large" effect="plain" round>
                        🥇 {{ scope.row.top }} &nbsp;</el-tag>
                </template>
</el-table-column>
<el-table-column prop="barrage" min-width="100" label="获奖烂梗" />
<el-table-column v-if="isHot" prop="awards" label="奖项" align="center" width="130">
    <template #default="scope">
                    <el-tag style="font-size: 13px;padding: 3px;" type="success" size="large" effect="plain" round> {{
                        scope.row.awards }}🏆</el-tag>
                </template>
</el-table-column>
</el-table> -->
        <div style="display: flex;">
            <!-- 阶段1显示搜索框 -->
            <el-input v-if="stage === 1" v-model="searchKey" placeholder="先搜索2025年烂梗再提名(范围默认25年烂梗)" clearable
                @keydown.enter="handleSearchMeme">
                <template #append>
                    <el-button type="primary" @click="handleSearchMeme">
                        <el-icon>
                            <Search />
                        </el-icon>
                        搜索
                    </el-button>
                </template>
            </el-input>
            <!-- 阶段1显示看看提名榜按钮 -->
            <span v-if="stage === 1" @click="isTableVisible = true">
                <el-button class="loadBtn" type="primary" label="" @click="load">看看提名榜</el-button></span>
        </div>
        <el-table v-if="isTableVisible" v-loading="loading" stripe :data="data.tableData" height="60vh"
            empty-text="你等了这么久,应该是没有这条烂梗,期待投稿，TOP20评选默认搜索范围是2025年" class="eldtable"
            :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
            :cell-style="{}">
            <!-- 根据不同数据源显示不同的序号列 -->
            <el-table-column v-if="isQuery" width="50" prop="id" label="序号"></el-table-column>
            <el-table-column v-else width="50" prop="barrageId" label="序号"></el-table-column>
            <el-table-column v-if="isQuery === false" prop="barrage" min-width="90"
                label="&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;目前的提名榜" />
            <el-table-column v-if="isQuery === true" prop="barrage" min-width="90"
                label="&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;烂梗" />
            <el-table-column label="" align="center" width="85">
                <template #default="scope">
                    <el-button type="primary" label="" @click="pick(scope.row)">提名</el-button>
                </template>
            </el-table-column>
            <!-- 根据不同数据源显示不同的次数列 -->
            <el-table-column v-if="isQuery && stage === 1" prop="cnt" label="复制次数" width="55" />
            <el-table-column v-else-if="!isQuery && stage === 1" prop="pickCnt" label="提名次数" width="55" />
        </el-table>
        <div class="pagination-wrapper" v-if="isTableVisible">
            <!-- 分页 -->
            <div>
                <el-pagination background layout="prev, pager, next, jumper" :total="data.total" :pager-count=4
                    :page-size="data.pageSize" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
        <el-dialog v-model="tall" title="作者有话说" class="tall">
            <h2>衷心祝大家2026年身体健康，万事如意，天天开心，平平安安。</h2>
            <p style="text-indent: 2em;">
                随着弹幕文化的不断发展，今年的弹幕评选活动涌现了大量优质、幽默、有深度的作品，充分展现了观众的创意与热情。经过广泛的筛选和严格的数据统计，我们最终评选出了各大奖项的获奖弹幕，每条弹幕都从内容、影响力、互动性和娱乐性等多个维度脱颖而出。
            </p>
            <p style="text-indent: 2em;">每个奖项仅选出一条作为获奖烂梗。如有同一条弹幕获得多个奖项，则顺延评选，保证公平与独立性。其余TOP烂梗评选
                <b><u>按照票数参与计算</u></b>，最终评出20条优质、幽默、有深度的烂梗于网站公布。其余数据大家可按需下载浏览。
            </p>
            <h3>特别鸣谢<br></h3>
            <p style="text-indent: 2em;"> 感谢所有参与烂梗互动和评选的用户，让这场年度评选得以圆满举办。</p>

            <h3>完整获奖名单<br></h3>
            <p style="text-indent: 2em;">请访问我们的官网查看完整榜单，参与讨论并分享属于你的“烂梗之最”!</p>
            <h2><EM style="color: red;">最后的祝福</EM><br><span style="font-size: 18px;color: red;text-indent: 2em;">
                    新的一年，祝你眼里有星河，成就有篇章，生活无忧，万事胜意!</span>
            </h2>

        </el-dialog>

        <el-dialog v-show="stage === 3" v-model="top20" draggable title="Top20榜单" class="tall">
            <el-table v-if="isTableVisible" v-loading="loading" @row-click="handleTop20RowClick" stripe
                :data="data.top20Data" empty-text="正在加载..." class="eldtable"
                :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
                :cell-style="{}">
                <!-- <el-table-column width="50" prop="top" label="序号"></el-table-column> -->
                <el-table-column prop="top" width="55" label="TOP">
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

        <el-dialog v-model="pickRule" draggable title="Top20评选规则介绍" width="80%">
            <div style="margin-left: 1%;">
                <h1>2025年度TOP20烂梗评选规则介绍</h1>
                <b>欢迎参加2025年度TOP20烂梗评选活动！以下是本次评选的详细规则和流程，请仔细阅读以确保您的参与顺利进行。</b>
                <h3><li>本活动所有用户均可参与</li></h3>
                <h2>评选阶段</h2>
                <ol>
                    <li><strong>提名阶段（12月1日 - 12月11日）</strong>：用户可以从2025年发布的烂梗中提名自己喜欢的烂梗，每人有10次提名机会。</li>
                    <li><strong>复选阶段（12月12日 - 12月21日）</strong>：从提名的烂梗中筛选出前100名，用户继续进行投票，每人仍有10次投票机会。</li>
                    <li><strong>终选阶段（12月22日 - 12月31日）</strong>：从复选阶段的100名烂梗中选出前20名，用户每人有6次投票机会，并需为所投烂梗评分和选择奖项。</li>
                    <li><strong>公布阶段（2026年1月1日）</strong>：公布最终TOP20烂梗名单及各奖项获奖情况。</li>
                </ol>
                <h2>投票与评分</h2>
                <ul>
                    <li>每位用户在每个阶段都有固定的提名或投票次数，具体如下：
                        <ul>
                            <li>提名阶段：10次提名机会</li>
                            <li>复选阶段：10次投票机会</li>
                            <li>终选阶段：6次投票机会</li>
                        </ul>
                    </li>
                    <li>终选阶段还需为所投烂梗选择一个奖项，奖项包括但不限于“年度最具发展力奖”、“年度最幽默奖”、“年度最具公式奖”、“年度最具公式奖”、“年度最具串子奖”、“年度最具哲学奖”等。</li>
                </ul>
            </div>
        </el-dialog>
        <el-dialog class="custom-dialog" draggable v-model="dialogVisible" :title="dialogTitle">
            <p v-if="stage === 3" style="font-size: 16px;">🏆给这条烂梗选择一个奖项🏆 <span>⬆️记得评个分⬆️</span></p>
            <p v-else style="font-size: 16px;">⬆️记得评个分⬆️</p>
            <br>
            <el-radio-group v-if="stage === 3" ref="ref2" v-model="awards" size="large">
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
            <el-divider v-if="stage === 3" />
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
import httpInstance from "@/apis/httpInstance";
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { onMounted } from "vue";
import { computed, reactive, ref } from 'vue';

const isTableVisible = ref(false);
const isQuery = ref(false);
const isHot = ref(true);
const pickRule = ref(false);
const pickSum = ref(0);
const stage = (() => {
    //todo
    // const now = new Date();
    // const day = now.getDate();
    // // 12 月份的判断逻辑
    // if (day >= 1 && day <= 11) return 1;
    // if (day >= 12 && day <= 21) return 2;
    // if (day >= 22 && day <= 31) return 3;
    return 1; // 默认最终 4 展示奖项
})();
const open1 = ref(false)
const top20 = ref(false)
const tall = ref(false)
const ref1 = ref<any>()
const ref2 = ref<any>()

const searchKey = ref('')
const awards = ref()
// 根据阶段获取localStorage key和初始票数
const getPickCntKey = () => {
    if (stage === 1) return "pickCnt-stage1";
    if (stage === 2) return "pickCnt-stage2";
    if (stage === 3) return "pickCnt-stage3";
    return "pickCnt-final";
}
const getMaxPickCnt = () => {
    if (stage === 1 || stage === 2) return 10;
    if (stage === 3) return 6;
    return 6;
}
const pickCntKey = getPickCntKey();
const maxPickCnt = getMaxPickCnt();
const pickCnt = ref(Number(localStorage.getItem(pickCntKey)) || maxPickCnt);
const isFinish = ref(true);
const Preloader = () => {
    // 阶段3才需要初始化奖项
    if (stage === 3) {
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
    }

    const storedPickCnt = localStorage.getItem(pickCntKey);
    if (storedPickCnt === null) {
        localStorage.setItem(pickCntKey, maxPickCnt.toString());
        pickCnt.value = maxPickCnt;
    } else {
        pickCnt.value = Number(storedPickCnt);
    }
    if (pickCnt.value > 0) {
        isFinish.value = false;
    }
}
Preloader()

function openPickDialog() {
    pickRule.value = !pickRule.value;
}

// 阶段3才需要奖项状态
// 年度最具发展力
const annualMostPromisingDevelopmentPotential = ref(stage === 3 ? localStorage.getItem('annualMostPromisingDevelopmentPotential') === '1' : false);
// 年度最具串子
const theMostOutstandingStringOfYear = ref(stage === 3 ? localStorage.getItem('theMostOutstandingStringOfYear') === '1' : false);
// 年度最具影响力
const annualMostInfluential = ref(stage === 3 ? localStorage.getItem('annualMostInfluential') === '1' : false);
// 年度最幽默
const theFunniestOfYear = ref(stage === 3 ? localStorage.getItem('theFunniestOfYear') === '1' : false);
// 年度最具公式
const theMostPowerfulFormulaOfYear = ref(stage === 3 ? localStorage.getItem('theMostPowerfulFormulaOfYear') === '1' : false);
// 年度最具哲学奖
const annualMostPhilosophicalAward = ref(stage === 3 ? localStorage.getItem('annualMostPhilosophicalAward') === '1' : false);

// 对话框标题
const dialogTitle = computed(() => {
    if (stage === 3) {
        return '请为烂梗评分并选择奖项，将作为最后评选的参考部分';
    }
    return '请为烂梗评分，将作为最后评选的参考部分';
})


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

const selectedRow = ref<any>(null);
const open = async (row: any) => {
    if (stage === 3 && pickCnt.value <= 1) {
        setTimeout(() => {
            open1.value = true, 1500
        })
    }
    awards.value = ''
    dialogVisible.value = true
    selectedRow.value = row;
}

const pick = (row: any) => {
    selectedRow.value = row;
    awards.value = ''
    pickHot();
}


const pickHot = () => {
    if (pickCnt.value <= 0) {
        isFinish.value = true
        const voteText = stage === 3 ? '六次票' : '十次票';
        ElMessageBox.alert(`你已经投过${voteText}了!`, '期待最终评奖结果吧!', {
            confirmButtonText: 'OK',
        });
        dialogVisible.value = false
        return;
    }
    // 阶段3必须选奖项
    if (stage === 3 && !awards.value) {
        ElMessageBox.alert('', '请给这条烂梗评一个奖!', {
            confirmButtonText: 'OK',
        });
        return;
    }
    if (!selectedRow.value) {
        dialogVisible.value = false
        return;
    }

    // 构造符合后端接口要求的请求数据，只需要barrageId
    const requestData: any = {};

    // 根据不同数据源使用不同的ID字段
    if (isQuery.value) {
        // 搜索结果使用id字段
        requestData.barrageId = selectedRow.value.id;
    } else {
        // 提名榜使用barrageId字段
        requestData.barrageId = selectedRow.value.barrageId;
    }

    // 阶段3才传awards
    if (stage === 3 && awards.value) {
        requestData.awards = awards.value;
    }

    // 使用JSON格式发送请求
    httpInstance.post('/machine/hotTop20/pick', requestData).then((res: any) => {
        if (stage === 3 && awards.value) {
            localStorage.setItem(awards.value, '1');
        }

        dialogVisible.value = false
        if (res.code == 600) {
            ElMessageBox.alert('你已经提名过这条烂梗!', '换一条提名吧!', {
                confirmButtonText: 'OK',
            });
            return
        } else if (res.code == 500) {
            isFinish.value = false
            pickCnt.value = 0;
            localStorage.setItem(pickCntKey, pickCnt.value.toString());
            const voteText = stage === 3 ? '六次票' : '十次票';
            ElMessageBox.alert(`你已经投过${voteText}了!`, '期待最终评奖结果吧!', {
                confirmButtonText: 'OK',
            });
            return
        }
        const voteText = stage === 3 ? '六票' : '十票';
        const message = stage === 3
            ? `你投了一票,一共可以投${voteText}，还剩${pickCnt.value - 1}票，结果会根据评分,票数和奖项选定`
            : `你投了一票,一共可以投${voteText}，还剩${pickCnt.value - 1}票，结果会根据评分和票数选定`;
        if (selectedRow.value) {
            ElMessageBox.alert(selectedRow.value.barrage, message, {
                confirmButtonText: 'OK',
            });
        }
        pickCnt.value -= 1;
        localStorage.setItem(pickCntKey, pickCnt.value.toString());

        // 阶段3才更新奖项状态
        if (stage === 3) {
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
        }
    })
}
const handleSearchMeme = (eventOrPageNum: KeyboardEvent | number = 1) => {
    // 如果是键盘事件（来自@keydown.enter），我们忽略参数，使用默认值1
    // 如果是数字（来自分页组件），则使用该数字作为页码

    let pageNum = 1;
    if (typeof eventOrPageNum === 'number') {
        pageNum = eventOrPageNum;
    }

    isTableVisible.value = true
    isQuery.value = true  // 设置为查询状态
    loading.value = true
    const formData = new FormData();
    formData.append('queryBarrage', searchKey.value);
    formData.append('pageNum', pageNum.toString());
    formData.append('pageSize', data.pageSize.toString());

    httpInstance.post('/machine/hotTop20/Query', formData).then(res => {
        data.total = res.data?.total || 0
        data.tableData = res.data?.list || []
        data.currentPage = pageNum
        loading.value = false
    })
}
const load = (pageNum: number | MouseEvent = 1) => {
    // 确保pageNum是数字类型
    let page: number = 1;
    if (typeof pageNum === 'number') {
        page = pageNum;
    } else if (pageNum && typeof pageNum === 'object' && 'type' in pageNum) {
        // 如果是事件对象，使用默认值1
        page = 1;
    }

    isHot.value = true;
    isQuery.value = false;  // 设置为提名榜状态
    loading.value = true;
    httpInstance.get('/machine/hotTop20/loadTop20', {
        params: {
            pageNum: page,
            pageSize: data.pageSize,
        }
    }).then(res => {
        data.total = res.data?.total || 0;
        data.tableData = res.data?.list || [];
        data.currentPage = page;
        loading.value = false;
    });
    httpInstance.get('/machine/hotTop20/pickSum').then(res => {
        pickSum.value = res.data;
    });
}
onMounted(() => {
    httpInstance.get('/machine/hotTop20/pickSum').then(res => {
        pickSum.value = res.data;
    });
});
const loadTop20 = (pageNum: number | MouseEvent = 1) => {
    // 确保pageNum是数字类型
    let page: number = 1;
    if (typeof pageNum === 'number') {
        page = pageNum;
    } else if (pageNum && typeof pageNum === 'object' && 'type' in pageNum) {
        // 如果是事件对象，使用默认值1
        page = 1;
    }

    isHot.value = true;
    isQuery.value = false;
    loading.value = true;
    httpInstance.get('/machine/hotTop20/loadTop20', {
        params: {
            pageNum: page,
            pageSize: data.pageSize,
        }
    }).then(res => {
        data.total = res.data?.total || 0;
        data.top20Data = res.data?.list || [];
        loading.value = false;
    });

}
const openTop20 = () => {
    data.currentPage = 1
    top20.value = true
    loadTop20(1)
}

const handleHotPageChange = (page: number) => {
    data.currentPage = page;
    loadTop20(page);
}

const handleOpen = () => {
    // 阶段2和3需要加载top20数据到主表格
    if (stage === 2 || stage === 3) {
        if (!data.top20Data.length) {
            loadTop20(1)
        }
        isTableVisible.value = !isTableVisible.value;
    } else if (stage === 1) {
        if (!data.tableData.length) {
            load(data.currentPage)
        }
        isTableVisible.value = !isTableVisible.value;
    }
}

// 处理表格行点击 - 阶段1从搜索数据提名，阶段2和3从top20数据提名
const handleRowClick = (row: any, event?: MouseEvent) => {
    if (stage === 1 || stage === 2 || stage === 3) {
        // 阶段1、2、3点击行打开提名对话框
        open(row);
    } else {
        // 其他情况点击行复制文本
        copyText(row, event);
    }
}

// 处理Top20表格行点击 - 阶段2和3从top20数据提名
const handleTop20RowClick = (row: any, event?: MouseEvent) => {
    if (stage === 2 || stage === 3) {
        // 阶段2和3点击行打开提名对话框
        open(row);
    } else {
        // 其他情况复制文本
        copyText(row, event);
    }
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
let lastMousePosition: { x: number; y: number } | null = null;
let mousePositionCnt = 0;
const copyText = (row: any, event?: MouseEvent) => {
    const currentTime = new Date().getTime();
    const currentMousePosition = event ? { x: event.clientX, y: event.clientY } : { x: 0, y: 0 };
    // 检查鼠标位置是否变化
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
        httpInstance.get(`/machine/addCnt/${row.barrageId}`).then()
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
const handlePageChange = (page: number) => {
    data.currentPage = page
    // 根据isQuery状态判断是查询还是加载提名榜
    if (isQuery.value) {
        // 如果是查询状态，调用查询接口
        handleSearchMeme(page)
    } else {
        // 如果是提名榜状态，调用loadTop20接口
        load(page)
    }
}
</script>

<style scoped>
.step {
    cursor: pointer;
    max-width: 780px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@media(min-width:601px) {

    :deep(.el-rate__icon) {
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
        width: 500px;
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
    :deep(.tall) {
        width: 90vw;
    }

    :deep(.el-rate__icon) {
        font-size: 30px;
    }

    :deep(.custom-dialog) {
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
