<template>
    <article class="container">
        <header class="header">
            <div class="header-top">
                <div class="title-section">
                    <h1 class="title">🦐超级逮虾户战报第58期🦐</h1>
                </div>
                <div class="author-section">
                    <span class="author-label">作者：</span>
                    <div class="author-links">
                        <a href="https://space.bilibili.com/505122023" target="_blank">bilibili: @Mr_皮乐</a>
                        <a href="https://tieba.baidu.com/home/main?id=tb.1.e7e1a59e.6wTN3gPNJQkiSeJQQkzyow" target="_blank">贴吧: @浪泼独流</a>
                        <a href="https://news.wmpvp.com/community-detail.html?id=347406749" target="_blank">完美: @永远喜欢尼古拉科维奇</a>
                    </div>
                </div>
            </div>
            <div class="match-info">
                <h3 class="match-title">裂变天地S2 Falcons战胜FaZe</h3>
                <span class="match-date">2025-09-16</span>
            </div>
        </header>
        <section class="briefing">
            <div class="briefing-content">
                本场比赛FaZe战队无人对位优于NiKo，broky(3:9)获得2点痛风点数。
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
                <div class="ranking-list">
                    1.Jimpphat(MOUZ)🐱👉🦐👈3(5-2)点 <br />
                    2.XANTARES(Aurora)😡👉🦐👈3(4-1)点<br />
                    3.ropz(Vitality) 🚘👉🦐👈2(3-1)点<br />
                    4.Senzu(MGLZ) 😋👉🦐👈2点<br />
                    5.NertZ(Liquid) 😋👉🦐👈2点<br />
                    6.KSCERATO(FURIA)😋👉🦐👈1点<br />
                    7.donk(Spirit) 🕳👉🦐👈1点<br />
                    8.frozen(FaZe) 🥶👉🦐👈1(2-1)点<br />
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
                <div class="ranking-list">
                    1.latto(Legacy) 😋👉🦐👈2点<br />
                    2.apEX(Vitality) &#x1FAD8 2(3-1)点<br />
                    3.YEKINDAR(FURIA)😋👉🦐👈2点<br />
                    4.尼克斯(PUA) 😋👉🦐👈2点<br />
                    5.Graviti(3DMAX) 😋👉🦐👈2点<br />
                    6.wicadia(Aurora)🎁👉🦐👈2点<br />
                    7.jottAAA(Aurora)😋👉🦐👈1(2-1)点<br />
                    8.FalleN(FURIA) 😋👉🦐👈1点<br />
                    9.mzinho(MGLZ) 😋👉🦐👈1(2-1)点<br />
                    10.ztr(GL) 🐷👉🦐👈1(2-1)点<br />
                    11.Lucaozy(Fluxo)😋👉🦐👈1点<br />
                    12.C4LLM3SU3(LVG)😋👉🦐👈1点<br />
                    13.acoR(m1x) 😋👉🦐👈1点<br />
                    14.xfl0ud(HEROIC)😋👉🦐👈1点<br />
                    15.LNZ(HEROIC) 😋👉🦐👈1点<br />
                    16.Jeorge(NRG) 😋👉🦐👈1点<br />
                    17.sl3nd(benched)😋👉🦐👈1(2-1)点<br />
                    18.cej0t(9INE) 😋👉🦐👈1点<br />
                    19.story(SAW) 😋👉🦐👈1点<br />
                    20.hallzerk(PUA) 😋👉🦐👈1点<br />
                    21.Grim(PUA) 😋👉🦐👈1点<br />
                    22.FL1t(VP) 👼👉🦐👈1点<br />
                    23.FL4MUS(benched)😎👉🦐👈1点<br />
                    24.ICY(VP) 🧊 👉🦐👈1点<br />
                    25.Lucky(3DMAX)🤬👉🦐👈1点<br />
                    26.Ex3rcice(3DMAX)😋👉🦐👈1点<br />
                    27.jabbi(Astralis) 🐭👉🦐👈1点<br />
                    28.sdy(ENCE) 😋👉🦐👈1点<br />
                </div>
            </div>
            <div class="ranking-section">
                <div class="section-header">
                    <h3 class="section-title">目前虾钳反夹，痛风点数榜:</h3>
                    <div class="section-actions">
                        <button class="btn-link" @click="showDialog(title2, text2)">痛风点数计算规则</button>
                    </div>
                </div>
                <div class="ranking-list">
                    1. broky(FaZe) 🦞👉📦6点(new) <br />
                    2. woxic(Aurora) 🦞👉 &#x1FAF2 3(1-4)点<br />
                    3.Brollan(MOUZ) 🦞👉💵3(1-4)点<br />
                    4.malbsMd(G2) 🦞👉🐴3点<br />
                    5.flameZ(Vitality) 🦞👉🔥2点<br />
                    6.w0nderful(NAVI) 🦞👉🧨2点<br />
                    7. EliGE (benched) 🦞👉🐔2点<br />
                    8.device(Astralis) 🦞👉😨2点<br />
                    9.ZywOo(Vitality) 🦞👉🍠1(2-3)点<br />
                    10.torzsi(MOUZ) 🦞👉🧦1(3-4)点<br />
                    11.xertioN(MOUZ) 🦞👉🦀1(2-3)点<br />
                    12.sh1ro(Spirit) 🦞👉🧟‍♂️1点<br />
                    13.NAF(Liquid) 🦞👉🦥1点<br />
                    14.stavn(Astralis) 🦞👉🐍1点<br />
                </div>
            </div>
            <div class="ranking-section">
                <div class="section-header">
                    <h3 class="section-title">捕虾战队哪家强：捕虾队评级</h3>
                    <div class="section-actions">
                        <span class="rule-text">规则：只会评级和Falcons有重复交手记录的队伍。</span>
                    </div>
                </div>
                <div class="ranking-list">
                    Vitality(4:1)Falcons 专业捕虾队 <br />
                    Aurora(4:1)Falcons 专业捕虾队 <br />
                    MOUZ(4:4)Falcons 入门捕虾队 <br />
                    FURIA(1:1)Falcons 入门捕虾队 <br />
                    MGLZ(1:1)Falcons 入门捕虾队 <br />
                    paiN(1:1)Falcons 入门捕虾队 <br />
                    VP(1:1)Falcons 入门捕虾队 <br />
                    G2(1:2)Falcons 劣质捕虾队 <br />
                    GL(1:4)Falcons 被钳破船队 <br />
                    FaZe(0:4)Falcons 浮游生物队(new) <br />
                </div>
            </div>
        </section>
        <section class="commentary">
            <h3 class="commentary-title">野榜杂谈</h3>
            <div class="commentary-content">
                我发现这个赛事，尼尼或者说猎鹰的评论区都被我们🦐孝占领了，全部都是全力开孝的海鲜粉。我感觉大家都和我一样简直憋坏了，好久不能看尼尼的比赛而且上次ewc又被喂屎了，正好好久没看见老尼这么c了，评论区直接哄堂大孝。说实话，本来真怀疑老尼要一拉到底，现在这个ct指挥还有枪法真感觉这个猎鹰或许真的能起飞。冲鸭，海鲜大队。
            </div>
        </section>
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
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

    .ranking-list {
        padding: 15px;
        background-color: #ffffff;
        font-family: "Courier New", monospace;
        line-height: 1.8;
        white-space: pre-line;
        
        @media (max-width: 768px) {
            font-size: 13px;
            padding: 12px;
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
</style>
