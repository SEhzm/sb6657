<template>
    <div class="major-champion" v-loading="isLoading" element-loading-text="加载队伍数据中...">
        <h2 class="title">冠军竞猜</h2>

        <div class="bracket-container">
            <!-- 冠军组队伍 -->
            <div class="bracket-stage">
                <div class="stage-title">冠军组队伍</div>
                <div class="matches">
                    <div class="match">
                        <draggable 
                            :list="teams" 
                            :group="dragGroup" 
                            item-key="id" 
                            class="slot teams-grid"
                            ghost-class="ghost" 
                            :disabled="!isTimeValid"
                        >
                            <template #item="{ element }">
                                <div class="team-card" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="teams.length === 0" class="empty-slot">暂无队伍</div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </div>

            <!-- 连接线到冠军 -->
            <div class="connector-column third"></div>

            <!-- 冠军 -->
            <div class="bracket-stage champion-stage">
                <div class="stage-title">冠军</div>
                <div class="matches">
                    <draggable 
                        id="champion" 
                        :list="champion" 
                        :group="dragGroup" 
                        item-key="id" 
                        class="slot champion-slot" 
                        ghost-class="ghost" 
                        @change="(e) => handleBracketChange(e, 'champion')" 
                        :move="moveTeamToSlot" 
                        :max="1" 
                        :disabled="!isTimeValid"
                    >
                        <template #item="{ element }">
                            <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                <img :src="element.logo" :alt="element.name" class="team-logo" />
                                <div class="team-name">{{ element.name }}</div>
                                <button class="remove-btn" @click.stop="removeTeam('champion', element.id)" :disabled="!isTimeValid">×</button>
                            </div>
                        </template>
                        <template #footer>
                            <div v-if="champion.length === 0" class="empty-slot champion-empty">？</div>
                        </template>
                    </draggable>
                </div>
            </div>
        </div>

        <div class="save-button">
            <el-button @click="saveChampionPrediction" :disabled="!isTimeValid">保存预测</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'
import type { Team } from './Base.vue'
import MatchPredictionBase from './Base.vue'
import { matchAPI } from '@/apis/match'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/useAuthStore'

interface PredictionRecord {
    sl?: string;
    ls?: string;
    advance?: string;
    champion?: string;
}

const props = defineProps<{
    isTimeValid: boolean,
    matchId: number
}>()

const authStore = useAuthStore()
const isLoading = ref(false)
const teams = ref<Team[]>([])

// 添加防抖函数
const debounce = (fn: Function, delay: number) => {
    let timer: number | null = null;
    return function(this: any, ...args: any[]) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
            timer = null;
        }, delay);
    };
};

// 创建防抖后的保存函数
const debouncedSave = debounce(() => {
    if (props.isTimeValid) {
        console.log('触发防抖保存冠军预测...');
        saveChampionPrediction();
    }
}, 300);

// 获取队伍池数据
const fetchTeams = async () => {
    try {
        isLoading.value = true
        console.log('获取冠军组队伍数据，matchId:', props.matchId)
        const response = await matchAPI.getMatchTeams(props.matchId, 'champion')
        console.log("获取到的原始数据:", response.data)
        
        teams.value = response.data.map((team: any) => ({
            id: team.id,
            name: team.teamName,
            logo: team.teamImgUrl
        }))
        console.log("处理后的队伍数据:", teams.value)
        
    } catch (error) {
        console.error('获取队伍数据失败:', error)
        ElMessage.error('获取队伍数据失败')
    } finally {
        isLoading.value = false
    }
}

