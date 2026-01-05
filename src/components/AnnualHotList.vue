<template>
    <div class="card pickHome">
        <div class="step">
            <span @click="handleOpen">
                <p class="context">2025年度TOP20烂梗评选🏆 <a @click="openPickDialog" class="pickSum"
                        style="color: blue;">规则></a>
                    <br>
                    <span v-if="stage !== 4" class="pickSum">总提名数：{{ pickSum }}</span>
                    <el-button v-if="stage === 4" link ><a href="https://cdn.hguofichp.cn/sb6657.cn2025TOP20%E7%AC%AC%E4%B8%80%E9%98%B6%E6%AE%B5%E8%AF%84%E9%80%89%E7%BB%93%E6%9E%9C.xlsx">下载第一阶段数据</a></el-button>
                    <el-button v-if="stage === 4" link><a href="https://cdn.hguofichp.cn/sb6657.cn2025TOP20%E7%AC%AC%E4%BA%8C%E9%98%B6%E6%AE%B5%E8%AF%84%E9%80%89%E7%BB%93%E6%9E%9C.xlsx">下载第二阶段</a></el-button>
                    <el-button v-if="stage === 4" link><a href="https://cdn.hguofichp.cn/sb6657.cn2025TOP20%E7%AC%AC%E4%B8%89%E9%98%B6%E6%AE%B5%E8%AF%84%E9%80%89%E7%BB%93%E6%9E%9C.xlsx">下载第三阶段</a></el-button>
                </p>

                <el-steps :active=stage-1 finish-status="success">
                    <el-step title="提名top200" description="12.01 - 12.11" />
                    <el-step title="提名top100" description="12.12 - 12.21" />
                    <el-step title="评选top20" description="12.22 - 12.31" />
                    <el-step title="公布" description="2026.01.01" simple="false"></el-step>
                </el-steps>
            </span>
            <el-button v-if="stage !== 4" class="loadBtn" type="primary" style="margin-left:27% ;"
                @click="handleOpen">加载第{{ stage-1 }}阶段烂梗(无序)
            </el-button>
            <el-button v-else class="loadBtn" type="primary" style="margin-left:27% ;" @click="handleOpen">查看最终评选结果
            </el-button>
        </div>
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
        <!-- 第四阶段显示最终结果 -->
        <div v-if="stage === 4 && isTableVisible" class="stage4-content">
            <!-- 奖项列表 -->
            <div class="awards-section" v-if="data.awardsList && data.awardsList.length > 0">
                <el-table v-loading="loading" stripe :data="data.awardsList" empty-text="暂无获奖数据" class="eldtable"
                    :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
                    :cell-style="{}" @row-click="handleRowClick">
                    <el-table-column prop="awards" label="奖项" align="center">
                        <template #default="scope">
                            <el-tag style="font-size: 11px;padding: 3px;" type="success" size="large" effect="plain"
                                round>
                                🏆{{ scope.row.awards }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="barrage" min-width="200" label="获奖烂梗" />
                </el-table>
            </div>

            <!-- Top20列表 -->
            <div class="top20-section" v-if="data.top20List && data.top20List.length > 0" style="margin-top: 30px;">
                <h3 style="color: #409EFF; margin-bottom: 20px; text-align: center;">Top20</h3>
                <el-table v-loading="loading" stripe :data="data.top20List" empty-text="暂无数据" class="eldtable"
                    :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
                    :cell-style="{}" @row-click="handleRowClick">
                    <el-table-column prop="top" width="80" label="TOP" align="center">
                        <template #default="scope">
                            <el-tag style="font-size: 13px;padding: 3px;" type="success" size="large" effect="plain"
                                round>
                                🥇 {{ scope.row.top }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="barrage" min-width="200" label="获奖烂梗" />
                </el-table>
            </div>
        </div>

        <!-- 其他阶段显示原有表格 -->
        <el-table v-if="isTableVisible && stage !== 4" v-loading="loading" stripe :data="data.tableData" height="65vh"
            empty-text="你等了这么久,应该是没有这条烂梗,期待投稿，TOP20评选默认搜索范围是2025年" class="eldtable"
            :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
            :cell-style="{}" @row-click="handleRowClick">
            <!-- 根据不同数据源显示不同的序号列 -->
            <el-table-column v-if="isQuery" width="50" prop="id" label="序号"></el-table-column>
            <el-table-column v-else width="50" prop="barrageId" label="序号"></el-table-column>
            <el-table-column v-if="isQuery === false && stage === 1" prop="barrage" min-width="90"
                label="&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;目前的提名榜" />
            <el-table-column v-if="isQuery === true" prop="barrage" min-width="90"
                label="&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;可提名的烂梗" />
            <el-table-column v-if="isQuery === false && stage !== 1" prop="barrage" min-width="90"
                label="&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;可提名的烂梗" />
            <el-table-column label="" align="center" width="85">
                <template #default="scope">
                    <el-button type="primary" label="" @click="pick(scope.row)">提名</el-button>
                </template>
            </el-table-column>
            <!-- 根据不同数据源显示不同的次数列 -->
            <el-table-column v-if="isQuery && stage === 1" prop="cnt" label="复制次数" width="55" />
            <el-table-column v-else-if="!isQuery && stage === 1" prop="pickCnt" label="提名次数" width="55" />
        </el-table>
        <div class="pagination-wrapper" v-if="isTableVisible && stage !== 4">
            <!-- 分页 -->
            <div>
                <el-pagination background layout="prev, pager, next, jumper" :total="data.total" :pager-count=4
                    :page-size="data.pageSize" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <el-dialog v-show="stage === 3" v-model="top20" draggable title="Top20榜单" class="tall">
            <el-table v-if="isTableVisible" v-loading="loading" @row-click="handleTop20RowClick" stripe
                :data="data.top20Data" empty-text="正在加载..." class="eldtable"
                :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
                :cell-style="{}">
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
                <h3>
                    <li>本活动所有用户均可参与</li>
                </h3>
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
                    <li>终选阶段还需为所投烂梗选择一个奖项，奖项包括但不限于"年度最具发展力奖"、"年度最幽默奖"、"年度最具影响力奖"、"年度最具公式奖"、"年度最具串子奖"、"年度最具哲学奖"等。</li>
                </ul>
                <h2>提名筛选规则</h2>
                <ol>
                    <li><strong>综合考量所有提名烂梗</strong>：会根据该烂梗的总复制次数与投稿时间做进一步考量该烂梗的名次。</li>
                    <li><strong>最终算法与详细结果均会在公布结果时给出。</strong></li>
                </ol>
                <h2>结果算法</h2>
                <ol>
                    <li><strong>提名阶段，复选阶段</strong>最终分数计算：提名次数占75%，总复制次数占15%，烂梗投稿时间占10%</li>
                </ol>
            </div>
        </el-dialog>
        <el-dialog class="custom-dialog" draggable v-model="dialogVisible" :title="dialogTitle">
            <p v-if="stage === 3" style="font-size: 16px;">🏆给这条烂梗选择一个奖项🏆</p>
            <p v-else style="font-size: 16px;">确认提名这条烂梗？</p>
            <br>
            <el-radio-group v-if="stage === 3" ref="ref2" v-model="awards" size="large">
                <!-- 1不显示 0显示 -->
                <el-radio class="elr" :disabled="annualMostPromisingDevelopmentPotential" border value="2025-1"
                    label="年度最具发展力奖🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="theMostOutstandingStringOfYear" border
                    value="2025-2" label="年度最具串子奖🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="annualMostInfluential" border value="2025-3"
                    label="年度最具影响力奖🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="theFunniestOfYear" border value="2025-4"
                    label="年度最幽默奖🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="theMostPowerfulFormulaOfYear" border
                    value="2025-5" label="年度最具公式奖🏆"></el-radio>
                <el-radio class="elr" style="margin-top: 10px;" :disabled="annualMostPhilosophicalAward" border
                    value="2025-6" label="年度最具哲学奖🏆"></el-radio>
            </el-radio-group>
            <el-divider v-if="stage === 3" />
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="pickHot">确认提名</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import httpInstance from "@/apis/httpInstance";
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus';
import { computed, onMounted, reactive, ref } from "vue";

const isTableVisible = ref(false);
const isQuery = ref(false);
const isHot = ref(true);
const pickRule = ref(false);
const pickSum = ref(0);
const stage = (() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    if (year === 2025 && month === 12) {
        if (day >= 1 && day <= 11) return 1;
        if (day >= 12 && day <= 21) return 2;
        if (day >= 22 && day <= 31) return 3;
    }
    if (year === 2026) {
        return 4;
    }
    return 4;
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
        // 2025年度奖项LocalStorage键名改为带年份的命名方式
        // 2025-1: 年度最具发展力奖
        if (!localStorage.getItem('2025-1')) {
            localStorage.setItem('2025-1', '0');
        }
        // 2025-2: 年度最具串子奖
        if (!localStorage.getItem('2025-2')) {
            localStorage.setItem('2025-2', '0');
        }
        // 2025-3: 年度最具影响力奖
        if (!localStorage.getItem('2025-3')) {
            localStorage.setItem('2025-3', '0');
        }
        // 2025-4: 年度最幽默奖
        if (!localStorage.getItem('2025-4')) {
            localStorage.setItem('2025-4', '0');
        }
        // 2025-5: 年度最具公式奖
        if (!localStorage.getItem('2025-5')) {
            localStorage.setItem('2025-5', '0');
        }
        // 2025-6: 年度最具哲学奖
        if (!localStorage.getItem('2025-6')) {
            localStorage.setItem('2025-6', '0');
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
// 年度最具发展力奖 (2025-1)
const annualMostPromisingDevelopmentPotential = ref(stage === 3 ? localStorage.getItem('2025-1') === '1' : false);
// 年度最具串子奖 (2025-2)
const theMostOutstandingStringOfYear = ref(stage === 3 ? localStorage.getItem('2025-2') === '1' : false);
// 年度最具影响力奖 (2025-3)
const annualMostInfluential = ref(stage === 3 ? localStorage.getItem('2025-3') === '1' : false);
// 年度最幽默奖 (2025-4)
const theFunniestOfYear = ref(stage === 3 ? localStorage.getItem('2025-4') === '1' : false);
// 年度最具公式奖 (2025-5)
const theMostPowerfulFormulaOfYear = ref(stage === 3 ? localStorage.getItem('2025-5') === '1' : false);
// 年度最具哲学奖 (2025-6)
const annualMostPhilosophicalAward = ref(stage === 3 ? localStorage.getItem('2025-6') === '1' : false);

// 对话框标题
const dialogTitle = computed(() => {
    if (stage === 3) {
        return '请为烂梗选择一个奖项';
    }
    return '确认提名';
})


const loading = ref(true)

const data = reactive({
    tableData: [],
    top20Data: [],
    top20List: [],
    awardsList: [],
    total: 0,
    pageSize: 10,
    currentPage: 1,
})

const dialogVisible = ref(false);

const selectedRow = ref<any>(null);
const open = async (row: any) => {
    if (stage === 3 && pickCnt.value <= 1) {
        setTimeout(() => {

        }, 1500)
    }
    awards.value = ''
    dialogVisible.value = true
    selectedRow.value = row;
}

const pick = (row: any) => {
    selectedRow.value = row;
    awards.value = '';

    // 第一、二阶段直接提名，第三阶段需要选择奖项
    if (stage === 3) {
        //判断第三阶段票数是否用完
        if (pickCnt.value <= 1) {
            // 弹窗提示
            ElMessageBox.alert('你已经投过六次票了!', '期待最终评奖结果吧!', {
                confirmButtonText: 'OK',
            });
            return;
        }
        // 打开奖项选择弹窗
        open(row);
    } else {
        // 直接提名
        selectedRow.value = row;
        pickHot();
    }
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

    // 第三阶段必须选奖项
    if (stage === 3 && !awards.value) {
        ElMessageBox.alert('', '请给这条烂梗选择一个奖项!', {
            confirmButtonText: 'OK',
        });
        // 保持弹窗打开，让用户选择奖项
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

    // 第三阶段才传awards
    if (stage === 3 && awards.value) {
        // 根据奖项ID映射为具体的奖项名称
        let awardName = '';
        switch (awards.value) {
            case '2025-1':
                awardName = '年度最具发展力奖';
                break;
            case '2025-2':
                awardName = '年度最具串子奖';
                break;
            case '2025-3':
                awardName = '年度最具影响力奖';
                break;
            case '2025-4':
                awardName = '年度最幽默奖';
                break;
            case '2025-5':
                awardName = '年度最具公式奖';
                break;
            case '2025-6':
                awardName = '年度最具哲学奖';
                break;
            default:
                awardName = awards.value;
        }
        requestData.awards = awardName;
    }

    httpInstance.post('/machine/hotTop20/pick', requestData).then((res: any) => {
        if (stage === 3 && awards.value) {
            localStorage.setItem(awards.value, '1');
        }

        dialogVisible.value = false
        if (res.code == 600) {
            ElMessageBox.alert(res.msg, res.msg, {
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
        // 修改消息文本，在第三阶段不提及评分
        const message = stage === 3
            ? `你投了一票,一共可以投${voteText}，还剩${pickCnt.value - 1}票，结果会根据票数和奖项选定`
            : `你投了一票,一共可以投${voteText}，还剩${pickCnt.value - 1}票，结果会根据票数选定`;
        if (selectedRow.value) {
            ElMessageBox.alert(selectedRow.value.barrage, message, {
                confirmButtonText: 'OK',
            });
        }
        pickCnt.value -= 1;
        localStorage.setItem(pickCntKey, pickCnt.value.toString());

        // 第三阶段才更新奖项状态
        if (stage === 3) {
            switch (awards.value) {
                case '2025-1':  // 年度最具发展力奖
                    annualMostPromisingDevelopmentPotential.value = true;
                    break;
                case '2025-2':  // 年度最具串子奖
                    theMostOutstandingStringOfYear.value = true;
                    break;
                case '2025-3':  // 年度最具影响力奖
                    annualMostInfluential.value = true;
                    break;
                case '2025-4':  // 年度最幽默奖
                    theFunniestOfYear.value = true;
                    break;
                case '2025-5':  // 年度最具公式奖
                    theMostPowerfulFormulaOfYear.value = true;
                    break;
                case '2025-6':  // 年度最具哲学奖
                    annualMostPhilosophicalAward.value = true;
                    break;
            }
        }
        if (res.code == 200) {
            ElNotification({
                title: '提名成功',
                message: '提名成功',
                type: 'warning',
            });
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
    if (stage === 4) {
        // 第四阶段加载最终结果
        httpInstance.get('/machine/hotTop20/loadTop20', {
            params: {
                pageNum: page,
                pageSize: data.pageSize,
            }
        }).then(res => {
            const top20List = res.data?.Top20List || [];
            const awardsList = res.data?.AwardsList || [];
            // 为 Top20List 添加排名
            data.top20List = top20List.map((item: any, index: number) => ({
                ...item,
                top: index + 1
            }));
            data.awardsList = awardsList;
            loading.value = false;
        });
    } else {
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
    }
    httpInstance.get('/machine/hotTop20/pickSum').then(res => {
        pickSum.value = res.data;
    });
}
onMounted(() => {
    httpInstance.get('/machine/hotTop20/pickSum').then(res => {
        pickSum.value = res.data;
    });
    // 第四阶段自动加载数据
    if (stage === 4) {
        load(1);
    }
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
        if (!data.tableData.length) {
            load(1)
        }
        isTableVisible.value = !isTableVisible.value;
    } else if (stage === 1) {
        if (!data.tableData.length) {
            load(data.currentPage)
        }
        isTableVisible.value = !isTableVisible.value;
    } else if (stage === 4) {
        isTableVisible.value = !isTableVisible.value;
        if (!data.top20List.length && !data.awardsList.length) {
            load(1);
        }
    }
}

// 处理表格行点击 - 阶段1从搜索数据提名，阶段2和3从top20数据提名，阶段4复制文本
const handleRowClick = (row: any, event?: MouseEvent) => {
    if (stage === 4) {
        // 第四阶段点击行复制文本
        copyText(row, event);
    } else if (stage === 3) {
        // 阶段3点击行打开提名对话框
        open(row);
    } else {
        // 其他情况点击行复制文本
        copyText(row, event);
    }
}

// 处理Top20表格行点击 - 阶段2和3从top20数据提名，阶段4复制文本
const handleTop20RowClick = (row: any, event?: MouseEvent) => {
    if (stage === 4) {
        // 第四阶段点击行复制文本
        copyText(row, event);
    } else if (stage === 2 || stage === 3) {
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

.stage4-content {
    margin: 20px 0;
    max-height: 60vh;  /* 设置最大高度为视口高度的60% */
    overflow-y: auto;  /* 启用垂直滚动条 */
    padding-right: 10px;  /* 预留滚动条空间，防止内容被遮挡 */
}

.top20-list {
    margin: 20px 0;
}

.top-item {
    display: flex;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.top-number {
    width: 80px;
    font-weight: bold;
    font-size: 16px;
    color: #409EFF;
}

.barrage-content {
    flex: 1;
    padding-left: 15px;
    font-size: 15px;
    line-height: 1.5;
}

.awards-list {
    margin: 20px 0;
}

.award-item {
    padding: 12px;
    margin-bottom: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #fafafa;
}

.award-name {
    font-weight: bold;
    color: #e6a23c;
    margin-bottom: 5px;
}

.award-barrage {
    font-size: 15px;
    line-height: 1.5;
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
