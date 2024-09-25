<template>
  <div class="outer">
    <span>时光相册</span><span style="font-size: 16px;">(点击放大图片)</span>
    <em style="font-size: 14px;">如侵权，请右上角联系删除</em>
  </div>
  <div class="image-list">
    <div v-for="(image, index) in image.outerImg" :key="index" class="image-block">
      <el-image :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :hide-on-click-modal="true" :src="image.url"
                :preview-src-list="[image.url]" fit="cover" lazy
                style="width: 250px; height: 300px; box-sizing: border-box;">
      </el-image>
      <div style="text-align: center; padding: 5%;">
        <el-button style="width: 100%; font-size: 20px; box-sizing: border-box;">{{ image.date }}</el-button>
      </div>
      <el-button @click="toggleComments(image)" style=" font-size: 18px; margin-left: 15px; box-sizing: border-box;">{{
          image.showComments ? '隐藏评论' : '显示评论'
        }}
      </el-button>
      <div v-if="image.showComments" class="comment-list">
        <div v-for="(comments, cIndex) in image.comments" :key="cIndex" class="comment-item">
          <span class="comment-content"> {{ comments.douyuID }} :</span>
          <span class="comment-content"> {{ comments.commentname }} </span>
          <span class="comment-date">{{ formatDate(comments.createdAt) }}</span>
        </div>
      </div>
      <el-button type="success" plain @click="addComment(image)" style=" font-size: 18px; box-sizing: border-box;">
        新增评论
      </el-button>
    </div>
  </div>

  <el-dialog v-model="image.dialogFormVisible" draggable title="评论">
    <el-form :model="image" label-width="100px" :rules="rules" label-position="right">
      <el-form-item label="你的斗鱼id" prop="douyuID">
        <el-input v-model="image.douyuID" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="评论内容" prop="Commentname">
        <el-input v-model="image.Commentname" autocomplete="off"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="image.dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveComment(image)">
          评论并关闭
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-backtop :right="50" :bottom="50"/>
</template>


<script setup>
import {ref, reactive} from 'vue'
import request from "@/utils/request";
import {ElNotification} from 'element-plus'
import autoExecPng from "@/assets/autoexec.vue";

const autoexec = () => {
  ElNotification({
    type: "success",
    dangerouslyUseHTMLString: true,
    title: '照片可以评论喔',
    offset: 50,
    duration: 10000
  })
}
autoexec()
const image = reactive({
  outerImg: [],
  id: '',
  imageId: '',
  Commentname: '',
  douyuId: '',
  dialogFormVisible: false,
})

const load = () => {
  request.get('/machine/showImage', {}).then(res => {
    // console.log(res)
    image.outerImg = res.data || []
    // console.log(image.outerImg)
  }).catch(err => {
    console.error('加载数据失败:', err)
  })
}

load()
//图片打开/关闭评论
const toggleComments = (image) => {
  image.showComments = !image.showComments;
}

const formatDate = (date) => {
  return new Date(date).toLocaleString();
}

const rules = ({
  douyuId: [
    {required: true, message: '请输入你的斗鱼ID', trigger: 'blur'},
  ],
  Commentname: [
    {required: true, message: '请输入评论', trigger: 'blur'},
  ]
})

const addComment = (image2) => {
  console.log(image2)
  image.imageId = image2.id
  ElNotification({
    title: '温馨提醒',
    message: '请注意你的行为，不要上传违反法律的内容，后台能监控到你',
    type: 'warning',
  })
  image.douyuID = ''
  image.Commentname = ''
  image.dialogFormVisible = true
}

const saveComment = (Obimage) => {
  console.log(Obimage)
  if (Obimage.douyuID === '' || Obimage.Commentname === '') {
    ElNotification.error("请输入斗鱼id或输入评论");
  } else {
    request.post('/machine/addCommentname', {
      id: '',
      imageId: image.imageId,
      douyuID: Obimage.douyuID,
      createdAt: '',
      commentname: Obimage.Commentname,
    }).then(res => {
      // console.log(res)
      load()
      ElNotification.success("评论成功");
      image.dialogFormVisible = false
    }).catch(err => {
      console.error('加载数据失败:', err)
    })
  }
}


</script>


<style scoped>
.outer {
  margin-top: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
}

.image-block {
  margin-right: 20px;
  margin-bottom: 20px;
  margin-left: 1%;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.demo-image__preview {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  overflow: auto;
}

.demo-image__error .image-slot {
  font-size: 30px;
}

.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}

.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

.outer {
  color: white;
  text-align: center;
  margin-bottom: 20px;
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.image-block {

}

.comment-list {
  margin-top: 10px;
}

.comment-item {
  margin-bottom: 5px;
}

.comment-content {
  font-weight: bold;
  font-size: 14px;
}

.comment-date {
  font-size: 11px;
  color: #999;
}

@media (max-width: 600px) {
  .image-list {

    width: 400px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>