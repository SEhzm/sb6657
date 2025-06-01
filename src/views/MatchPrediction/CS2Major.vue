<template>
    <div class="major-container">
        <div v-if="isLoading" class="loading-container">
            <el-skeleton :rows="3" animated />
        </div>
        <template v-else-if="matchId">
            <div class="tab-buttons">
                <button :class="{ active: currentTab === 'onePhase' }" @click="currentTab = 'onePhase'">
                    第一阶段
                    <div class="countdown" v-if="currentTab === 'onePhase'">
                        {{ getCountdown('onePhase') }}
                    </div>
                </button>
                <button :class="{ active: currentTab === 'twoPhase' }" @click="currentTab = 'twoPhase'">
                    第二阶段
                    <div class="countdown" v-if="currentTab === 'twoPhase'">
                        {{ getCountdown('twoPhase') }}
                    </div>
                </button>
                <button :class="{ active: currentTab === 'threePhase' }" @click="currentTab = 'threePhase'">
                    第三阶段
                    <div class="countdown" v-if="currentTab === 'threePhase'">
                        {{ getCountdown('threePhase') }}
                    </div>
                </button>
                <button :class="{ active: currentTab === 'champion' }" @click="currentTab = 'champion'">
                    冠军组
                    <div class="countdown" v-if="currentTab === 'champion'">
                        {{ getCountdown('champion') }}
                    </div>
                </button>
            </div>

            <div v-if="currentTab === 'onePhase'" class="major-section">
                <div class="time-info">
                    <p>竞猜时间：{{ formatTimeRange('onePhase') }}</p>
                </div>
                <MajorPhase ref="onePhaseRef" :isTimeValid="isTimeValid('onePhase')" :matchId="matchId" phase="onePhase" />
            </div>

            <div v-if="currentTab === 'twoPhase'" class="major-section">
                <div class="time-info">
                    <p>竞猜时间：{{ formatTimeRange('twoPhase') }}</p>
                </div>
                <MajorPhase ref="twoPhaseRef" :isTimeValid="isTimeValid('twoPhase')" :matchId="matchId" phase="twoPhase" />
            </div>

            <div v-if="currentTab === 'threePhase'" class="major-section">
                <div class="time-info">
                    <p>竞猜时间：{{ formatTimeRange('threePhase') }}</p>
                </div>
                <MajorPhase ref="threePhaseRef" :isTimeValid="isTimeValid('threePhase')" :matchId="matchId" phase="threePhase" />
            </div>

            <div v-if="currentTab === 'champion'" class="major-section">
                <div class="time-info">
                    <p>竞猜时间：{{ formatTimeRange('champion') }}</p>
                </div>
                <MajorPhase ref="championRef" :isTimeValid="isTimeValid('champion')" :matchId="matchId" phase="champion" />
            </div>
        </template>
        <div v-else class="no-match">
            <el-empty description="暂无可用赛事" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import MajorPhase from './MajorPhase.vue'
import { useRoute } from 'vue-router'
import httpInstance from '@/apis/httpInstance'
import { ElMessage } from 'element-plus'

const route = useRoute()
const matchId = ref<number | null>(null)
const isLoading = ref(true)
const currentTab = ref('onePhase')
const onePhaseRef = ref()
const twoPhaseRef = ref()
const threePhaseRef = ref()
const championRef = ref()
const countdownTimer = ref<number | null>(null)
const matchInfo = ref<any>(null)

// 定义各阶段的时间限制
const timeLimits = ref({
    onePhase: {
        start: new Date(),
        end: new Date()
    },
    twoPhase: {
        start: new Date(),
        end: new Date()
    },
    threePhase: {
        start: new Date(),
        end: new Date()
    },
    champion: {
        start: new Date(),
        end: new Date()
    }
})

// 格式化日期时间显示
const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Shanghai'
    }).replace(/\//g, '年').replace(',', '日 ')
}

// 格式化时间范围显示
const formatTimeRange = (phase: keyof typeof timeLimits.value) => {
    const { start, end } = timeLimits.value[phase]
    return `${formatDateTime(start.toISOString())} - ${formatDateTime(end.toISOString())}`
}

