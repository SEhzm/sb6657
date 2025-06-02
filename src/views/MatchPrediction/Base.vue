<template>
    <div class="major-predict-root">
        <!-- 队伍池 -->
        <div class="team-pool">
            <draggable :list="teamPool" :group="dragGroup" :sort="false" item-key="id" class="team-list"
                ghost-class="ghost" :disabled="!isTimeValid">
                <template #item="{ element }">
                    <div class="team-card" :class="{ 'disabled': !isTimeValid }" :key="element.id">
                        <img :src="element.logo" :alt="element.name" class="team-logo" />
                        <div class="team-name">{{ element.name }}</div>
                    </div>
                </template>
            </draggable>
        </div>

        <!-- 预测区 -->
        <div class="predict-area">
            <div class="predict-row">
                <div class="predict-block">
                    <div class="predict-label">{{ firstLabel }}</div>
                    <draggable :list="firstTeam" :group="dragGroup" :sort="false" item-key="id" class="predict-slot big"
                        ghost-class="ghost" :move="moveFirst" @change="onChangeFirst" :disabled="!isTimeValid">
                        <template #item="{ element, index }">
                            <div class="team-card selected big" :class="{ 'disabled': !isTimeValid }" :key="element.id">
                                <img :src="element.logo" :alt="element.name" class="team-logo big" />
                                <div class="team-name">{{ element.name }}</div>
                                <button class="remove-btn" @click.stop="removeTeam('first', index)" :disabled="!isTimeValid">×</button>
                            </div>
                        </template>
                        <template #footer>
                            <div v-for="i in (2 - firstTeam.length)" :key="i" class="empty-slot big">?</div>
                        </template>
                    </draggable>
                </div>
                <div class="predict-block">
                    <div class="predict-label">{{ secondLabel }}</div>
                    <draggable :list="secondTeam" :group="dragGroup" :sort="false" item-key="id" class="predict-slot big"
                        ghost-class="ghost" :move="moveSecond" @change="onChangeSecond" :disabled="!isTimeValid">
                        <template #item="{ element, index }">
                            <div class="team-card selected big" :class="{ 'disabled': !isTimeValid }" :key="element.id">
                                <img :src="element.logo" :alt="element.name" class="team-logo big" />
                                <div class="team-name">{{ element.name }}</div>
                                <button class="remove-btn" @click.stop="removeTeam('second', index)" :disabled="!isTimeValid">×</button>
                            </div>
                        </template>
                        <template #footer>
                            <div v-for="i in (2 - secondTeam.length)" :key="i" class="empty-slot big">?</div>
                        </template>
                    </draggable>
                </div>
            </div>
            <div class="predict-row advance-row">
                <div class="advance-label">{{ advanceLabel }}</div>
                <draggable :list="advanceTeams" :group="dragGroup" :sort="true" item-key="id"
                    class="predict-slot multi big" ghost-class="ghost" :move="moveAdvance" @change="onChangeAdvance" :disabled="!isTimeValid">
                    <template #item="{ element, index }">
                        <div class="team-card selected big" :class="{ 'disabled': !isTimeValid }" :key="element.id">
                            <img :src="element.logo" :alt="element.name" class="team-logo big" />
                            <div class="team-name">{{ element.name }}</div>
                            <button class="remove-btn" @click.stop="removeAdvanceTeam(index)" :disabled="!isTimeValid">×</button>
                        </div>
                    </template>
                    <template #footer>
                        <div v-for="i in (maxAdvance - advanceTeams.length)" :key="i" class="empty-slot big">?</div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue'
import draggable from 'vuedraggable'

export interface Team {
    id: number
    name: string
    logo: string
}

const props = defineProps<{
    teams: Team[]
    firstLabel: string
    secondLabel: string
    advanceLabel: string
    maxAdvance: number
    isTimeValid: boolean
}>()

