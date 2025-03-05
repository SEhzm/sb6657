<template>
    <div ref="wordCloud" style="height: 250px;width: 250px;"></div>

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
            console.log(list.value);
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
                extraCssText: 'box-shadow: 0 4px 20px -4px rgba(199, 206, 215, .7);border-radius: 4px;'
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
                    rotationRange: [0, 0],
                    rotationStep: 0,

                    gridSize: 23,
                    drawOutOfBound: false,
                    layoutAnimation: true,

                    textStyle: {
                        fontFamily: 'PingFangSC-Semibold',
                        fontWeight: 600,
                        color: function (params) {
                            let colors = ['#fe9a8bb3', '#fe9a8bb3', '#fe9a8b03', '#9E87FFb3', '#9E87FFb3', '#9E87FFb3', '#fe9a8bb3', '#fe9a8bb3', '#fe9a8bb3', '#73DDFF', '#58D5FF']
                            return colors[parseInt(Math.random() * 10)];
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

</script>

<style lang='scss' scoped></style>