// 获取赛事信息
const fetchMatchId = async () => {
    try {
        isLoading.value = true
        const response = await httpInstance.get('/machine/matches')
        if (response.data && response.data.length > 0) {
            const match = response.data[0]
            matchId.value = match.id
            matchInfo.value = match
            
            // 设置各阶段的时间限制
            const predictStartTime = new Date(match.predictStartTime)
            const predictEndTime = new Date(match.predictEndTime)
            const startTime = new Date(match.startTime)
            const endTime = new Date(match.endTime)
            
            // 根据比赛时间设置各阶段的时间限制
            // 第一阶段：预测开始时间到第一阶段结束
            timeLimits.value.onePhase = {
                start: predictStartTime,
                end: predictEndTime // 使用后端返回的预测结束时间
            }
            
            // 第二阶段：比赛开始后到第二阶段结束
            const twoPhaseStart = new Date(startTime)
            twoPhaseStart.setHours(8, 0, 0, 0) // 设置为当天8:00
            const twoPhaseEnd = new Date(startTime)
            twoPhaseEnd.setDate(twoPhaseEnd.getDate() + 1) // 设置为第二天
            twoPhaseEnd.setHours(23, 0, 0, 0) // 设置为23:00
            
            timeLimits.value.twoPhase = {
                start: twoPhaseStart,
                end: twoPhaseEnd
            }
            
            // 第三阶段：第二阶段结束后到第三阶段结束
            const threePhaseStart = new Date(twoPhaseEnd)
            threePhaseStart.setDate(threePhaseStart.getDate() + 3) // 第二阶段结束后3天
            threePhaseStart.setHours(8, 0, 0, 0) // 设置为8:00
            const threePhaseEnd = new Date(threePhaseStart)
            threePhaseEnd.setDate(threePhaseEnd.getDate() + 1) // 设置为第二天
            threePhaseEnd.setHours(23, 0, 0, 0) // 设置为23:00
            
            timeLimits.value.threePhase = {
                start: threePhaseStart,
                end: threePhaseEnd
            }
            
            // 冠军组：第三阶段结束后到比赛结束
            timeLimits.value.champion = {
                start: new Date(threePhaseEnd),
                end: endTime // 使用比赛结束时间
            }
            
            console.log('比赛信息:', match)
            console.log('时间限制设置:', timeLimits.value)
        } else {
            ElMessage.error('未找到可用赛事')
        }
    } catch (error) {
        console.error('获取赛事ID失败:', error)
        ElMessage.error('获取赛事ID失败')
    } finally {
        isLoading.value = false
    }
}

// 检查当前时间是否在有效范围内
const isTimeValid = (phase: keyof typeof timeLimits.value) => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }))
    const { start, end } = timeLimits.value[phase]
    return now >= start && now <= end
}

// 获取倒计时显示
const getCountdown = (phase: keyof typeof timeLimits.value) => {
    const now = new Date()
    const { start, end } = timeLimits.value[phase]
    
    if (now < start) {
        const diff = start.getTime() - now.getTime()
        return `距离开始还有 ${formatCountdown(diff)}`
    } else if (now > end) {
        return '竞猜已结束'
    } else {
        const diff = end.getTime() - now.getTime()
        return `距离结束还有 ${formatCountdown(diff)}`
    }
}

// 格式化倒计时显示
const formatCountdown = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    
    return `${days}天${hours}小时${minutes}分${seconds}秒`
}

// 更新倒计时
const updateCountdown = () => {
    currentTab.value = currentTab.value // 触发重新渲染
}

// 监听matchId变化，重新获取数据
watch(matchId, (newId) => {
    if (newId) {
        // 根据当前标签页重新获取数据
        switch (currentTab.value) {
            case 'onePhase':
                onePhaseRef.value?.fetchTeams()
                break
            case 'twoPhase':
                twoPhaseRef.value?.fetchTeams()
                break
            case 'threePhase':
                threePhaseRef.value?.fetchTeams()
                break
            case 'champion':
                championRef.value?.fetchTeams()
                break
        }
    }
})

// 监听标签页变化
watch(currentTab, (newTab) => {
    if (matchId.value) {
        // 切换标签页时重新获取数据
        switch (newTab) {
            case 'onePhase':
                onePhaseRef.value?.fetchTeams()
                break
            case 'twoPhase':
                twoPhaseRef.value?.fetchTeams()
                break
            case 'threePhase':
                threePhaseRef.value?.fetchTeams()
                break
            case 'champion':
                championRef.value?.fetchTeams()
                break
        }
    }
})

onMounted(async () => {
    await fetchMatchId()
    countdownTimer.value = window.setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
    if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
    }
})

// 暴露数据给父组件
defineExpose({
    getPredictData() {
        return {
            onePhase: onePhaseRef.value?.getPredictData(),
            twoPhase: twoPhaseRef.value?.getPredictData(),
            threePhase: threePhaseRef.value?.getPredictData(),
            champion: championRef.value?.getPredictData()
        }
    }
})
</script>

<style lang="scss" scoped>
.major-container {
    position: relative;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        // background: rgba(0, 0, 0, 0.6);
        z-index: 1;
    }

    >* {
        position: relative;
        z-index: 2;
    }
}

.tab-buttons {
    color: white;
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;

    button {
        padding: 8px 24px;
        font-size: 16px;
        border: 2px solid #3fa7ff;
        background: transparent;
        color: #3fa7ff;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(4px);
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        &:hover {
            // background: rgba(63, 167, 255, 0.2);
        }

        &.active {
            // background: #3fa7ff;
            color: white;
        }
    }
}

.major-section {

    background: rgba(255, 255, 255, 0);
    border-radius: 12px;
    padding: 20px;
}

.countdown {
    font-size: 12px;
    color: #ffd700;
    margin-top: 4px;
}

.time-info {
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    color: #fff;
    text-align: center;
    
    p {
        margin: 0;
        font-size: 14px;
    }
}

@media screen and (max-width: 768px) {
    .major-container {
        min-height: 100%;
        padding: 12px;
    }

    .tab-buttons {
        gap: 12px;
        margin-bottom: 16px;

        button {
            padding: 6px 16px;
            font-size: 14px;
        }
    }

    .major-section {
        padding: 16px;
    }
}

.loading-container {
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
}

.no-match {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    margin: 20px;
}
</style>