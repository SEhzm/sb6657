<template>
    <article class="container">
        <header class="header">
            <div class="header-top">
                <div class="title-section">
                    <h1 class="title">🦐超级逮虾户战报第59期🦐</h1>
                </div>
                <div class="author-section">
                    <span class="author-label">作者：</span>
                    <div class="author-links">
                        <a href="https://space.bilibili.com/505122023" target="_blank">bilibili: @Mr_皮乐</a>
                        <a href="https://tieba.baidu.com/home/main?id=tb.1.e7e1a59e.6wTN3gPNJQkiSeJQQkzyow"
                            target="_blank">贴吧: @浪泼独流</a>
                        <a href="https://news.wmpvp.com/community-detail.html?id=347406749" target="_blank">完美:
                            @永远喜欢尼古拉科维奇</a>
                    </div>
                </div>
            </div>
            <div class="match-info">
                <h3 class="match-title">裂变天地S2淘汰赛 Falcons战胜paiN</h3>
                <span class="match-date">2025-09-20</span>
            </div>
        </header>
        <section class="briefing">
            <div class="briefing-content">
                本场比赛paiN战队无人对位优于NiKo，本期榜单无变化。
            </div>
        </section>
        <section class="main-content">
            <div v-if="dejaVuType === 0" class="ranking-section">
                <div class="section-header">
                    <h3 class="section-title">目前美味鲜虾点数排行榜(top30):</h3>
                    <div class="section-actions">
                        <button class="btn-link" @click="showDialog(title1, text1)">鲜虾点数计算规则</button>
                        <button class="btn-switch" @click="changeDejaVuType(1)">切换到非top30版</button>
                    </div>
                </div>
                <div class="ranking-table">
                    <table>
                        <tbody>
                            <tr v-for="item in top30Rankings" :key="item.rank">
                                <td>{{ item.rank }}</td>
                                <td>{{ item.player }}</td>
                                <td>{{ item.team }}</td>
                                <td v-html="item.emoji + '👉🦐👈'"></td>
                                <td>{{ item.points }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-if="dejaVuType === 1" class="ranking-section">
                <div class="section-header">
                    <h3 class="section-title">非top30版荣誉提名鲜虾榜:</h3>
                    <div class="section-actions">
                        <button class="btn-link" @click="showDialog(title1, text1)">鲜虾点数计算规则</button>
                        <button class="btn-switch" @click="changeDejaVuType(0)">切换到top30版</button>
                    </div>
                </div>
                <div class="ranking-table">
                    <table>
                        <tbody>
                            <tr v-for="item in nonTop30Rankings" :key="item.rank">
                                <td>{{ item.rank }}</td>
                                <td>{{ item.player }}</td>
                                <td>{{ item.team }}</td>
                                <td v-html="item.emoji + '👉🦐👈'"></td>
                                <td>{{ item.points }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="ranking-section">
                <div class="section-header">
                    <h3 class="section-title">目前虾钳反夹，痛风点数榜:</h3>
                    <div class="section-actions">
                        <button class="btn-link" @click="showDialog(title2, text2)">痛风点数计算规则</button>
                    </div>
                </div>
                <div class="ranking-table">
                    <table>
                        <tbody>
                            <tr v-for="item in goutRankings" :key="item.rank">
                                <td>{{ item.rank }}</td>
                                <td>{{ item.player }}</td>
                                <td>{{ item.team }}</td>
                                <td v-html="item.emoji"></td>
                                <td>{{ item.points }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="ranking-section">
                <div class="section-header">
                    <h3 class="section-title">捕虾战队哪家强：捕虾队评级</h3>
                    <div class="section-actions">
                        <span class="rule-text">规则：只会评级和Falcons有重复交手记录的队伍。</span>
                    </div>
                </div>
                <div class="ranking-table team-rating-table">
                    <table>
                        <tbody>
                            <tr v-for="item in teamRatings" :key="item.team">
                                <td>{{ item.team }}</td>
                                <td>{{ item.score }}</td>
                                <td>{{ item.opponent }}</td>
                                <td>{{ item.rating }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
        <section class="commentary">
            <h3 class="commentary-title">野榜杂谈</h3>
            <div class="commentary-content">
                🦐哥下令，熬夜的兄弟们可以早睡。老尼这么c，那还说了啥，😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐😙🦐对mvp绝对的有利竞争者尼古拉科维奇，全力开孝。
            </div>
        </section>
        <el-dialog class="dialog" v-model="dialogVisible" :title="dialogTitle" width="50%">
            <p>{{ dialogText }}</p>
        </el-dialog>
    </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogText = ref('')
const showDialog = (title: string, text: string) => {
    dialogTitle.value = title
    dialogText.value = text
    dialogVisible.value = true
}

const title1 = '鲜虾点数计算规则'
const text1 = '每场比赛对位优于NiKo时，对位差大于等于3计1点，每额外超过3再多计1点。若本场比赛未有人对位优于NiKo，则无人获得鲜虾点数。(分为top30版和非top30荣誉提名版)'

const title2 = '痛风点数计算规则'
const text2 = '每场比赛的(24年)top30选手对位劣于NiKo时，对位差大于等于3计1点，每额外超过3再多计1点。若本场比赛未有top30选手或未有对位劣于NiKo的top30选手，则无人获得痛风点数。'

const dejaVuType = ref(0)
function changeDejaVuType(type: number) {
    dejaVuType.value = type
}

// Top30版鲜虾点数排行榜
const top30Rankings = [
    { rank: '1', player: 'Jimpphat', team: 'MOUZ', emoji: '🐱', points: '3(5-2)点' },
    { rank: '2', player: 'XANTARES', team: 'Aurora', emoji: '😡', points: '3(4-1)点' },
    { rank: '3', player: 'ropz', team: 'Vitality', emoji: '🚘', points: '2(3-1)点' },
    { rank: '4', player: 'Senzu', team: 'MGLZ', emoji: '😋', points: '2点' },
    { rank: '5', player: 'NertZ', team: 'Liquid', emoji: '😋', points: '2点' },
    { rank: '6', player: 'KSCERATO', team: 'FURIA', emoji: '😋', points: '1点' },
    { rank: '7', player: 'donk', team: 'Spirit', emoji: '🕳', points: '1点' },
    { rank: '8', player: 'frozen', team: 'FaZe', emoji: '🥶', points: '1(2-1)点' }
]

// 非top30版荣誉提名鲜虾榜
const nonTop30Rankings = [
    { rank: '1', player: 'latto', team: 'Legacy', emoji: '😋', points: '2点' },
    { rank: '2', player: 'apEX', team: 'Vitality', emoji: '&#x1FAD8', points: '2(3-1)点' },
    { rank: '3', player: 'YEKINDAR', team: 'FURIA', emoji: '😋', points: '2点' },
    { rank: '4', player: 'nicx', team: 'PUA', emoji: '😋', points: '2点' },
    { rank: '5', player: 'Graviti', team: '3DMAX', emoji: '😋', points: '2点' },
    { rank: '6', player: 'wicadia', team: 'Aurora', emoji: '🎁', points: '2点' },
    { rank: '7', player: 'jottAAA', team: 'Aurora', emoji: '😋', points: '1(2-1)点' },
    { rank: '8', player: 'FalleN', team: 'FURIA', emoji: '😋', points: '1点' },
    { rank: '9', player: 'mzinho', team: 'MGLZ', emoji: '😋', points: '1(2-1)点' },
    { rank: '10', player: 'ztr', team: 'GL', emoji: '🐷', points: '1(2-1)点' },
    { rank: '11', player: 'Lucaozy', team: 'Fluxo', emoji: '😋', points: '1点' },
    { rank: '12', player: 'C4LLM3SU3', team: 'LVG', emoji: '😋', points: '1点' },
    { rank: '13', player: 'acoR', team: 'm1x', emoji: '😋', points: '1点' },
    { rank: '14', player: 'xfl0ud', team: 'HEROIC', emoji: '😋', points: '1点' },
    { rank: '15', player: 'LNZ', team: 'HEROIC', emoji: '😋', points: '1点' },
    { rank: '16', player: 'Jeorge', team: 'NRG', emoji: '😋', points: '1点' },
    { rank: '17', player: 'sl3nd', team: 'benched', emoji: '😋', points: '1(2-1)点' },
    { rank: '18', player: 'cej0t', team: '9INE', emoji: '😋', points: '1点' },
    { rank: '19', player: 'story', team: 'SAW', emoji: '😋', points: '1点' },
    { rank: '20', player: 'hallzerk', team: 'PUA', emoji: '😋', points: '1点' },
    { rank: '21', player: 'Grim', team: 'PUA', emoji: '😋', points: '1点' },
    { rank: '22', player: 'FL1t', team: 'VP', emoji: '👼', points: '1点' },
    { rank: '23', player: 'FL4MUS', team: 'benched', emoji: '😎', points: '1点' },
    { rank: '24', player: 'ICY', team: 'VP', emoji: '🧊', points: '1点' },
    { rank: '25', player: 'Lucky', team: '3DMAX', emoji: '🤬', points: '1点' },
    { rank: '26', player: 'Ex3rcice', team: '3DMAX', emoji: '😋', points: '1点' },
    { rank: '27', player: 'jabbi', team: 'Astralis', emoji: '🐭', points: '1点' },
    { rank: '28', player: 'sdy', team: 'ENCE', emoji: '😋', points: '1点' }
]

// 痛风点数榜
const goutRankings = [
    { rank: '1', player: 'broky', team: 'FaZe', emoji: '🦞👉📦', points: '6点' },
    { rank: '2', player: 'woxic', team: 'Aurora', emoji: '🦞👉 &#x1FAF2', points: '3(1-4)点' },
    { rank: '3', player: 'Brollan', team: 'MOUZ', emoji: '🦞👉💵', points: '3(1-4)点' },
    { rank: '4', player: 'malbsMd', team: 'G2', emoji: '🦞👉🐴', points: '3点' },
    { rank: '5', player: 'flameZ', team: 'Vitality', emoji: '🦞👉🔥', points: '2点' },
    { rank: '6', player: 'w0nderful', team: 'NAVI', emoji: '🦞👉🧨', points: '2点' },
    { rank: '7', player: 'EliGE', team: 'benched', emoji: '🦞👉🐔', points: '2点' },
    { rank: '8', player: 'device', team: 'Astralis', emoji: '🦞👉😨', points: '2点' },
    { rank: '9', player: 'ZywOo', team: 'Vitality', emoji: '🦞👉🍠', points: '1(2-3)点' },
    { rank: '10', player: 'torzsi', team: 'MOUZ', emoji: '🦞👉🧦', points: '1(3-4)点' },
    { rank: '11', player: 'xertioN', team: 'MOUZ', emoji: '🦞👉🦀', points: '1(2-3)点' },
    { rank: '12', player: 'sh1ro', team: 'Spirit', emoji: '🦞👉🧟‍♂️', points: '1点' },
    { rank: '13', player: 'NAF', team: 'Liquid', emoji: '🦞👉🦥', points: '1点' },
    { rank: '14', player: 'stavn', team: 'Astralis', emoji: '🦞👉🐍', points: '1点' }
]

// 捕虾队评级
const teamRatings = [
    { team: 'Vitality', score: '4:1', opponent: 'Falcons', rating: '专业捕虾队' },
    { team: 'Aurora', score: '4:1', opponent: 'Falcons', rating: '专业捕虾队' },
    { team: 'MOUZ', score: '4:4', opponent: 'Falcons', rating: '入门捕虾队' },
    { team: 'FURIA', score: '1:1', opponent: 'Falcons', rating: '入门捕虾队' },
    { team: 'MGLZ', score: '1:1', opponent: 'Falcons', rating: '入门捕虾队' },
    { team: 'paiN', score: '1:1', opponent: 'Falcons', rating: '入门捕虾队' },
    { team: 'VP', score: '1:1', opponent: 'Falcons', rating: '入门捕虾队' },
    { team: 'G2', score: '1:2', opponent: 'Falcons', rating: '劣质捕虾队' },
    { team: 'GL', score: '1:4', opponent: 'Falcons', rating: '被钳破船队' },
    { team: 'FaZe', score: '0:4', opponent: 'Falcons', rating: '浮游生物队' }
]

</script>

<style lang="scss" scoped>
.container {
    max-width: 1000px;
    margin: 0 auto;
    background-color: #ffffff;
    border: 1px solid #cccccc;
    font-family: "Microsoft YaHei", "SimSun", Arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #333333;
    margin-bottom: 40px;
}

// Header 样式
.header {
    background-color: #f5f5f5;
    border-bottom: 2px solid #0066cc;
    padding: 15px 20px;

    .header-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 15px;
        gap: 20px;

        @media (max-width: 768px) {
            flex-direction: column;
            gap: 15px;
        }

        .title-section {
            flex: 1;

            .title {
                margin: 0;
                font-size: 26px;
                font-weight: bold;
                color: #cc6600;
                line-height: 1.3;

                @media (max-width: 768px) {
                    font-size: 18px;
                }
            }
        }

        .author-section {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;

            @media (max-width: 768px) {
                align-items: flex-start;
                width: 100%;
            }

            .author-label {
                font-weight: bold;
                color: #666666;
                font-size: 13px;
            }

            .author-links {
                display: flex;
                flex-direction: column;
                gap: 4px;

                a {
                    color: #0066cc;
                    text-decoration: none;
                    font-size: 12px;

                    &:hover {
                        text-decoration: underline;
                        color: #004499;
                    }
                }
            }
        }
    }

    .match-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 10px;
        border-top: 1px solid #dddddd;

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }

        .match-title {
            margin: 0;
            font-size: 20px;
            font-weight: bolder;
            color: #333333;
        }

        .match-date {
            color: #666666;
            font-size: 12px;
            font-style: italic;
        }
    }
}

// 简报样式
.briefing {
    background-color: #ffffcc;
    border: 1px solid #ffcc00;
    margin: 0;
    padding: 15px 20px;

    .briefing-content {
        font-weight: bold;
        color: #cc6600;
        text-align: center;
        font-size: 15px;
    }
}

// 主要内容样式
.main-content {
    padding: 20px 20px 0 20px;
}

// 排行榜区域样式
.ranking-section {
    margin-bottom: 30px;
    border: 1px solid #dddddd;
    background-color: #fafafa;

    .section-header {
        background-color: #E6E6E6;
        border-bottom: 1px solid #cccccc;
        padding: 12px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;

        .section-title {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
        }

        .section-actions {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;

            .btn-link {
                background: none;
                border: none;
                color: #0066cc;
                text-decoration: underline;
                cursor: pointer;
                font-size: 12px;
                padding: 0;

                &:hover {
                    color: #004499;
                }
            }

            .btn-switch {
                background-color: #0066cc;
                color: white;
                border: 1px solid #0066cc;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;

                &:hover {
                    background-color: #004499;
                    border-color: #004499;
                }
            }

            .rule-text {
                font-size: 12px;
                color: #666666;
                font-style: italic;
            }
        }
    }

    .ranking-table {
        padding: 15px;
        background-color: #ffffff;
        overflow-x: auto;

        @media (max-width: 768px) {
            padding: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-family: "Courier New", monospace;
            font-size: 14px;

            @media (max-width: 768px) {
                font-size: 13px;
            }

            td {
                padding: 8px 12px;
                text-align: left;
                border-bottom: 1px solid #e0e0e0;
                vertical-align: middle;
            }

            tbody tr:hover {
                background-color: #f9f9f9;
            }

            tbody tr:nth-child(even) {
                background-color: #fafafa;
            }

            // 列宽控制
            td:nth-child(1) { // 排名
                width: 60px;
                text-align: center;
            }

            td:nth-child(2) { // 选手
                width: 120px;
                font-weight: 500;
            }

            td:nth-child(3) { // 队伍
                width: 100px;
            }

            td:nth-child(4) { // 表情
                width: 80px;
                text-align: center;
            }

            td:nth-child(5) { // 点数
                width: 100px;
                text-align: center;
                font-weight: 500;
            }
        }

        // 捕虾队评级表格的特殊样式
        &.team-rating-table table {
            td:nth-child(1) { // 队伍
                width: 100px;
                font-weight: 500;
            }

            td:nth-child(2) { // 比分
                width: 80px;
                text-align: center;
                font-weight: 500;
            }

            td:nth-child(3) { // 对手
                width: 100px;
            }

            td:nth-child(4) { // 评级
                width: 120px;
                text-align: center;
                font-weight: 500;
            }
        }
    }
}

.commentary {
    background-color: #E6E6E6;
    border: 1px solid #b0d4f1;
    margin: 20px;
    padding: 0;

    .commentary-title {
        background-color: #d6ebff;
        border-bottom: 1px solid #b0d4f1;
        margin: 0;
        padding: 12px 15px;
        font-size: 16px;
        font-weight: bold;
        color: #0066cc;
    }

    .commentary-content {
        padding: 15px;
        line-height: 1.8;
        color: #333333;
        text-indent: 2em;
    }
}

// 响应式调整
@media (max-width: 768px) {
    .container {
        margin: 0;
        border-left: none;
        border-right: none;
    }

    .header {
        padding: 12px 15px;
    }

    .briefing {
        padding: 12px 15px;
    }

    .main-content {
        padding: 15px;
    }

    .commentary {
        margin: 15px;
    }
}

@media (max-width: 480px) {
    .ranking-section .section-header {
        flex-direction: column;
        align-items: flex-start;

        .section-actions {
            width: 100%;
            justify-content: flex-start;
        }
    }
}

:deep(.dialog) {
    width: 90%;
    max-width: 600px;

    .el-dialog__header {
        font-weight: bold;
    }
    .el-dialog__body {
        padding: 15px;
    }
}
</style>