const dragGroup = { name: 'teams' }
const teamPool = ref<Team[]>([])
const firstTeam = ref<Team[]>([])
const secondTeam = ref<Team[]>([])
const advanceTeams = ref<Team[]>([])

// 使用 watch 监听 props.teams 的变化并更新 teamPool
watch(() => props.teams, (newTeams) => {
    teamPool.value = [...newTeams];
}, { immediate: true }); // immediate: true 会在组件初始化时立即执行一次

// 移动规则
function moveFirst(e: any) {
    const t: Team = e.draggedContext.element
    if (fromIsPool(e.from) && isTeamSelected(t.id)) return false
    return true
}

function moveSecond(e: any) {
    const t: Team = e.draggedContext.element
    if (fromIsPool(e.from) && isTeamSelected(t.id)) return false
    return true
}

function moveAdvance(e: any) {
    const t: Team = e.draggedContext.element
    if (fromIsPool(e.from) && isTeamSelected(t.id)) return false
    return true
}

function fromIsPool(from: HTMLElement) {
    return from && from.classList && from.classList.contains('team-list')
}

function isTeamSelected(id: number) {
    return (
        firstTeam.value.some(t => t.id === id) ||
        secondTeam.value.some(t => t.id === id) ||
        advanceTeams.value.some(t => t.id === id)
    )
}

// 变更处理
function onChangeFirst(e: any) {
    if (e.added) {
        const addedTeam = e.added.element
        if (firstTeam.value.length > 2) {
            const removed = firstTeam.value.splice(0, 1)
            teamPool.value.push(...removed)
        }
        secondTeam.value = secondTeam.value.filter(t => t.id !== addedTeam.id)
        advanceTeams.value = advanceTeams.value.filter(t => t.id !== addedTeam.id)
    }
    syncTeamPool()
}

function onChangeSecond(e: any) {
    if (e.added) {
        const addedTeam = e.added.element
        if (secondTeam.value.length > 2) {
            const removed = secondTeam.value.splice(0, 1)
            teamPool.value.push(...removed)
        }
        firstTeam.value = firstTeam.value.filter(t => t.id !== addedTeam.id)
        advanceTeams.value = advanceTeams.value.filter(t => t.id !== addedTeam.id)
    }
    syncTeamPool()
}

function onChangeAdvance(e: any) {
    if (e.added) {
        const addedTeam = e.added.element
        if (advanceTeams.value.length > props.maxAdvance) {
            const removed = advanceTeams.value.splice(0, 1)
            teamPool.value.push(...removed)
        }
        firstTeam.value = firstTeam.value.filter(t => t.id !== addedTeam.id)
        secondTeam.value = secondTeam.value.filter(t => t.id !== addedTeam.id)
    }
    syncTeamPool()
}

// 移除处理
function removeTeam(type: 'first' | 'second', index: number) {
    let removed: Team[]
    if (type === 'first') {
        removed = firstTeam.value.splice(index, 1)
    } else {
        removed = secondTeam.value.splice(index, 1)
    }
    teamPool.value.push(...removed)
    syncTeamPool()
}

function removeAdvanceTeam(index: number) {
    const removed = advanceTeams.value.splice(index, 1)
    teamPool.value.push(...removed)
    syncTeamPool()
}

// 同步队伍池
function syncTeamPool() {
    nextTick(() => {
        const selectedIds = [
            ...firstTeam.value.map(t => t.id),
            ...secondTeam.value.map(t => t.id),
            ...advanceTeams.value.map(t => t.id)
        ]
        teamPool.value = teamPool.value.filter(t => !selectedIds.includes(t.id))
    })
}

// 暴露数据给父组件
defineExpose({
    firstTeam,
    secondTeam,
    advanceTeams
})
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'MatchPredictionBase'
})

</script>

<style lang="scss" scoped>
.major-predict-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    box-sizing: border-box;
}

.team-pool {
    max-width: 1200px;
    margin-bottom: 24px;
    padding: 0 16px;
    box-sizing: border-box;
}

