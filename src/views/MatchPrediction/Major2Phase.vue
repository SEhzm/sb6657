<template>
    <div class="major-second" v-loading="isLoading" element-loading-text="加载队伍数据中...">
        <h2 class="title">第二阶段竞猜</h2>
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
import { ref, onMounted, watch } from 'vue'
import type { Team } from './Base.vue'
import MatchPredictionBase from './Base.vue'
import { matchAPI } from '@/apis/match'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps<{
    isTimeValid: boolean,
    matchId: number
}>()

const authStore = useAuthStore()
const predictRef = ref()
const firstTeam = ref<Team[]>([])
const secondTeam = ref<Team[]>([])
const advanceTeams = ref<Team[]>([])
const teams = ref<Team[]>([])
const isLoading = ref(false)

// 使用 watch 监听 predictRef 中暴露的预测数据变化
watch(predictRef, (newPredictRef) => {
    if (newPredictRef) {
        watch([newPredictRef.firstTeam, newPredictRef.secondTeam, newPredictRef.advanceTeams],
            ([newFirst, newSecond, newAdvance]) => {
                // 当预测数据变化时，更新本地的 ref
                firstTeam.value = newFirst;
                secondTeam.value = newSecond;
                advanceTeams.value = newAdvance;

                // 数据变化时自动保存
                if (props.isTimeValid) {
                    console.log('预测数据变化，自动保存...');
                    savePrediction();
                }
            }, { deep: true, immediate: true } // 深度监听并立即执行一次
        );
    }
}, { immediate: true }); // 立即执行一次，以监听 predictRef 本身的变化

// 获取队伍池数据
const fetchTeams = async () => {
    try {
        isLoading.value = true
        console.log("获取第二阶段队伍数据，matchId:", props.matchId);
        const response = await matchAPI.getMatchTeams(props.matchId,'twoPhase')
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
    
    // 确保 authStore 已初始化且 userId 存在
    if (!authStore || authStore.userId === null) {
        console.warn('用户信息未加载，跳过获取预测数据');
        return;
    }

    try {
        const response = await matchAPI.getUserPredictions({ matchId: props.matchId, phase: 'twoPhase', userId: authStore.userId })
        
        if (response.data && response.data.length > 0) {
            const prediction = response.data[0]
            if (prediction.s_l) {
                const team = teams.value.find(t => t.name === prediction.s_l)
                if (team) firstTeam.value = [team]
            }
            if (prediction.l_s) {
                const team = teams.value.find(t => t.name === prediction.l_s)
                if (team) secondTeam.value = [team]
            }
            if (prediction.advance) {
                const advanceTeamNames = prediction.advance.split(',')
                advanceTeams.value = teams.value.filter(t => 
                    advanceTeamNames.includes(t.name)
                )
            }
        } else {
            console.log('未找到用户之前的预测数据');
        }
    } catch (error) {
        console.error('获取预测数据失败:', error)
        ElMessage.error('获取预测数据失败')
    }
}

// 保存预测数据
const savePrediction = async () => {
    try {
        const predictionData = {
            matchId: props.matchId,
            phase: 'twoPhase',
            s_l: firstTeam.value[0]?.name || '',
            l_s: secondTeam.value[0]?.name || '',
            advance: advanceTeams.value.map(t => t.id)
        }
        
        await matchAPI.submitPrediction(predictionData)
        ElMessage.success('预测数据保存成功')
    } catch (error) {
        console.error('保存预测数据失败:', error)
        ElMessage.error('保存预测数据失败')
    }
}

// 监听预测数据变化 (保留此函数，但现在主要通过 watch 来更新本地 ref)
const updatePredictData = () => {
    const ref = predictRef.value
    if (ref) {
        firstTeam.value = [...ref.firstTeam]
        secondTeam.value = [...ref.secondTeam]
        advanceTeams.value = [...ref.advanceTeams]
        // 自动保存逻辑已移至 watch 中
        // if (props.isTimeValid) {
        //     savePrediction()
        // }
    } else {
        console.warn("predictRef is null in updatePredictData");
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
        updatePredictData()
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
  name: 'MajorSecond',
});
</script>

<style lang="scss" scoped>
.major-second {
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
    .major-second {
        .title {
            font-size: 20px;
            margin-bottom: 16px;
        }
    }
}
</style> 