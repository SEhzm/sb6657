<template>
    <div class="major-third" v-loading="isLoading" element-loading-text="加载队伍数据中...">
        <h2 class="title">第三阶段竞猜</h2>
        <MatchPredictionBase ref="predictRef" :teams="teams" first-label="3-0" second-label="0-3"
            advance-label="3-2或3-1晋级的7支队伍" :max-advance="7" :isTimeValid="isTimeValid"
             @update:firstTeam="firstTeam = $event"
            @update:secondTeam="secondTeam = $event"
            @update:advanceTeams="advanceTeams = $event" />
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
const finalTeams = ref<Team[]>([])
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

const fetchTeams = async () => {
    try {
        isLoading.value = true
        console.log("获取第三阶段队伍数据，matchId:", props.matchId);
        const response = await matchAPI.getMatchTeams(props.matchId,'threePhase')
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
        const response = await matchAPI.getUserPredictions({ matchId: props.matchId, phase: 'threePhase', userId: authStore.userId })
        
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

const savePrediction = async () => {
    try {
        const predictionData = {
            matchId: props.matchId,
            phase: 'threePhase',
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

onMounted(async () => {
    if (props.matchId) {
        await fetchTeams()
        await fetchUserPrediction()
    }
})

defineExpose({
    getPredictData() {
        updatePredictData()
        return {
            firstTeam: firstTeam.value,
            secondTeam: secondTeam.value,
            advanceTeams: advanceTeams.value,
            finalTeams: finalTeams.value
        }
    },
    fetchTeams,
    fetchUserPrediction
})
</script>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MajorThird',
});
</script>

<style lang="scss" scoped>
.major-third {
    .title {
        text-align: center;
        color: white;
        font-size: 24px;
        margin-bottom: 24px;
    }

    .final-teams {
        margin-top: 32px;
        padding: 16px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;

        h3 {
            color: white;
            font-size: 18px;
            margin-bottom: 16px;
            text-align: center;
        }

        .team-list {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            justify-content: center;
        }

        .team-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 4px;
            cursor: move;

            .team-logo {
                width: 48px;
                height: 48px;
                object-fit: contain;
            }

            .team-name {
                color: white;
                font-size: 14px;
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .major-third {
        .title {
            font-size: 20px;
            margin-bottom: 16px;
        }

        .final-teams {
            margin-top: 24px;
            padding: 12px;

            h3 {
                font-size: 16px;
                margin-bottom: 12px;
            }

            .team-list {
                gap: 12px;
            }

            .team-item {
                padding: 6px;

                .team-logo {
                    width: 36px;
                    height: 36px;
                }

                .team-name {
                    font-size: 12px;
                }
            }
        }
    }
}
</style> 