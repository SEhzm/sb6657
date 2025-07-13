<template>
    <div class="major-phase" v-loading="isLoading" element-loading-text="加载队伍数据中...">
        <h2 class="title">{{ phaseTitle }}竞猜作业</h2>
        <MatchPredictionBase ref="predictRef" :teams="teams" first-label="全胜晋级" second-label="全败出局"
            advance-label="晋级的另外6支队伍" :max-advance="6" :isTimeValid="isTimeValid"
            @update:firstTeam="firstTeam = $event"
            @update:secondTeam="secondTeam = $event"
            @update:advanceTeams="advanceTeams = $event" />
        <div class="save-button">
            <el-button @click="validateAndSavePrediction" :disabled="!isTimeValid">保存预测</el-button>
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
import { isRelogin } from '@/apis/httpInstance'

const props = defineProps<{
    isTimeValid: boolean,
    matchId: number,
    phase: 'onePhase' | 'twoPhase' | 'threePhase'  // 移除champion阶段
}>()

// 计算阶段标题
const phaseTitle = computed(() => {
    const titles = {
        onePhase: '第一阶段',
        twoPhase: '第二阶段',
        threePhase: '第三阶段'
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
        validateAndSavePrediction();
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

    try {
        isInitialLoading.value = true
        isLoading.value = true
        if (teams.value.length === 0) {
            await fetchTeams()
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
                const teamIds = prediction.sl.split(',')
                const matchedTeams = teams.value.filter(t => 
                    teamIds.includes(t.id.toString())
                )
                firstTeam.value = matchedTeams
                matchedTeams.forEach(team => selectedTeamIds.add(team.id.toString()))
            }
            if (prediction.ls) {
                const teamIds = prediction.ls.split(',')
                const matchedTeams = teams.value.filter(t => 
                    teamIds.includes(t.id.toString())
                )
                secondTeam.value = matchedTeams
                matchedTeams.forEach(team => selectedTeamIds.add(team.id.toString()))
            }
            if (prediction.advance) {
                const advanceTeamIds = prediction.advance.split(',')
                const matchedTeams = teams.value.filter(t => 
                    advanceTeamIds.includes(t.id.toString())
                )
                advanceTeams.value = matchedTeams
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
        setTimeout(() => {
            isInitialLoading.value = false
        }, 100)
    }
}

// 添加校验函数
const validatePrediction = () => {
    const errors: string[] = []
    
    // 检查3-0队伍是否已选择2支
    if (firstTeam.value.length !== 2) {
        errors.push('请选择2支3-0队伍')
    }
    
    // 检查0-3队伍是否已选择2支
    if (secondTeam.value.length !== 2) {
        errors.push('请选择2支0-3队伍')
    }
    
    // 检查晋级队伍是否已选择6支
    if (advanceTeams.value.length !== 6) {
        errors.push('请选择6支晋级队伍')
    }
    
    return errors
}

// 修改保存预测函数
const validateAndSavePrediction = async () => {
    // 检查预测数据，但只显示提示不阻止保存
    const errors = validatePrediction()
    if (errors.length > 0) {
        ElMessage.warning(errors.join('\n'))
    }
    
    try {
        const predictionData = {
            matchId: props.matchId,
            phase: props.phase,
            s_l: firstTeam.value.map(t => t.id.toString()).join(','),  // 修改为保存两个3-0队伍
            l_s: secondTeam.value.map(t => t.id.toString()).join(','), // 修改为保存两个0-3队伍
            advance: advanceTeams.value.map(t => t.id)
        }
        const response = await matchAPI.submitPrediction(predictionData)
        ElMessage.success('预测数据保存成功')
    } catch (error: any) {
        // 检查是否是401未授权错误
        if (error.response?.status === 401) {
            ElMessage.warning('请先登录后再进行预测')
            return
        }
        console.error('保存预测数据失败:', error)
        ElMessage.error('保存预测数据失败')
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
    validateAndSavePrediction
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
        color: #000 !important;  // 强制黑色
        font-size: 24px;
        margin-bottom: 24px;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    :deep(.predict-label) {
        color: #000 !important;  // 强制黑色
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    :deep(.advance-label) {
        color: #000 !important;  // 强制黑色
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
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