<template>
    <div class="card pickHome">
        <div class="step">
            <span @click="handleOpen">
                <p class="context">2024年度TOP20烂梗评选🏆<span class="pickSum">第二轮总投票数：{{ pickSum }}</span>
                </p>
                <!-- 注意修改阶段active !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
                <el-steps :active="1" finish-status="success">
                    <el-step title="提名top100" description="12.11 - 12.17" />
                    <el-step title="提名top50" description="12.18 - 12.24" />
                    <el-step title="评选" description="12.25 - 12. 31" />
                    <el-step title="公布" description="2025.01.01" simple="false"></el-step>
                </el-steps>
            </span>
            <span class="text" v-if="isTableVisible" @click="isTableVisible = true" >
                <el-tooltip class="box-item" content="顺序为随机显示，不代表排名" placement="top">
                    <el-button class="loadBtn" type="primary" @click="load(1)">更换十条</el-button></el-tooltip> 本阶段一共可以投五票，结果会根据<b>评分</b>和<b>票数</b>选定</span>
        </div>

        <el-table v-if="isTableVisible" v-loading="loading" stripe :data="data.tableData"
            empty-text="你等了这么久,应该是没有这条烂梗,期待投稿" class="eldtable"
            :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
            :cell-style="{}">
            <!-- <el-table-column width="50" prop="id" label="序号"></el-table-column> -->
            <el-table-column prop="barrage" min-width="90" label=" 每人三票，顺序为随机显示，不代表排名" />
            <el-table-column v-if="isHot" label="" align="center" width="85">
                <template #default="scope">
                    <el-button type="primary" label="" @click="open(scope.row)">提名</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-wrapper" v-if="isTableVisible">
            <!-- 分页 -->
            <div v-if="isHot">
                <el-pagination background layout="prev, pager, next, jumper" :total="data.total" :pager-count=4
                    :page-size="data.pageSize" @current-change="handleHotPageChange"></el-pagination>
            </div>
        </div>
        <el-dialog draggable v-model="dialogVisible" title="请为烂梗评分，将作为最后评选的参考部分">
            <el-rate allow-half v-model="star" size="large" :max="5" show-score text-color="#ff9900" />
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="pickHot">选取</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, computed, onMounted } from 'vue';
import httpInstance from "@/apis/httpInstance";
import { API } from "@/constants/backend";

const isTableVisible = ref(false);
const isQuery = ref(false);
const isHot = ref(true);
const pickSum = ref(0);

const pickCnt = ref(localStorage.getItem("pickCnt-2"));
const isFinish = ref(true);
const Preloader = () => {
    const storedPickCnt = localStorage.getItem("pickCnt-2");
    if (storedPickCnt === null) {
        localStorage.setItem("pickCnt-2", "5");
        pickCnt.value = "5";
    }
    if (localStorage.getItem("pickCnt-2") > 0) {
        isFinish.value = false;
    }
}
Preloader()
const star = ref()
const loading = ref(true)

const data = reactive({
    tableData: [],
    total: 0,
    pageSize: 10,
    currentPage: 1,
})

const dialogVisible = ref(false);

const selectedRow = ref(null);
const open = (row: any) => {
    star.value = 2.5
    dialogVisible.value = true
    selectedRow.value = row;
}


const pickHot = () => {

    if (pickCnt.value <= 0) {
        isFinish.value = true
        ElMessageBox.alert('你已经投过五次票了!', '等待下一轮投票吧!', {
            confirmButtonText: 'OK',
        });
        dialogVisible.value = false
        return;
    }

    httpInstance.post('/machine/hotTop20/pick', {
        barrageId: selectedRow.value.barrageId,
        barrage: selectedRow.value.barrage,
        star: star.value
    }).then(res => {
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
            localStorage.setItem("pickCnt-2", pickCnt.value.toString());
            ElMessageBox.alert('你已经投过五次票了!', '等待下一轮投票吧!', {
                confirmButtonText: 'OK',
            });
            return
        }
        ElMessageBox.alert(selectedRow.value.barrage , '你投了一票,一共可以投五票，结果会根据评分和票数选定', {
            confirmButtonText: 'OK',
        });
        pickCnt.value -= 1;

        //下一轮投票记得改localStorage的KeyName!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        localStorage.setItem("pickCnt-2", pickCnt.value.toString());

    })
}

const load = (pageNum = 1) => {
    isHot.value = true;
    isQuery.value = false;
    loading.value = true;
    httpInstance.get('/machine/hotTop20/loadTop20', {
        params: {
            pageNum: pageNum,
            pageSize: data.pageSize,
            isFinish: isFinish.value
        }
    }).then(res => {
        data.total = res.data?.total || 0;
        data.tableData = res.data?.list || [];
        loading.value = false;
    });
    httpInstance.get('/machine/hotTop20/pickSum').then(res => {
        pickSum.value = res.data;
    });
}
load(data.currentPage);

const handleHotPageChange = (page: number) => {
    data.currentPage = page;
    load(page);
}

const handleOpen = () => {
    isTableVisible.value = !isTableVisible.value;
}
</script>

<style scoped>
.step {
    cursor: pointer;
    max-width: 600px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@media(min-width:601px) {
    ::v-deep .el-rate__icon {
        font-size: 35px;
    }
    .text{
        color: black;font-size: 17px;
    }
    .pickSum {
        color: black;
        font-size: 15px;
        margin-left: 5px;
    }

    .pickHome {
        width: 620px;
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
        font-size: 35px;
        background-image: linear-gradient(to right, red, yellow, green, yellow, red);
        background-clip: text;
        -webkit-background-clip: text;
        background-size: 200% 100%;
        color: transparent;
        animation: text-style-1 3.5s infinite linear;
    }

}

@media(max-width: 600px) {
    .text{
        color: black;font-size: 13px;
    }
    .loadBtn {
        margin-left: 5px;
        margin-right: 0px;
    }

    .pickSum {
        color: black;
        font-size: 12px;
        margin-left: 2px;
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