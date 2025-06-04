<template>
    <div class="card" v-if="page == 1">
        <h1>因为GreasyFork被墙，你可以<a href="https://cdn.hguofichp.cn/sb6657.cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86.user.js" target="_blank">点击我下载最新的插件</a>，你只需要将下载的文件拖入油猴管理面板即可</h1>
        
        <br><h1>
            这是Edge浏览器安装油猴脚本的教程   &nbsp;&nbsp;&nbsp;&nbsp;
            
            <el-button type="success" v-if="page == 1" @click="changePage(2)">切换谷歌Chrome内核浏览器教程</el-button>
            <el-button type="success" v-if="page !== 1" @click="changePage(1)">切换Edge浏览器教程</el-button>
            <el-button type="success" v-if="page != 3" @click="changePage(3)">以上教程都不能安装！</el-button>
        </h1><h2><br>如果你已经有了油猴可以直接跳到第 4 步</h2>
        <h3><br>1、进入油猴脚本官网：<a href="https://www.tampermonkey.net/" target="_blank"> www.tampermonkey.net</a></h3>
        <img src="https://pic.imgdb.cn/item/670503ddd29ded1a8c7f249b.jpg" alt="1">
        <h3><br>2、进入微软edge商店，点击获取</h3>
        <img src="https://pic.imgdb.cn/item/670503ddd29ded1a8c7f24a8.jpg" alt="">
        <h3><br>3、在弹出框选择添加程序</h3>
        <h3><br>4、打开<a
                href="https://greasyfork.org/zh-CN/scripts/511842-sb6657-cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86" target="_blank">sb6657.cn斗鱼玩机器烂梗收集搜索脚本</a>
        </h3>
        <h3><br>5、点击安装</h3>
        <img src="https://pic.imgdb.cn/item/670503ddd29ded1a8c7f24b6.jpg" alt="">
        <h3><br>6、再次点击安装</h3>
        <img src="https://pic.imgdb.cn/item/670503ddd29ded1a8c7f24c7.jpg" alt="">
        <h3><br>6、直播间输入框上方出现“玩烂梗” ， 说明安装成功</h3>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c752754.png" alt="">
        <h3><br>7、可以直接复制和一键发送! 注意：在插件复制，复制次数不增加</h3>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c752763.png" alt=""><br>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c75276a.png" alt=""><br>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c752773.png" alt="">
    </div>
    <div v-if="page == 2" class="card">
        <h1>
            这是谷歌Chrome浏览器安装油猴脚本的教程 &nbsp;&nbsp;
            <el-button type="success" v-if="page != 2" @click="changePage(2)">切换谷歌Chrome内核浏览器教程</el-button>
            <el-button type="success" v-if="page != 1" @click="changePage(1)">切换Edge浏览器教程</el-button>
            <el-button type="success" v-if="page != 3" @click="changePage(3)">以上教程都不能安装！</el-button>
        </h1>
        <h3><br>1、进入油猴脚本官网：<a href="https://www.tampermonkey.net/" target="_blank">www.tampermonkey.net</a>点击右侧下载</h3>
        <img src="https://pic.imgdb.cn/item/6704e6ddd29ded1a8c6322a2.jpg" alt="1">
        <h3><br>2、进入 设置-扩展程序-管理扩展程序</h3>
        <img src="https://pic.imgdb.cn/item/670504bdd29ded1a8c8027ac.png" alt="">
        <h3><br>3、将下载好的crx文件拖入扩展程序中</h3>
        <img src="https://pic.imgdb.cn/item/6704e6ddd29ded1a8c6322b9.png" alt="">
        <img src="https://pic.imgdb.cn/item/670504bdd29ded1a8c802798.jpg" alt="">
        <h3><br>4、打开
            <a
                href="https://greasyfork.org/zh-CN/scripts/511842-sb6657-cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86" target="_blank">sb6657.cn斗鱼玩机器烂梗收集搜索脚本</a>
        </h3>
        <h3><br>5、点击安装</h3>
        <img src="https://pic.imgdb.cn/item/670503ddd29ded1a8c7f24b6.jpg" alt="">
        <h3><br>6、再次点击安装</h3>
        <img src="https://pic.imgdb.cn/item/670503ddd29ded1a8c7f24c7.jpg" alt="">
        <h3><br>6、直播间输入框上方出现“玩烂梗” ， 说明安装成功</h3>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c752754.png" alt="">
        <h3><br>7、可以直接复制和一键发送! 注意：在插件复制，复制次数不增加</h3>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c752763.png" alt=""><br>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c75276a.png" alt=""><br>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c752773.png" alt="">
    </div>
    <div v-if="page == 3" class="card">
        <h1>
            这是终极安装油猴脚本的教程 &nbsp;&nbsp;
            <el-button type="success" v-if="page != 2" @click="changePage(2)">切换谷歌Chrome内核浏览器教程</el-button>
            <el-button type="success" v-if="page != 1" @click="changePage(1)">切换Edge浏览器教程</el-button>
            <el-button type="success" v-if="page != 3" @click="changePage(3)">以上教程都不能安装！</el-button>
        </h1>
        <h3><br>1、网盘下载油猴插件crx: &nbsp;<a href="https://wwe.lanzoui.com/irNjUtgyxpc" target="_blank">https://wwe.lanzoui.com/irNjUtgyxpc</a></h3>
        <img src="https://pic.imgdb.cn/item/6704e792d29ded1a8c63b824.jpg" alt="1">
        <h3><br>2、解压压缩包，得到crx文件</h3>
        <img src="https://pic.imgdb.cn/item/6704e792d29ded1a8c63b82d.jpg" alt="">
        <h3><br>2、进入 设置-扩展程序-管理扩展程序</h3>
        <img src="https://pic.imgdb.cn/item/670504bdd29ded1a8c8027ac.png" alt="">
        <h3><br>3、将解压好的crx文件拖入扩展程序中</h3>
        <img src="https://pic.imgdb.cn/item/6704e6ddd29ded1a8c6322b9.png" alt="">
        <img src="https://pic.imgdb.cn/item/670504bdd29ded1a8c802798.jpg" alt="">
        <h3><br>4、打开
            <a
                href="https://greasyfork.org/zh-CN/scripts/511842-sb6657-cn%E6%96%97%E9%B1%BC%E7%8E%A9%E6%9C%BA%E5%99%A8%E7%83%82%E6%A2%97%E6%94%B6%E9%9B%86" target="_blank">sb6657.cn斗鱼玩机器烂梗收集搜索脚本</a>
        </h3>
        <h3><br>5、点击安装</h3>
        <img src="https://pic.imgdb.cn/item/670503ddd29ded1a8c7f24b6.jpg" alt="">
        <h3><br>6、再次点击安装</h3>
        <img src="https://pic.imgdb.cn/item/670503ddd29ded1a8c7f24c7.jpg" alt="">
        <h3><br>6、直播间输入框上方出现“玩烂梗” ， 说明安装成功</h3>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c752754.png" alt="">
        <h3><br>7、可以直接复制和一键发送! 注意：在插件复制，复制次数不增加</h3>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c752763.png" alt=""><br>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c75276a.png" alt=""><br>
        <img src="https://pic.imgdb.cn/item/6704f9bbd29ded1a8c752773.png" alt="">
    </div>
</template>

<script setup>
import { ref } from 'vue';
const page = ref(1);
const changePage = (newPage) => {
    console.log(page.value)
    page.value = newPage;
}
</script>

<style scoped>

</style>