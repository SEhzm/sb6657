<template>
    <div class="home">
        <div class="boom">
            <img src="https://sb6657oss.wishao.fun/6657boom.webp" alt="6657boom" class="boom6657" />
        </div>
        <div class="cards-container">
            <div class="card first-card">
                <HomeIntro />
            </div>
            <div class="card second-card">
                <DidYouKnow />
            </div>
        </div>
        <div class="card third-card">
            <RandomMeme />
        </div>
        <div class="card fifth-card">
            <MemeSubmission />
        </div>
        <el-backtop :right="50" :bottom="50" />
        <ChatRoom class="ChatRoom card"></ChatRoom>
        <div class="card sixth-card">
            <span>友情链接</span>
            <a href="https://dgq63136.cn" target="_blank">dgq63136.cn</a>
            <a href="https://sb6657.cn/Starrysky" target="_blank">星空背景</a>
        </div>
        <HomeWordCloudPanel v-if="isMobile" class="mobile-word-cloud" />
    </div>
</template>

<script setup>
import ChatRoom from '@/components/ChatRoom.vue';
import DidYouKnow from '@/components/home/didYouKnow.vue';
import HomeIntro from '@/components/home/homeIntro.vue';
import RandomMeme from '@/components/home/random-meme.vue';
import MemeSubmission from '@/components/meme-submission.vue';
import { useIsMobile } from '@/utils/common';
import HomeWordCloudPanel from '@/views/MainLayout/components/right-sidebar/HomeWordCloudPanel.vue';
const isMobile = useIsMobile();
</script>

<style scoped lang="scss">
// ===== 主容器样式 =====
.home {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    // 顶部横幅区域
    .boom {
        height: 150px;

        .boom6657 {
            height: 100%;
            border-radius: 10px;
        }
    }

    // 卡片容器
    .cards-container {
        width: 100%;
        display: flex;
        gap: 8px;
        margin-top: 10px;
    }

    // 卡片通用样式
    .card {
        width: 100%;
        line-height: 25px;

        &.first-card,
        &.second-card {
            flex: 1; // 让两个卡片平分宽度
            margin-top: 0; // 重置margin，由容器控制间距
        }

        &.third-card {
            margin-top: 8px;
            padding: 12px;
        }

        &.fifth-card {
            margin-top: 8px;
            padding: 12px;
            box-sizing: border-box;
        }

        &.sixth-card {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 10px;
        }
    }
}

// ===== 聊天室样式 =====
.ChatRoom {
    margin: 10px 0;
}

// ===== 响应式设计 =====
// 大屏幕样式 (601px及以上)
@media (min-width: 601px) {
    .ChatRoom {
        display: none;
    }

    .mobile-word-cloud {
        display: none;
    }
}

// 前俩卡片在窄屏下换行展示
@media (max-width: 768px) {
    .home {
        .cards-container {
            flex-direction: column;
        }
    }
}

// 小屏幕样式 (600px及以下)
@media (max-width: 600px) {
    .home {
        width: 100%;

        .boom {
            height: 150px;

            .boom6657 {
                margin-top: 6px;
                height: 125px;
            }
        }

        .mobile-word-cloud {
            margin-top: 10px;
            width: 100%;
        }

        .card.fifth-card {
            margin-top: 8px;
        }
    }
}
</style>