// 获取用户之前的预测数据
const fetchUserPrediction = async () => {
    if (!props.matchId) {
        console.warn('matchId未设置，跳过获取预测数据')
        return
    }

    try {
        isLoading.value = true
        if (teams.value.length === 0) {
            await fetchTeams()
        }

        const response = await matchAPI.getUserPredictions({ 
            matchId: props.matchId, 
            phase: 'champion', 
            userId: authStore.userId 
        })
        
        if (response.data) {
            // 确保我们有一个有效的预测记录
            let prediction: PredictionRecord = Array.isArray(response.data) ? response.data[0] : response.data; // Explicitly type prediction
            
            // 用于存储已选队伍的ID
            const selectedTeamIds = new Set<string>()
            
            // 根据预测数据填充队伍，使用ID匹配
            if (prediction.advance) {
                const championTeamId = prediction.advance.split(',')
                const matchedTeams = teams.value.filter(t => 
                    championTeamId.includes(t.id.toString())
                )
                champion.value = matchedTeams
                matchedTeams.forEach(team => selectedTeamIds.add(team.id.toString()))
            }
            
            // 从队伍池中移除已选的队伍
            teams.value = teams.value.filter(team => !selectedTeamIds.has(team.id.toString()))
        } else {
            console.log('未找到用户之前的预测数据')
        }
    } catch (error: any) {
        // 如果是401错误，说明用户未登录，静默处理
        if (error.response?.status === 401) {
            console.log('用户未登录，跳过获取预测数据')
            return
        }
        console.error('获取预测数据失败:', error)
        ElMessage.error('获取预测数据失败')
    } finally {
        isLoading.value = false
    }
}

// 修改组件挂载逻辑
onMounted(async () => {
    if (props.matchId) {
        await fetchTeams()
        // 直接尝试获取预测数据，让请求处理登录状态
        await fetchUserPrediction()
    }
})

const dragGroup = { name: 'teams' }

// 淘汰赛阶段列表 - 初始为空数组
const champion = ref<Team[]>([])

// 使用 watch 监听冠军队伍数据变化以触发防抖保存
watch(champion, () => {
    debouncedSave();
}, { deep: true });

// 根据阶段名称获取对应的列表
const getStageList = (stage: string) => {
    switch (stage) {
        case 'champion': return champion;
        default: return ref([]);
    }
}

// 允许队伍拖拽到冠军槽位
const moveTeamToSlot = (e: any) => {
    const dragListId = e.from.parentElement.id; // 队伍拖拽来源列表的 ID
    const dropListId = e.to.parentElement.id; // 队伍放置目标列表的 ID

    // 防止从无效位置拖拽或拖拽到无效位置
     if (!dragListId || !dropListId) return false;

    // 允许从冠军组队伍拖拽到冠军槽位
     if (dropListId === 'champion') return true;

    return false; // 阻止其他所有移动
};

// 处理淘汰赛阶段列表的变化 (队伍被添加/移除)
const handleBracketChange = (e: any, stage: string) => {
    if (stage === 'champion') {
        if (e.added) {
            const addedTeam = e.added.element;

            // 如果冠军槽位已经有队伍，则将现有队伍移回可选队伍列表，并只保留新拖入的队伍
            if (champion.value.length > 1) {
                const oldChampionIndex = champion.value.findIndex(t => t.id !== addedTeam.id);
                if (oldChampionIndex !== -1) {
                    const oldChampion = champion.value.splice(oldChampionIndex, 1)[0];
                    teams.value.push(oldChampion);
                    teams.value.sort((a, b) => a.id - b.id);
                }
            }
        } else if (e.removed) {
            // 如果一个队伍从冠军槽位中被移除（例如，被拖出或明确移除）
            // 确保它被返回到主队伍列表（如果它不在那里）
            const removedTeam = e.removed.element;
            if (!teams.value.some(t => t.id === removedTeam.id)) {
                teams.value.push(removedTeam);
                teams.value.sort((a, b) => a.id - b.id);
            }
        }
    }
};

// 从槽位中移除队伍
function removeTeam(stage: string, teamId: number) {
    const targetList = getStageList(stage);
    const index = targetList.value.findIndex(t => t.id === teamId);
    if (index !== -1) {
        const removedTeam = targetList.value.splice(index, 1)[0];
        // 如果是从冠军槽位移除，将其重新添加到可选队伍列表
        if (stage === 'champion') {
            teams.value.push(removedTeam);
            // 按照ID排序，保持一致性
            teams.value.sort((a, b) => a.id - b.id);
        }
    }
}

