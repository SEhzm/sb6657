<template>
    <div class="did-you-know">
        <h3>🤔 你知道吗？</h3>
        <ul class="knowledge-list">
            <li>
                谁目前打出了对位donk最多的击杀? 谁又是对位donk最大的受害者?
                <RouterLink to="/15warriorsDonk">- 布雷德15勇士</RouterLink>
            </li>
            <li>
                哪只队伍捕虾最专业? 谁是最佳捕虾人? 又是谁在捕虾过程中惨遭反夹?
                <RouterLink to="/dejaVuNiko">- 超级逮虾户战报</RouterLink>
            </li>
            <li class="placeholder-item">
                <!-- 预留给最后投稿弹幕内容 -->
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped lang="scss">
.did-you-know {
    h3 {
        margin: 0 0 12px 0;
        font-size: 18px;
        color: #303133;
        font-weight: 600;
    }

    .knowledge-list {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            margin-bottom: 8px;
            font-size: 14px;
            line-height: 1.6;
            color: #606266;

            &:last-child {
                margin-bottom: 0;
            }

            a {
                color: #409eff;
                text-decoration: none;
                font-weight: 500;
                text-wrap: nowrap;

                &:hover {
                    text-decoration: underline;
                    color: #66b1ff;
                }
            }
        }
    }
}
</style>