.team-list {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    min-height: 100px;
    justify-content: center;
    background: #f5f5f5;
    flex-wrap: wrap;
}

.team-card {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #333;
    font-size: 14px;
    cursor: grab;
    border: 2px solid transparent;
    background: #ffebeb;
    position: relative;
    flex-shrink: 0;

    &.selected {
        border: 2px solid #3fa7ff;
    }

    &.big {
        width: 90px;
        height: 90px;
        font-size: 16px;
    }

    &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    }

    .remove-btn {
        position: absolute;
        top: 2px;
        right: 2px;
        background: #ff4d4f;
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        padding: 0;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
}

.team-logo {
    width: 40px;
    height: 40px;
    margin-bottom: 6px;
    object-fit: contain;

    &.big {
        width: 50px;
        height: 50px;
    }
}

.predict-area {
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 16px;
    box-sizing: border-box;
    min-height: 100%;
}

.predict-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
    flex-wrap: wrap;

    &:first-child {
        justify-content: center;
        gap: 40px;
        flex-wrap: nowrap;
    }

    &.advance-row {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }
}

.predict-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: 400px;
}

.predict-label {
    color: white;
    font-size: 18px;
    text-align: center;
    margin-bottom: 4px;
}

.predict-slot {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f5f5f5;
    border-radius: 12px;
    min-height: 90px;
    min-width: 90px;
    padding: 12px;
    flex: 1;
    justify-content: center;
    flex-wrap: wrap;


    &.multi {
        min-width: 100%;
        max-width: 100%;
    }

    &.big {
        min-width: 220px;
        min-height: 110px;
    }
}

.empty-slot {
    width: 90px;
    height: 90px;
    border-radius: 8px;
    color: #bbb;
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #ccc;
    background: #fff;
    flex-shrink: 0;

    &.big {
        width: 110px;
        height: 110px;
    }
}

.advance-label {
    color: white;
    font-size: 18px;
    text-align: center;
    margin-bottom: 4px;
}

.ghost {
    opacity: 0.5;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
    .major-predict-root {
        padding: 12px 0;
    }

    .team-pool {
        margin-bottom: 16px;
        padding: 0 12px;
    }

    .team-list {
        gap: 8px;
        padding: 12px;
    }

    .team-card {
        width: 70px;
        height: 70px;
        font-size: 12px;

        &.big {
            width: 80px;
            height: 80px;
            font-size: 14px;
        }
    }

    .team-logo {
        width: 36px;
        height: 36px;
        margin-bottom: 4px;

        &.big {
            width: 44px;
            height: 44px;
        }
    }

    .predict-area {
        gap: 16px;
        padding: 0 12px;
    }

    .predict-row {
        gap: 12px;

        &:first-child {
            gap: 20px;
            flex-wrap: wrap;
        }

        &.advance-row {
            gap: 8px;
        }
    }

    .predict-block {
        max-width: 100%;
    }

    .predict-label {
        font-size: 16px;
    }

    .predict-slot {
        padding: 8px;
        gap: 6px;

        &.big {
            min-width: 110px;
        }
    }

    .empty-slot {
        width: 80px;
        height: 80px;
        font-size: 28px;
    }

    .remove-btn {
        width: 18px;
        height: 18px;
        font-size: 14px;
    }

    .advance-label {
        font-size: 16px;
    }
}

/* 小屏幕手机适配 */
@media screen and (max-width: 375px) {
    .team-card {
        width: 60px;
        height: 60px;
        font-size: 11px;

        &.big {
            width: 70px;
            height: 70px;
            font-size: 12px;
        }
    }

    .team-logo {
        width: 32px;
        height: 32px;

        &.big {
            width: 40px;
            height: 40px;
        }
    }

    .empty-slot {
        width: 70px;
        height: 70px;
        font-size: 24px;
    }
}
</style> 