// 添加保存预测函数
const saveChampionPrediction = async () => {
    if (champion.value.length !== 1) {
        ElMessage.warning('请选择一支冠军队伍！');
        return;
    }

    try {
        const predictionData = {
            matchId: props.matchId,
            phase: 'champion',
            // 冠军竞猜只提交champion，其他阶段为空
            s_l: '', 
            l_s: '',
            advance: [champion.value[0].id], // 将 champion ID 放入 advance 数组
            champion: '', // 将 champion 字段设置为空字符串
        };
        const response = await matchAPI.submitPrediction(predictionData);
        ElMessage.success('冠军预测保存成功！');
    } catch (error: any) {
        if (error.response?.status === 401) {
            ElMessage.warning('请先登录后再进行预测！');
            return;
        }
        console.error('保存冠军预测失败:', error);
        ElMessage.error('保存冠军预测失败！');
    }
};

// 暴露数据给父组件
defineExpose({
    getPredictData() {
        return {
            champion: champion.value
        }
    },
    fetchTeams,
    fetchUserPrediction,
    saveChampionPrediction // Expose the save function
})

</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MajorChampion',
});
</script>

<style lang="scss" scoped>
.major-champion {
    padding: 20px;
    box-sizing: border-box;
    color: #fff;
    background-size: cover;

    .title {
        text-align: center;
        color: #fff;
        font-size: 28px;
        margin-bottom: 30px;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    }

    .team-card {
        width: 100%;
        height: auto; /* Ensure height is auto */
        /* height: 100%; */ /* Removed fixed height */
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.15);
        color: #eee;
        font-size: 13px;
        transition: all 0.2s ease-in-out;
        border: 1px solid rgba(255, 255, 255, 0.2);
        cursor: grab;
        display: flex;
        align-items: center;
        padding: 0 8px;
        box-sizing: border-box;

        &:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-2px);
        }

        &.selected {
            border-color: #3fa7ff;
            background: rgba(63, 167, 255, 0.2); // Add background for selected state
        }

        &.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
        }

        .team-logo {
            width: 44px;
            height: 44px;
            margin-right: 8px;
            object-fit: contain;
        }

        .team-name {
            font-size: large;
            flex-grow: 1;
            overflow: hidden;
            // text-overflow: ellipsis;
            white-space: nowrap;
        }

        .remove-btn {
            background: none;
            color: #ff4d4f;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 0 4px;

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        }
    }
}

.bracket-container {
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Set align-items to flex-start */
    gap: 0;
    padding: 20px 0;
    overflow-x: auto;
    border-radius: 12px;
}

/* ===================== 连接线结构 ===================== */

.bracket-stage {
    display: flex;
    flex-direction: column;
    align-items: center;

    .stage-title {
        font-size: 18px;
        margin-bottom: 15px;
        color: #fff;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    }

    .matches {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .match {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Ensure items start from the top */
        justify-content: flex-start;
        /* flex-grow: 1; */ /* Removed flex-grow */
    }

    .slot {
        z-index: 2;
        width: 180px;
        /* height: 40px; */ /* Removed fixed height */
        border: 1px dashed rgba(255, 255, 255, 0.4);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        position: relative;
        /* overflow: hidden; */ /* Removed overflow: hidden */
        margin-bottom: 4px;

        &.teams-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 16px;
            width: 100%;
            min-height: unset; /* Ensure no minimum height constraint */
            height: auto; /* Allow height to adjust based on content */
            padding: 16px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
        }

        &.champion-slot {
            width: 200px;
            height: 50px;
            display: flex; /* Added display flex */
            align-items: center; /* Added align-items center */
            justify-content: center; /* Added justify-content center */
            .empty-slot {
                font-size: 32px;
            }
        }
    }

    .empty-slot {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.6);
        font-size: 24px;
        padding: 0 10px;
        box-sizing: border-box;
    }

    .matches .match:nth-child(2n)::before {
        display: block;
    }
    .matches .match:nth-child(2n-1)::before {
        display: none;
    }
}

