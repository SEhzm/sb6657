<template>
    <div class="footer">
        <div class="content">
            <div class="date-font">距服务器到期还有<span>{{ serverDate }}</span>天</div>
            <div>
                <a href="https://ipw.cn/ipv6webcheck/?site=sb6657.cn" title="" target='_blank' style="color: black;">
                    <img style='display:inline-block;vertical-align:middle;width: 150px;' alt="" src="https://static.ipw.cn/icon/ipv6-s5.svg"></a>
                本站已运行{{ daysSinceLaunch }}天
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const serverDate = ref(0);
const txServerDate = new Date('2027-02-12'); // 服务器到期日期
const currentDate = new Date();
serverDate.value = Math.ceil((txServerDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

const launchDate = new Date('2024-02-07');
// 计算已运行天数
const daysSinceLaunch = computed(() => {
  const currentDateTimestamp = new Date().getTime(); // 获取当前时间的时间戳
  const timeDifference = currentDateTimestamp - launchDate.getTime(); // 使用 getTime() 方法获取时间戳并进行减法运算
  const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  return dayDifference;
});
</script>

<style scoped lang="scss">
.footer {
    width: 100%;
    font-family: Arial;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        .date-font {
            font-weight: bold;
            span {
                color: red;
            }
        }
    }
    @media (min-width: 601px) {
        .content{
            margin-top: -50px;
        }
    }
    @media (max-width: 600px) {
        .content{
            margin-top: 45px;
        }
    }
}
</style>
