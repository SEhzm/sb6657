<template>
    <div class="card pickHome">
        <div class="step">
            <span @click="handleOpen">
                <p class="context">2024年度TOP20烂梗评选<span class="pickSum">总提名数：{{ pickSum }}</span>
                </p>
                <el-steps :active="1" finish-status="success">
                    <el-step title="提名top100" description="12.11 - 12.17" />
                    <el-step title="提名top50" description="12.18 - 12.24" />
                    <el-step title="评选" description="12.25 - 12. 31" />
                    <el-step title="公布" description="2025.01.01" />
                </el-steps>
            </span>
            <div style="display: flex;">
                <el-input v-model="searchKey" placeholder="先在这搜索烂梗再提名" clearable @keydown.enter="handleSearchMeme">
                    <template #append>
                        <el-button type="primary" @click="handleSearchMeme">
                            <el-icon>
                                <Search />
                            </el-icon>
                            搜索
                        </el-button>
                    </template>
                </el-input>
                <span @click="isTableVisible = true">
                    <el-button class="loadBtn" type="primary" label="" @click="load">看看提名榜</el-button></span>
            </div>
        </div>
        <el-table v-if="isTableVisible" v-loading="loading" stripe :data="data.tableData"
            empty-text="你等了这么久,应该是没有这条烂梗,期待投稿" class="eldtable"
            :header-cell-style="{ color: '#ff0000', fontSize: '13px', whitespace: 'normal !important' }"
            :cell-style="{}">
            <el-table-column width="50" prop="id" label="序号"></el-table-column>
            <el-table-column prop="barrage" min-width="90"
                label="&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;目前的提名榜" />
            <el-table-column label="" align="center" width="85">
                <template #default="scope">
                    <el-button type="primary" label="" @click="pick(scope.row)">提名</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="pickCnt" label="提名次数" width="55" />
        </el-table>
        <div class="pagination-wrapper" v-if="isTableVisible">
            <!-- 分页 -->
            <div>
                <el-pagination background layout="prev, pager, next, jumper" :total="data.total" :pager-count=4
                    :page-size="data.pageSize" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive, computed, onMounted } from 'vue';
import httpInstance from "@/apis/httpInstance";
import { API } from "@/constants/backend";

const isTableVisible = ref(false);
const pickSum = ref(0);

//下一轮投票记得改localStorage的KeyName!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const pickCnt = ref(localStorage.getItem("pickCnt"));

const Preloader = () => {
    //下一轮投票记得改localStorage的KeyName!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    const storedPickCnt = localStorage.getItem("pickCnt");
    //不存在就设置
    if (storedPickCnt === null) {
        localStorage.setItem("pickCnt", "3");
        pickCnt.value = "3";
    }
}
Preloader()

const loading = ref(true)
const searchKey = ref()
const data = reactive({
    tableData: [],
    total: 0,
    pageSize: 10, //每页个数
    currentPage: 1, //起始页码
})
const handleSearchMeme = () => {
    isTableVisible.value = true
    httpInstance.post('/machine/hotTop20/Query', {
        QueryBarrage: searchKey.value
    }).then(res => {
        data.total = res.data?.total || 0
        data.tableData = res.data?.list || []
        loading.value = false
    })
}
const pick = (row: any) => {
    if (pickCnt.value <= 0) {
        ElMessageBox.alert('你已经投过三次票了!', '等待下一轮投票吧!', {
            confirmButtonText: 'OK',
        });
        return;
    }

    httpInstance.post('/machine/hotTop20/pick', {
        barrageId: row.id,
        barrage: row.barrage
    }).then(res => {
        if (res.code == 600) {
            ElMessageBox.alert('你已经提名过这条烂梗!', '换一条提名吧!', {
                confirmButtonText: 'OK',
            });
        } else if (res.code == 500) {
            ElMessageBox.alert('你已经投过三次票了!', '等待下一轮投票吧!', {
                confirmButtonText: 'OK',
            });
        } else {
            ElMessageBox.alert(row.barrage, '你投了一票', {
                confirmButtonText: 'OK',
            });


            pickCnt.value -= 1;

            //下一轮投票记得改localStorage的KeyName!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            localStorage.setItem("pickCnt", pickCnt.value.toString());
        }
    }).catch(err => {
        ElMessageBox.alert('慢点哟', '别别别, 你的手速太快辣', {
            confirmButtonText: 'OK',
        });
    });
}
const load = (pageNum = 1) => {
    loading.value = true
    httpInstance.get('/machine/hotTop20/loadTop20').then(res => {
        data.total = res.data?.total || 0
        data.tableData = res.data?.list || []
        loading.value = false
    });
    httpInstance.get('/machine/hotTop20/pickSum').then(res => {
        console.log(res);

        pickSum.value = res.data
    })
}
load()


const handlePageChange = (page) => {
    data.currentPage = page
    load(page)
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
    .loadBtn {
        margin-left: 100px;
        margin-right: 50px;
    }

    .pickSum {
        color: black;
        font-size: 15px;
        margin-left: 60px;
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
    .loadBtn {
        margin-left: 20px;
        margin-right: 10px;
    }

    .pickSum {
        color: black;
        font-size: 12px;
        margin-left: 30px;
    }

    .context {
        font-size: 22px;
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