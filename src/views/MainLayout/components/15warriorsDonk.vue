<template>
    <div class="container">
        <header class="header">
            <h1>
                布雷德十五勇士榜
                <span class="version">3.0</span>
            </h1>
            <div class="rules-brief">计算规则：2025年累计对位KD差 | AWPER不录入 | 仅供娱乐</div>
            <div class="more-info">
                <div class="match-info">
                    <h3 class="match-title">{{ reportData.match.title }}</h3>
                    <span class="match-date">{{ reportData.match.date }}</span>
                </div>
                <div class="author-info">
                    <span class="author-label">作者：</span>
                    <div class="author-links">
                        <a href="https://app.pwesports.cn" target="_blank">完美: @Amatera</a>
                    </div>
                </div>
            </div>
            <div class="quote">
                <img src="https://sb6657oss.wishao.fun/B1ad3.jpg" alt="B1ad3" class="image" />
                <div class="text">
                    <div>"donk? 现在有至少15名步枪手可以轻松在任何位置击杀他"</div>
                    <div class="attribution">- B1ad3, 2025.01.15</div>
                </div>
            </div>
        </header>

        <main class="main-content">
            <section class="ranking-section">
                <h2>布雷德十五勇士</h2>
                <p class="description">理论上可以在任何位置轻松击杀donk的选手们</p>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Player</th>
                                <th class="diff-col">K/D Diff</th>
                                <th>Team</th>
                                <th>Kills</th>
                                <th>Deaths</th>
                                <th>Maps</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in reportData.rankings.warriors" :key="player.player">
                                <td>{{ player.rank }}</td>
                                <td>{{ player.player }}</td>
                                <td class="positive diff-col">{{ player.k_dDiff > 0 ? '+' : '' }}{{ player.k_dDiff }}
                                </td>
                                <td>{{ player.team }}</td>
                                <td>{{ player.kill }}</td>
                                <td>{{ player.death }}</td>
                                <td>{{ player.maps }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section class="ranking-section">
                <h2>反向十五勇士</h2>
                <p class="description">驴劲来了, donk的最大受害者们</p>
                <div class="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Player</th>
                                <th class="diff-col">K/D Diff</th>
                                <th>Team</th>
                                <th>Kills</th>
                                <th>Deaths</th>
                                <th>Maps</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in reportData.rankings.victims" :key="player.player">
                                <td>{{ player.rank }}</td>
                                <td>{{ player.player }}</td>
                                <td class="negative diff-col">{{ player.k_dDiff }}</td>
                                <td>{{ player.team }}</td>
                                <td>{{ player.kill }}</td>
                                <td>{{ player.death }}</td>
                                <td>{{ player.maps }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const reportData = ref<any>({
    match: { title: '加载中...', date: '加载中...' },
    rankings: {
        warriors: [],
        victims: [],
    },
});

const ossUrl = 'https://sb6657oss.wishao.fun/15warriorsDonk.json';
const abortController = new AbortController();
async function loadReportData() {
    try {
        const res = await fetch(ossUrl, { signal: abortController.signal });
        const data = await res.json();
        reportData.value = data;
    } catch (err) {
        console.error('加载15勇士战报数据失败:', err);
        reportData.value.match.title = '15勇士战报加载失败，请稍后重试。。。';
    }
}
loadReportData();
// 组件卸载时中止请求，防止资源泄露
onUnmounted(() => {
    abortController.abort();
});
</script>

<style lang="scss" scoped>
.container {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem 1rem;
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

            .version {
                font-size: 1.2rem;
                font-weight: 800;
                color: #666;
            }

            @media (max-width: 1024px) {
                font-size: 2rem;

                .version {
                    font-size: 1rem;
                }
            }

            @media (max-width: 768px) {
                font-size: 1.6rem;
                line-height: 1.3;

                .version {
                    font-size: 0.8rem;
                }
            }

            @media (max-width: 480px) {
                font-size: 1.4rem;

                .version {
                    font-size: 0.6rem;
                }
            }
        }

        .rules-brief {
            text-align: center;
            font-size: 0.85rem;
            color: #888;
            margin-bottom: 1rem;
            font-weight: 400;
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
            width: 100%;
            display: flex;
            justify-content: center;
            gap: 1rem;

            .image {
                width: 100px;
                height: 100px;
                object-fit: cover;

                @media (max-width: 768px) {
                    width: 80px;
                    height: 80px;
                }

                @media (max-width: 480px) {
                    width: 60px;
                    height: 60px;
                }
            }

            .text {
                font-size: 1.1rem;
                font-style: italic;
                color: #555;
                line-height: 1.6;

                @media (max-width: 768px) {
                    font-size: 1rem;
                }

                @media (max-width: 480px) {
                    font-size: 0.9rem;
                }

                .attribution {
                    margin-top: 0.5rem;
                    font-style: normal;
                    font-weight: 600;
                    color: #777;
                    display: block;
                }
            }
        }
    }

    .main-content {
        display: flex;
        gap: 1rem;
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

                    @media (max-width: 768px) {
                        font-size: 0.8rem;
                        min-width: 380px;
                    }

                    @media (max-width: 480px) {
                        font-size: 0.75rem;
                        min-width: 320px;
                    }

                    thead {
                        th {
                            font-weight: 600;
                            color: #555;
                            background-color: #fafafa;
                            padding: 0.8rem 0.6rem;
                            text-align: left;
                            border-bottom: 1px solid #e8e8e8;

                            @media (max-width: 768px) {
                                padding: 0.6rem 0.4rem;
                            }

                            @media (max-width: 480px) {
                                padding: 0.4rem 0.3rem;
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

                                @media (max-width: 768px) {
                                    padding: 0.6rem 0.4rem;
                                }

                                @media (max-width: 480px) {
                                    padding: 0.4rem 0.3rem;
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

    @media (max-width: 768px) {
        width: 60px;
    }

    @media (max-width: 480px) {
        width: 50px;
    }

    &.positive {
        color: #2e7d32;
    }

    &.negative {
        color: #c62828;
    }
}
</style>
