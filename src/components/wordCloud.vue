<template>
    <div ref="wordCloud" style="height: 270px;width: 300px;"></div>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import httpInstance from '@/apis/httpInstance';
const wordCloud = ref(null)
const list = []
onMounted(() => {
    httpInstance.get('/machine/WordCloud')
        .then(res => {
            list.value = res;
            getWordCloudList(); 
        })
        .catch(error => {
            console.error(error);
        });
})
function getWordCloudList() {
    if (wordCloud.value) {
        const myc = echarts.init(wordCloud.value, "macarons")
        myc.setOption({
            tooltip: {
                show: true,
                borderColor: '#fe9a8bb3',
                borderWidth: 1,
                padding: [5,5,5,5],
                confine: true,
                backgroundColor: 'rgba(255, 255, 255, .9)',
                textStyle: {
                    color: 'hotpink',
                    lineHeight: 16
                },
                extraCssText: 'box-shadow: 0 4px 20px -4px rgba(199, 206, 215, 1);border-radius: 4px;'
            },
            series: [
                {
                    type: 'wordCloud',
                    shape: 'pentagon',
                    left: 'center',
                    top: 'center',
                    width: '100%',
                    height: '100%',
                    right: null,
                    bottom: null,

                    sizeRange: [16, 30],
                    rotationRange: [-20, 20],
                    rotationStep: 25,

                    gridSize: 15,
                    drawOutOfBound: false,
                    layoutAnimation: true,

                    textStyle: {
                        fontFamily: 'PingFangSC-Semibold',
                        fontWeight: 600,
                        color: function (params) {
                            let colors = ['#0d3555', '#58D5FF', '#0093c4', '#0d3555', '#0093c4', '#0d3555', '#73DDFF', '#58D5FF','#ff0000','#00ff00','#ff0000','#00ff00','#1a721a','#1a721a','#1a721a']
                            return colors[parseInt(Math.random() * 15)];
                        },
                    },
                    emphasis: {
                        focus: 'none',
                    },
                    data: list.value,
                },
            ],
        })
    }
}
// 暴露 getWordCloudList 方法
defineExpose({
    getWordCloudList
});
</script>

<style lang='scss' scoped>
h1{
    color:#1a721a;
}
</style>