.connector-column {
    position: relative;
    width: 60px;
    min-width: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    .connector {
        position: absolute;
        left: 0;
        top: 50%;
        width: 60px;
        height: 2px;
        background: #409eff;
        z-index: 1;
    }
    .connector::after {
        content: '';
        position: absolute;
        left: 60px;
        top: -40px;
        width: 2px;
        height: 80px;
        background: #409eff;
        z-index: 1;
    }
    &.second .connector {
        top: 50%;
        width: 60px;
        height: 2px;
    }
    &.second .connector::after {
        height: 180px;
        top: -90px;
    }
    &.third .connector {
        top: 50%;
        width: 80px;
        height: 2px;
        left: 0;
    }
    &.third .connector::after {
        display: none;
    }
}

.champion-stage {
    .matches {
        margin-top: 0;
        align-items: center;
    }
}

/* ===================== 响应式 ===================== */

@media screen and (max-width: 768px) {
    .major-champion {
        padding: 10px;
        .title {
            color: white;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .team-card {
            width: auto;
            height: 35px;
            font-size: 11px;
            .team-logo {
                width: 20px;
                height: 20px;
                margin-right: 5px;
            }
            .remove-btn {
                font-size: 14px;
            }
        }
    }
    .bracket-container {
        flex-direction: column;
        align-items: center;
        gap: 20px;
        padding: 10px 0;
    }
    .bracket-stage {
        width: 100%;
        align-items: stretch;
        .stage-title {
            text-align: center;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .matches {
            gap: 15px;
        }
        .match {
            margin-bottom: 0;
            /* min-height: 60px; */ /* Removed fixed min-height */
        }
        .slot {
            width: 100%;
            /* height: 35px; */ /* Removed fixed height */
            border-radius: 4px;
            &.teams-grid {
                grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                gap: 12px;
                padding: 12px;
                min-height: unset; /* Ensure no minimum height constraint */
                height: auto; /* Allow height to adjust based on content */
            }
            .team-card {
                padding: 0 5px;
                .team-logo {
                    width: 28px;
                    height: 28px;
                }
                .team-name {
                    font-size: 13px;
                }
                .remove-btn {
                    font-size: 12px;
                }
            }
            &.champion-slot {
                height: 45px;
                .empty-slot {
                    font-size: 28px;
                }
            }
        }
        .empty-slot {
            font-size: 18px;
        }
       
        .match::before {
            left: 108px;
        }
    }
    .connector-column {
        width: 30px;
        min-width: 30px;
        .connector {
            width: 30px;
        }
        .connector::after {
            left: 30px;
            height: 40px;
            top: -20px;
        }
        &.second .connector {
            width: 30px;
        }
        &.second .connector::after {
            height: 90px;
            top: -45px;
        }
        &.third .connector {
            width: 40px;
            left: 0;
        }
    }
    .champion-stage {
        .matches {
            margin-top: 0;
        }
    }
}

@media screen and (max-width: 375px) {
    .major-champion {
        .title {
            font-size: 20px;
            margin-bottom: 15px;
        }
        .team-card {
            width: 70px;
            height: 30px;
            font-size: 9px;
            .team-logo {
                width: 18px;
                height: 18px;
            }
        }
    }
    .bracket-container {
        gap: 15px;
    }
    .bracket-stage {
        .stage-title {
            font-size: 15px;
            margin-bottom: 8px;
        }
        .matches {
            gap: 10px;
        }
        .slot {
            /* height: 30px; */ /* Removed fixed height */
            &.teams-grid {
                grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
                gap: 8px;
                padding: 8px;
                min-height: unset; /* Ensure no minimum height constraint */
                height: auto; /* Allow height to adjust based on content */
            }
            &.champion-slot {
                height: 40px;
                .empty-slot {
                    font-size: 24px;
                }
            }
        }
        .empty-slot {
            font-size: 16px;
        }
        
        .match::before {
            left: 53px;
        }
    }
    .connector-column {
        width: 15px;
        min-width: 15px;
        .connector {
            width: 15px;
        }
        .connector::after {
            left: 15px;
            height: 20px;
            top: -10px;
        }
        &.second .connector::after {
            height: 40px;
            top: -20px;
        }
        &.third .connector {
            width: 20px;
        }
    }
}

/* Save button style */
.save-button {
    margin-top: 20px;
    text-align: center;
}
</style>
