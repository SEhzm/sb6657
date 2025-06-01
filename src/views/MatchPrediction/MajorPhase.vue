<template>
    <div class="major-phase" v-loading="isLoading" element-loading-text="加载队伍数据中...">
        <h2 class="title">{{ phaseTitle }}竞猜</h2>
        <MatchPredictionBase ref="predictRef" :teams="teams" first-label="3-0" second-label="0-3"
            advance-label="3-2或3-1晋级的7支队伍" :max-advance="7" :isTimeValid="isTimeValid"
            @update:firstTeam="firstTeam = $event"
            @update:secondTeam="secondTeam = $event"
            @update:advanceTeams="advanceTeams = $event" />
        <div class="save-button">
            <el-button @click="savePrediction">保存预测</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import type { Team } from './Base.vue'
import MatchPredictionBase from './Base.vue'
import { matchAPI } from '@/apis/match'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps<{
    isTimeValid: boolean,
    matchId: number,
    phase: 'onePhase' | 'twoPhase' | 'threePhase' | 'champion'  // 添加阶段属性
}>()

// 计算阶段标题
const phaseTitle = computed(() => {
    const titles = {
        onePhase: '第一阶段',
        twoPhase: '第二阶段',
        threePhase: '第三阶段',
        champion: '冠军组'
    }
    return titles[props.phase]
})

const authStore = useAuthStore()
const predictRef = ref()
const firstTeam = ref<Team[]>([])
const secondTeam = ref<Team[]>([])
const advanceTeams = ref<Team[]>([])
const teams = ref<Team[]>([])
const isLoading = ref(false)
const isInitialLoading = ref(false)

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
        console.log('触发防抖保存...');
        savePrediction();
    }
}, 300);

// 使用 watch 监听 predictRef 中暴露的预测数据变化
watch(predictRef, (newPredictRef) => {
    if (newPredictRef) {
        // 监听所有数组的变化
        watch(
            [
                () => newPredictRef.firstTeam,
                () => newPredictRef.secondTeam,
                () => newPredictRef.advanceTeams
            ],
            ([newFirst, newSecond, newAdvance]) => {
                // 更新本地数据
                firstTeam.value = [...newFirst];
                secondTeam.value = [...newSecond];
                advanceTeams.value = [...newAdvance];
                
                // 只有在非加载状态下且非初始加载时才触发保存
                if (!isLoading.value && !isInitialLoading.value && props.isTimeValid) {
                    debouncedSave();
                }
            },
            { deep: true }
        );
    }
}, { immediate: true });

// 获取队伍池数据
const fetchTeams = async () => {
    try {
        isLoading.value = true
        console.log(`获取${phaseTitle.value}队伍数据，matchId:`, props.matchId);
        const response = await matchAPI.getMatchTeams(props.matchId, props.phase)
        console.log("获取到的原始数据:", response.data);
        
        teams.value = response.data.map((team: any) => ({
            id: team.id,
            name: team.teamName,
            logo: team.teamImgUrl
        }))
        console.log("处理后的队伍数据:", teams.value);
        
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
    
    if (!authStore || authStore.userId === null) {
        console.warn('用户信息未加载，跳过获取预测数据');
        return;
    }

    try {
        isInitialLoading.value = true;
        isLoading.value = true;
        if (teams.value.length === 0) {
            await fetchTeams();
        }

        const response = await matchAPI.getUserPredictions({ 
            matchId: props.matchId, 
            phase: props.phase, 
            userId: authStore.userId 
        })
        
        if (response.data) {
            // 确保我们有一个有效的预测记录
            let prediction = Array.isArray(response.data) ? response.data[0] : response.data;
            
            // 用于存储已选队伍的ID
            const selectedTeamIds = new Set<string>();
            
            // 根据预测数据填充队伍，使用ID匹配
            if (prediction.sl) {
                const team = teams.value.find(t => t.id.toString() === prediction.sl)
                if (team) {
                    firstTeam.value = [team]
                    selectedTeamIds.add(team.id.toString())
                }
            }
            if (prediction.ls) {
                const team = teams.value.find(t => t.id.toString() === prediction.ls)
                if (team) {
                    secondTeam.value = [team]
                    selectedTeamIds.add(team.id.toString())
                }
            }
            if (prediction.advance) {
                const advanceTeamIds = prediction.advance.split(',')
                const matchedTeams = teams.value.filter(t => 
                    advanceTeamIds.includes(t.id.toString())
                )
                advanceTeams.value = matchedTeams
                // 将晋级队伍ID添加到已选集合中
                matchedTeams.forEach(team => selectedTeamIds.add(team.id.toString()))
            }
            
            // 从队伍池中移除已选的队伍
            teams.value = teams.value.filter(team => !selectedTeamIds.has(team.id.toString()))
            
            // 强制更新组件数据
            if (predictRef.value) {
                predictRef.value.firstTeam = [...firstTeam.value]
                predictRef.value.secondTeam = [...secondTeam.value]
                predictRef.value.advanceTeams = [...advanceTeams.value]
            }
        } else {
            console.log('未找到用户之前的预测数据');
        }
    } catch (error) {
        console.error('获取预测数据失败:', error)
        ElMessage.error('获取预测数据失败')
    } finally {
        isLoading.value = false;
        // 延迟清除初始加载标志，确保数据更新完成
        setTimeout(() => {
            isInitialLoading.value = false;
        }, 100);
    }
}

// 保存预测数据
const savePrediction = async () => {
    try {
        const predictionData = {
            matchId: props.matchId,
            phase: props.phase,
            s_l: firstTeam.value[0]?.id?.toString() || '',
            l_s: secondTeam.value[0]?.id?.toString() || '',
            advance: advanceTeams.value.map(t => t.id)
        }
        await matchAPI.submitPrediction(predictionData)
        ElMessage.success('预测数据保存成功')
    } catch (error) {
        console.error('保存预测数据失败:', error)
        ElMessage.error('保存预测数据失败')
    }
}

// 组件挂载时获取数据
onMounted(async () => {
    if (props.matchId) {
        await fetchTeams()
        await fetchUserPrediction()
    }
})

// 暴露数据给父组件
defineExpose({
    getPredictData() {
        return {
            firstTeam: firstTeam.value,
            secondTeam: secondTeam.value,
            advanceTeams: advanceTeams.value
        }
    },
    fetchTeams,
    fetchUserPrediction,
    savePrediction
})
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'MajorPhase',
});
</script>

<style lang="scss" scoped>
.major-phase {
    .title {
        text-align: center;
        color: white;
        font-size: 24px;
        margin-bottom: 24px;
    }

    /* 添加保存按钮样式 */
    .save-button {
        margin-top: 20px;
        text-align: center;
    }
}

@media screen and (max-width: 768px) {
    .major-phase {
        .title {
            font-size: 20px;
            margin-bottom: 16px;
        }
    }
}
</style> 