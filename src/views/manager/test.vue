<template>
{{ data.tableData }}
</template>


<script>
import {ref, reactive} from 'vue'
import request from "@/utils/request";

const data = reactive({


})

const load = () => {
  request.get('https://www.doseeing.com/data/fan/40499214', {
    headers: {
    }
  }).then(res => {
    console.log(res)

  }).catch(err => {
    console.error('加载数据失败:', err)
  })
}
load()
</script>

