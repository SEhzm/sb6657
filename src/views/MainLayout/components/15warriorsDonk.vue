<template>
    <div class="container">
        <header class="header">
            <h1>布雷德十五大勇士 & donk十五大受害者</h1>
            <div class="more-info">
                <div class="match-info">
                    <h3 class="match-title">BLAST伦敦公开赛2025 G2战胜Spirit</h3>
                    <span class="match-date">2025-09-02</span>
                </div>
                <div class="author-info">
                    <span class="author-label">作者：</span>
                    <div class="author-links">
                        <a href="https://app.pwesports.cn" target="_blank">完美: @Amatera</a>
                    </div>
                </div>
            </div>
            <p class="quote">
                "donk? 现在有至少15名步枪手可以轻松在任何位置击杀他" <br />
                <span class="attribution">- B1ad3, 2025</span>
            </p>

        </header>

        <main class="main-content">
            <section class="ranking-section">
                <h2>布雷德十五勇士</h2>
                <p class="description">理论上可以“轻松击杀donk”的选手们</p>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Player</th>
                                <th>Team</th>
                                <th>Kills</th>
                                <th>Deaths</th>
                                <th class="diff-col">K/D Diff</th>
                                <th>Maps</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in warriors" :key="player.player">
                                <td>{{ player.rank }}</td>
                                <td>{{ player.player }}</td>
                                <td>{{ player.team }}</td>
                                <td>{{ player.kill }}</td>
                                <td>{{ player.death }}</td>
                                <td class="positive diff-col">{{ player.k_dDiff > 0 ? '+' : '' }}{{ player.k_dDiff }}
                                </td>
                                <td>{{ player.maps }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section class="ranking-section">
                <h2>donk十五大受害者</h2>
                <p class="description">实际上被donk“轻松击杀”的选手们</p>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Player</th>
                                <th>Team</th>
                                <th>Kills</th>
                                <th>Deaths</th>
                                <th class="diff-col">K/D Diff</th>
                                <th>Maps</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in victims" :key="player.player">
                                <td>{{ player.rank }}</td>
                                <td>{{ player.player }}</td>
                                <td>{{ player.team }}</td>
                                <td>{{ player.kill }}</td>
                                <td>{{ player.death }}</td>
                                <td class="negative diff-col">{{ player.k_dDiff }}</td>
                                <td>{{ player.maps }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// “布雷德十五勇士”榜单数据
const warriors = ref([
    { rank: 1, player: 'HeavyGod', kill: 29, death: 18, k_dDiff: 11, maps: 6, team: 'G2 Esports' },
    { rank: 2, player: 'ropz', kill: 26, death: 17, k_dDiff: 9, maps: 8, team: 'Vitality' }, 
    { rank: 3, player: 'Magisk', kill: 14, death: 6, k_dDiff: 8, maps: 3, team: 'Falcons' },
    { rank: 4, player: 'Maden', kill: 8, death: 1, k_dDiff: 7, maps: 2, team: 'Heroic' },
    { rank: 5, player: 'tN1R', kill: 20, death: 14, k_dDiff: 6, maps: 5, team: 'Heroic' },
    { rank: 6, player: 'REZ', kill: 25, death: 19, k_dDiff: 6, maps: 5, team: 'GamerLegion' }, 
    { rank: 7, player: 'mzinho', kill: 19, death: 15, k_dDiff: 4, maps: 5, team: 'TheMongolZ' },
    { rank: 8, player: 'sjuush', kill: 22, death: 18, k_dDiff: 4, maps: 4, team: 'Ninjas in Pyjamas' }, 
    { rank: 9, player: 'Starry', kill: 4, death: 1, k_dDiff: 3, maps: 1, team: 'LynnVisionGaming' },
    { rank: 10, player: 'electroNic', kill: 20, death: 18, k_dDiff: 2, maps: 6, team: 'Virtus.pro' },
    { rank: 11, player: 'MUTiRiS', kill: 10, death: 8, k_dDiff: 2, maps: 2, team: 'SAW' },
    { rank: 12, player: 'EliGE', kill: 5, death: 3, k_dDiff: 2, maps: 2, team: 'FaZe Clan' }, 
    { rank: 13, player: 'frozen', kill: 4, death: 2, k_dDiff: 2, maps: 2, team: 'FaZe Clan' },
    { rank: 14, player: 'jottAAA', kill: 34, death: 33, k_dDiff: 1, maps: 9, team: 'EternalFire/Aurora' },
    { rank: 15, player: 'siuhy', kill: 5, death: 4, k_dDiff: 1, maps: 2, team: 'TeamLiquid' }, 
]);

// “donk十五大受害者”榜单数据
const victims = ref([
    { rank: 1, player: 'Brollan', kill: 47, death: 92, k_dDiff: -45, maps: 17, team: 'Mousesports' }, 
    { rank: 2, player: 'Aleksib', kill: 26, death: 69, k_dDiff: -43, maps: 14, team: 'Natus Vincere' },
    { rank: 3, player: 'xertioN', kill: 74, death: 101, k_dDiff: -27, maps: 17, team: 'Mousesports' },
    { rank: 4, player: 'iM', kill: 54, death: 80, k_dDiff: -26, maps: 14, team: 'Natus Vincere' },
    { rank: 5, player: 'yxngstxr', kill: 12, death: 37, k_dDiff: -25, maps: 7, team: 'Heroic' },
    { rank: 6, player: 'jabbi', kill: 14, death: 35, k_dDiff: -21, maps: 8, team: 'Astralis' },
    { rank: 7, player: 'Jimpphat', kill: 55, death: 75, k_dDiff: -20, maps: 17, team: 'Mousesports' },
    { rank: 8, player: 'Vexite', kill: 12, death: 31, k_dDiff: -19, maps: 6, team: 'FlyQuest' },
    { rank: 9, player: 'bLitz', kill: 12, death: 31, k_dDiff: -19, maps: 5, team: 'TheMongolZ' },
    { rank: 10, player: 'ewjerkz', kill: 11, death: 28, k_dDiff: -17, maps: 4, team: 'Ninjas in Pyjamas' },
    { rank: 11, player: 'INS', kill: 13, death: 29, k_dDiff: -16, maps: 6, team: 'FlyQuest' },
    { rank: 12, player: 'Wicadia', kill: 27, death: 43, k_dDiff: -16, maps: 9, team: 'EternalFire/Aurora' },
    { rank: 13, player: 'Staehr', kill: 20, death: 36, k_dDiff: -16, maps: 8, team: 'Astralis' },
    { rank: 14, player: 'NertZ', kill: 7, death: 23, k_dDiff: -16, maps: 4, team: 'TeamLiquid' }, 
    { rank: 15, player: 'YEKINDAR', kill: 15, death: 31, k_dDiff: -16, maps: 5, team: 'FURIA' },
]);

</script>

<style lang="scss" scoped>
.container {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #f5f5f7;
    color: #333;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        padding: 1rem;
    }

    .header {
        margin-bottom: 1rem;

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-align: center;

            @media (max-width: 1024px) {
                font-size: 2rem;
            }

            @media (max-width: 768px) {
                font-size: 1.6rem;
                line-height: 1.3;
            }

            @media (max-width: 480px) {
                font-size: 1.4rem;
            }
        }

        .more-info {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            gap: 1rem;

            @media (max-width: 768px) {
                flex-direction: column;
                align-items: flex-start;
                gap: 0.8rem;
            }

            .match-info {
                display: flex;
                flex-direction: column;

                .match-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin: 0;
                    color: #333;

                    @media (max-width: 768px) {
                        font-size: 1.1rem;
                    }

                    @media (max-width: 480px) {
                        font-size: 1rem;
                    }
                }

                .match-date {
                    font-size: 0.9rem;
                    color: #666;
                    margin-top: 0.2rem;
                }
            }

            .author-info {
                display: flex;
                flex-direction: column;
                align-items: flex-end;

                @media (max-width: 768px) {
                    align-items: flex-start;
                    width: 100%;
                }

                .author-label {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 0.2rem;
                }

                .author-links {
                    a {
                        color: #007aff;
                        text-decoration: none;
                        font-size: 0.9rem;

                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }

        .quote {
            text-align: center;
            font-size: 1.1rem;
            font-style: italic;
            color: #555;
            line-height: 1.6;
            padding: 1rem 0;

            @media (max-width: 768px) {
                font-size: 1rem;
                padding: 0.8rem 0;
            }

            @media (max-width: 480px) {
                font-size: 0.9rem;
                line-height: 1.5;
            }

            .attribution {
                margin-top: 0.5rem;
                font-style: normal;
                font-weight: 600;
                color: #777;
                display: block;

                @media (max-width: 480px) {
                    font-size: 0.85rem;
                }
            }
        }
    }

    .main-content {
        display: flex;
        gap: 2rem;
        justify-content: center;

        @media (max-width: 1024px) {
            flex-direction: column;
        }

        @media (max-width: 768px) {
            gap: 1.5rem;
        }

        .ranking-section {
            flex: 1;
            min-width: 0;
            background-color: #ffffff;
            padding: 1.5rem;
            border: 1px solid #e0e0e0;

            @media (max-width: 768px) {
                padding: 1rem;
            }

            @media (max-width: 480px) {
                padding: 0.8rem;
            }

            h2 {
                font-size: 1.5rem;
                font-weight: 600;
                border-bottom: 2px solid #ccc;
                padding-bottom: 0.75rem;
                margin-bottom: 0.5rem;

                @media (max-width: 768px) {
                    font-size: 1.3rem;
                }

                @media (max-width: 480px) {
                    font-size: 1.2rem;
                }
            }

            .description {
                color: #666;
                margin-bottom: 1.5rem;
                font-size: 0.9rem;

                @media (max-width: 480px) {
                    font-size: 0.85rem;
                    margin-bottom: 1rem;
                }
            }

            .table-wrapper {
                overflow-x: auto;

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.95rem;
                    min-width: 500px;

                    @media (max-width: 480px) {
                        font-size: 0.85rem;
                        min-width: 450px;
                    }

                    thead {
                        th {
                            font-weight: 600;
                            color: #555;
                            background-color: #fafafa;
                            padding: 0.8rem 0.6rem;
                            text-align: left;
                            border-bottom: 1px solid #e8e8e8;

                            @media (max-width: 480px) {
                                padding: 0.6rem 0.4rem;
                            }

                            &:nth-child(1) {
                                text-align: center;
                                width: 40px;
                            }
                        }
                    }

                    tbody {
                        tr {
                            &:last-child {
                                td {
                                    border-bottom: none;
                                }
                            }

                            &:hover {
                                background-color: #f9f9f9;
                            }

                            td {
                                padding: 0.8rem 0.6rem;
                                text-align: left;
                                border-bottom: 1px solid #e8e8e8;

                                @media (max-width: 480px) {
                                    padding: 0.6rem 0.4rem;
                                }

                                &:nth-child(1) {
                                    text-align: center;
                                    width: 40px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

.diff-col {
    font-weight: 700;
    text-align: center;
    width: 80px;

    &.positive {
        color: #2e7d32;
    }

    &.negative {
        color: #c62828;
    }
}
</style>