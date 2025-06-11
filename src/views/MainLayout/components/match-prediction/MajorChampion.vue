<template>
    <div class="major-champion">
        <h2 class="title">冠军竞猜</h2>

        <div class="bracket-container">
            <!-- 四分之一决赛 -->
            <div class="bracket-stage">
                <div class="stage-title">四分之一决赛</div>
                <div class="matches">
                    <div class="match">
                        <draggable id="quarters1" :list="quarters1" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'quarters1')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('quarters1', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="quarters1.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                        
                        <draggable id="quarters2" :list="quarters2" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'quarters2')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('quarters2', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="quarters2.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                    </div>
                    <div class="match">
                        <draggable id="quarters3" :list="quarters3" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'quarters3')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('quarters3', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="quarters3.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                        
                        <draggable id="quarters4" :list="quarters4" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'quarters4')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('quarters4', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="quarters4.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                    </div>
                    <div class="match">
                         <draggable id="quarters5" :list="quarters5" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'quarters5')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('quarters5', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="quarters5.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                        
                        <draggable id="quarters6" :list="quarters6" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'quarters6')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('quarters6', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="quarters6.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                    </div>
                     <div class="match">
                         <draggable id="quarters7" :list="quarters7" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'quarters7')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('quarters7', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="quarters7.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                        
                        <draggable id="quarters8" :list="quarters8" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'quarters8')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('quarters8', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="quarters8.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </div>

            <!-- 连接线到半决赛 -->
             <div class="connector-column">
               
                 <div class="connector-gap"></div>
                 
            </div>

            <!-- 半决赛 -->
            <div class="bracket-stage">
                 <div class="stage-title">半决赛</div>
                <div class="matches">
                     <div class="match">
                        <draggable id="semis1" :list="semis1" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'semis1')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('semis1', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="semis1.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                         
                        <draggable id="semis2" :list="semis2" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'semis2')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('semis2', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="semis2.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                    </div>
                     <div class="match">
                        <draggable id="semis3" :list="semis3" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'semis3')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('semis3', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="semis3.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                         
                        <draggable id="semis4" :list="semis4" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'semis4')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('semis4', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="semis4.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </div>

             <!-- 连接线到总决赛 -->
             <div class="connector-column  ">
                <div ></div>
            </div>

            <!-- 总决赛 -->
            <div class="bracket-stage">
                 <div class="stage-title">总决赛</div>
                 <div class="matches">
                     <div class="match">
                         <draggable id="finals1" :list="finals1" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'finals1')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('finals1', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="finals1.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                         
                         <draggable id="finals2" :list="finals2" :group="dragGroup" item-key="id" class="slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'finals2')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('finals2', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="finals2.length === 0" class="empty-slot">待定</div>
                            </template>
                        </draggable>
                     </div>
                 </div>
            </div>

             <!-- 连接线到冠军 -->
             <div class="connector-column third">
                
            </div>

            <!-- 冠军 -->
            <div class="bracket-stage champion-stage">
                 <div class="stage-title">冠军</div>
                 <div class="matches">
                      <draggable id="champion" :list="champion" :group="dragGroup" item-key="id" class="slot champion-slot" ghost-class="ghost" @change="(e) => handleBracketChange(e, 'champion')" :move="moveTeamToSlot" :max="1" :disabled="!isTimeValid">
                            <template #item="{ element }">
                                <div class="team-card selected" :class="{ 'disabled': !isTimeValid }">
                                    <img :src="element.logo" :alt="element.name" class="team-logo" />
                                    <div class="team-name">{{ element.name }}</div>
                                    <button class="remove-btn" @click.stop="removeTeam('champion', element.id)" :disabled="!isTimeValid">×</button>
                                </div>
                            </template>
                            <template #footer>
                                <div v-if="champion.length === 0" class="empty-slot champion-empty">待定</div>
                            </template>
                        </draggable>
                 </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import type { Team } from './Base.vue'
import MatchPredictionBase from './Base.vue'

const props = defineProps<{
    isTimeValid: boolean
}>()

const dragGroup = { name: 'teams' }

const predictRef = ref()
const firstTeam = ref<Team[]>([])
const secondTeam = ref<Team[]>([])
const advanceTeams = ref<Team[]>([])

// 队伍假数据 (实际应替换为晋级淘汰赛的队伍)
const allTeams: Team[] = [
    { id: 1, name: 'Team A', logo: 'https://img-cdn.hltv.org/teamlogo/4411.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 2, name: 'Team B', logo: 'https://img-cdn.hltv.org/teamlogo/4608.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 3, name: 'Team C', logo: 'https://img-cdn.hltv.org/teamlogo/9565.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 4, name: 'Team D', logo: 'https://img-cdn.hltv.org/teamlogo/5995.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 5, name: 'Team E', logo: 'https://img-cdn.hltv.org/teamlogo/4869.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 6, name: 'Team F', logo: 'https://img-cdn.hltv.org/teamlogo/4494.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 7, name: 'Team G', logo: 'https://img-cdn.hltv.org/teamlogo/10603.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 8, name: 'Team H', logo: 'https://img-cdn.hltv.org/teamlogo/10603.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 9, name: 'Team I', logo: 'https://img-cdn.hltv.org/teamlogo/4411.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 10, name: 'Team J', logo: 'https://img-cdn.hltv.org/teamlogo/4608.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 11, name: 'Team K', logo: 'https://img-cdn.hltv.org/teamlogo/9565.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 12, name: 'Team L', logo: 'https://img-cdn.hltv.org/teamlogo/5995.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 13, name: 'Team M', logo: 'https://img-cdn.hltv.org/teamlogo/4869.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 14, name: 'Team N', logo: 'https://img-cdn.hltv.org/teamlogo/4494.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 15, name: 'Team O', logo: 'https://img-cdn.hltv.org/teamlogo/10603.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' },
    { id: 16, name: 'Team P', logo: 'https://img-cdn.hltv.org/teamlogo/10603.thumb.png?ixlib=java-2.1.0&s=9c1c8c5c5c5c5c5c5c5c5c5c5c5c5c5c5' }
];

// 淘汰赛阶段列表 - 初始为空数组
const quarters1 = ref<Team[]>([]);
const quarters2 = ref<Team[]>([]);
const quarters3 = ref<Team[]>([]);
const quarters4 = ref<Team[]>([]);
const quarters5 = ref<Team[]>([]);
const quarters6 = ref<Team[]>([]);
const quarters7 = ref<Team[]>([]);
const quarters8 = ref<Team[]>([]);
const semis1 = ref<Team[]>([]);
const semis2 = ref<Team[]>([]);
const semis3 = ref<Team[]>([]);
const semis4 = ref<Team[]>([]);
const finals1 = ref<Team[]>([]);
const finals2 = ref<Team[]>([]);
const champion = ref<Team[]>([]);

// 根据阶段名称获取对应的列表
const getStageList = (stage: string) => {
    switch (stage) {
        case 'quarters1': return quarters1;
        case 'quarters2': return quarters2;
        case 'quarters3': return quarters3;
        case 'quarters4': return quarters4;
        case 'quarters5': return quarters5;
        case 'quarters6': return quarters6;
        case 'quarters7': return quarters7;
        case 'quarters8': return quarters8;
        case 'semis1': return semis1;
        case 'semis2': return semis2;
        case 'semis3': return semis3;
        case 'semis4': return semis4;
        case 'finals1': return finals1;
        case 'finals2': return finals2;
        case 'champion': return champion;
        default: return ref([]);
    }
}

// 允许队伍拖拽到下一个阶段或四分之一决赛
const moveTeamToSlot = (e: any) => {
    const dragListId = e.from.parentElement.id; // 队伍拖拽来源列表的 ID
    const dropListId = e.to.parentElement.id; // 队伍放置目标列表的 ID

    // 防止从无效位置拖拽或拖拽到无效位置
     if (!dragListId || !dropListId) return false;

    // 允许在同一个列表中重新排序
    if (dragListId === dropListId) return true;

    // 允许从四分之一决赛拖拽到半决赛
    if (dragListId.startsWith('quarters') && dropListId.startsWith('semis')) {
        const quarterIndex = parseInt(dragListId.replace('quarters', ''));
        const semiIndex = parseInt(dropListId.replace('semis', ''));
        // 检查是否拖拽到正确的下一个阶段槽位
        if (Math.ceil(quarterIndex / 2) === semiIndex) return true;
    }

    // 允许从半决赛拖拽到总决赛
     if (dragListId.startsWith('semis') && dropListId.startsWith('finals')) {
        const semiIndex = parseInt(dragListId.replace('semis', ''));
        const finalIndex = parseInt(dropListId.replace('finals', ''));
         // 检查是否拖拽到正确的下一个阶段槽位
         if (Math.ceil(semiIndex / 2) === finalIndex) return true;
    }

    // 允许从总决赛拖拽到冠军槽位
     if (dragListId.startsWith('finals') && dropListId === 'champion') return true;

    // 允许从任何位置拖拽到四分之一决赛槽位（作为起始点）
     if (dropListId.startsWith('quarters')) return true;

    return false; // 阻止其他所有移动
};

// 处理淘汰赛阶段列表的变化 (队伍被添加/移除)
const handleBracketChange = (e: any, stage: string) => {
    const targetList = getStageList(stage);

    if (e.added) {
        const addedTeam = e.added.element;

        // 从任何其他淘汰赛槽位中移除被添加的队伍，确保唯一性
        const allBracketLists = [
            quarters1, quarters2, quarters3, quarters4, quarters5, quarters6, quarters7, quarters8,
            semis1, semis2, semis3, semis4,
            finals1, finals2,
            champion
        ];
        allBracketLists.forEach(listRef => {
            if (listRef !== targetList) {
                const index = listRef.value.findIndex(t => t.id === addedTeam.id);
                if (index !== -1) {
                    listRef.value.splice(index, 1);
                }
            }
        });
    }

    // 队伍不会回到队伍池，所以移除时不需要特殊处理
};

// 从槽位中移除队伍
function removeTeam(stage: string, teamId: number) {
    const targetList = getStageList(stage);
    const index = targetList.value.findIndex(t => t.id === teamId);
    if (index !== -1) {
        targetList.value.splice(index, 1);
    }
}

// 监听预测数据变化
const updatePredictData = () => {
    const ref = predictRef.value
    if (ref) {
        firstTeam.value = [...ref.firstTeam]
        secondTeam.value = [...ref.secondTeam]
        advanceTeams.value = [...ref.advanceTeams]
    }
}

// 暴露数据给父组件
defineExpose({
    getPredictData() {
        updatePredictData()
        return {
            firstTeam: firstTeam.value,
            secondTeam: secondTeam.value,
            advanceTeams: advanceTeams.value
        }
    }
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
        height: 100%;
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
        }

        &.disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
        }

        .team-logo {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            object-fit: contain;
        }

        .team-name {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
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
    align-items: center;
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
        align-items: flex-start;
        justify-content: center;
        min-height: 100px; /* 保证成对对战有可视空间 */
    }

    .slot {
        z-index: 2;
        width: 180px;
        height: 40px;
        border: 1px dashed rgba(255, 255, 255, 0.4);
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        margin-bottom: 4px;

        &.champion-slot {
            width: 200px;
            height: 50px;
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
            width: 80px;
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
            min-height: 60px;
        }
        .slot {
            width: 100%;
            height: 35px;
            border-radius: 4px;
            .team-card {
                padding: 0 5px;
                .team-logo {
                    width: 20px;
                    height: 20px;
                }
                .team-name {
                    font-size: 10px;
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
            height: 30px;
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
</style>
