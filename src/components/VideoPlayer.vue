<!-- <template>
  <div class="pc-video">
    <video id="my-video" class="video-js vjs-default-skin" autoplay width="500px" height="281px" muted preload="auto">
      <source src="https://openhls-tct.douyucdn2.cn/dyliveflv1a/63136rc1gvphFT3F_2000.m3u8?txSecret=5e38ebb3fdee97a86ce0eda661c0d61c&txTime=66d2f29c&token=h5-douyu-0-63136-22d536242f14b7c44b238832de4be5de&did=10000000000000000000000000001501&origin=tct&vhost=play2&sid=398845343" type="application/x-mpegURL"
      >
    </video>
  </div>
  <div class="mb-video">
    <video id="my-video" class="video-js vjs-default-skin" autoplay width="300px" height="181px" muted preload="auto">
      <source src="https://openhls-tct.douyucdn2.cn/dyliveflv1a/63136rc1gvphFT3F_2000.m3u8?txSecret=5e38ebb3fdee97a86ce0eda661c0d61c&txTime=66d2f29c&token=h5-douyu-0-63136-22d536242f14b7c44b238832de4be5de&did=10000000000000000000000000001501&origin=tct&vhost=play2&sid=398845343" type="application/x-mpegURL"
      >
    </video>
  </div>

</template>

<script setup lang="ts">
import videojs from 'video.js/dist/video.min'
import 'video.js/dist/video-js.min.css'
import { onMounted } from "vue"

// 在onMounted阶段进行初始化
onMounted(() => {
  initVideoSourc()
})

function initVideoSourc() {
  videojs('my-video', {
    bigPlayButton: false,
    textTrackDisplay: false,
    posterImage: false,
    errorDisplay: false,
    controlBar: true,
    controls: true, // 是否显示控制条
    language: 'zh-cn', // 设置语言
    preload: 'auto', // 预加载
    autoplay: true, // 是否自动播放
    fluid: false, // 自适应宽高

  }, function () {
    this.play()
  })
}

</script>

<style>
@media (min-width: 601px) {
  .mb-video{
    display: none;
  }
}
@media (max-width: 600px) {
  .pc-video{
    display: none;
  }
}

</style> -->