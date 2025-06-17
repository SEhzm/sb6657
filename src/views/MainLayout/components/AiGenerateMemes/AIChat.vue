<template>
  <div class="chatgpt-container">
    <div class="chat-window" ref="chatWindow">
      <div class="ai-welcome-message">
        AI造梗助手Demo（32B模型，算力一般）<span style="font-size: small;">每天50次<span
            style="font-size: smaller;">(成本不低..)</span></span><b>等待两分钟卡了可以刷新</b>
        <button class="refresh-button" @click="refreshComponent">
          刷新
        </button>
      </div>
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.role]">
        <div v-if="msg.role === 'ai'" class="bubble ai-bubble">
          <img class="avatar" src="@/assets/imgs/user-img-0.png" alt="AI" />
          <div class="bubble-content" v-html="msg.content"></div>
        </div>
        <div v-else class="bubble user-bubble">
          <img class="avatar" src="@/assets/icons/ai_chat_user.svg" alt="你" />
          <div class="bubble-content">{{ msg.content }}</div>
        </div>
      </div>
      <div v-if="loading" class="message ai">
        <div class="bubble ai-bubble">
          <img class="avatar" src="@/assets/imgs/user-img-0.png" alt="AI" />
          <div v-if="streamingContent" class="bubble-content">{{ streamingContent }}<span class="cursor">|</span></div>
          <div v-else class="bubble-content">{{ streamingContent }}<span class="cursor-wait">(排队中，耐心等待一分钟左右,毕竟算力有限🥺)|</span></div>
        </div>
      </div>
    </div>
    <form class="input-form" @submit.prevent="sendMessage">
      <input v-model="prompt" placeholder="请输入…" :disabled="loading" autocomplete="off" />
      <button :disabled="loading || !prompt.trim()" type="submit">
        发送
      </button>
      <label class="reasoning">
        <input type="checkbox" v-model="needReasoning" :disabled="loading" />
        需要查看思考过程
      </label>
    </form>
    <span
      style="font-size: small;text-align: center;user-select: none;">服务生成的所有内容均由人工智能模型生成，其生成内容的准确性和完整性无法保证，不代表我们的态度或观点。</span>
    <div class="controls-container">
      <div class="control-item">
        <label for="memesNum">造梗数量:</label>
        <el-select id="memesNum" v-model="selectedMemesNum" :disabled="loading" placeholder="选择梗数量">
          <el-option v-for="n in 10" :key="n" :label="n" :value="n" />
        </el-select>
      </div>
      <div class="control-item">
        <label for="tagSelect">梗标签:</label>
        <el-select id="tagSelect" v-model="selectedTag" :disabled="loading" placeholder="全部">
          <el-option label="全部" value="" />
          <el-option v-for="option in tagOptions" :key="option.dictValue" :label="option.dictLabel"
            :value="option.dictValue" />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import axios from 'axios';
import { onMounted } from 'vue';
import { ElSelect, ElOption } from 'element-plus';
import httpInstance from '@/apis/httpInstance';
import { ElMessage } from 'element-plus'


interface DictItem {
  dictCode: string | null;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  iconUrl: string | null;
}

interface DictListResponse {
  code: number;
  msg: string;
  data: DictItem[];
}

type Message = {
  role: 'user' | 'ai'
  content: string
}

const messages = ref<Message[]>([])
const prompt = ref('')
const loading = ref(false)
const streamingContent = ref('')
const needReasoning = ref(false)
const chatWindow = ref<HTMLElement | null>(null)
const selectedMemesNum = ref(3);
const tagOptions = ref<{ dictLabel: string; dictValue: string }[]>([])
const selectedTag = ref('');

/**
 * 清洗AI输出，保留常见结构（有序/无序列表、代码块、段落），兼容中英文。
 */
const formatAIResponse = (text: string): string => {
  let cleanedText = text;

  // 移除 <think> 和 </think> 标签
  cleanedText = cleanedText.replace(/<think>/g, '');
  cleanedText = cleanedText.replace(/<\/think>/g, '');

  // 移除所有 data: 开头的行，无论是否有后续字符或换行符
  // 并且移除因这些 data: 行而产生的多余空行
  // cleanedText = cleanedText.replace(/^data:.*\n?/gm, ''); // 已经由sendMessage处理，此行冗余

  // 4. 合并被分割的markdown序号（如 "1\n.\n内容" => "1. 内容"）
  cleanedText = cleanedText.replace(/(\d+)\s*\n\s*\.\s*\n?\s*/g, '$1. ');
  // cleanedText = cleanedText.replace(/(\d+)\s*\n\s*\.\s*/g, '$1. '); // 与上一条重复
  cleanedText = cleanedText.replace(/(\d+)\s*\.\s*/g, '$1. ');

  // 5. 去除开头所有空白行
  cleanedText = cleanedText.replace(/^\s+/, '');

  // 6. 合并多余空白行（3行及以上变为1行）
  cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n');

  // 7. 每行trim
  cleanedText = cleanedText
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  // 8. 去除整体首尾空行
  cleanedText = cleanedText.replace(/^\s+|\s+$/g, '');

  return cleanedText.trim();
};

const scrollToBottom = async () => {
  await nextTick()
  chatWindow.value?.scrollTo({
    top: chatWindow.value.scrollHeight,
    behavior: 'smooth',
  })
}

const sendMessage = async () => {
  if (!prompt.value.trim() || loading.value) return
  const userPrompt = prompt.value
  messages.value.push({ role: 'user', content: userPrompt })
  prompt.value = ''
  streamingContent.value = ''
  loading.value = true
  await nextTick()
  scrollToBottom()

  let retryCount = 0;
  const maxRetries = 1;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const sendRequest = async () => {
    const token = localStorage.getItem('Admin-Token')
    if (!token) {
      ElMessage.warning('请先登录！');
      loading.value = false
      return
    }

    try {
      const params = new URLSearchParams()
      params.append('prompt', userPrompt)
      params.append('needReasoning', String(needReasoning.value))
      params.append('memesNum', String(selectedMemesNum.value))
      if (selectedTag.value !== '') {
        params.append('tag', selectedTag.value);
      }
      const resp = await fetch(`${httpInstance.defaults.baseURL}` + '/suanli/stream', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: params,
      })
      if (resp.code === 401) {
        ElMessage.warning('请先登录！');
        loading.value = false;
        return;
      }
      if (!resp.body) throw new Error('响应流为空')
      let allContent = '';
      const decoder = new TextDecoder('utf-8');
      const reader = resp.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        // 拆分多条 data
        text.split('data:').forEach(line => {
          if (!line.trim()) return;
          try {
            const chunk = JSON.parse(line.trim());
            if (chunk.choices?.[0]?.delta?.content) {
              allContent += chunk.choices[0].delta.content;
              streamingContent.value = allContent;
            }
          } catch (e) {
            // 可能不是JSON，忽略
          }
        });
      }
      messages.value.push({ role: 'ai', content: formatAIResponse(streamingContent.value) })
      streamingContent.value = ''
    } catch (e: any) {
      if (retryCount < maxRetries) {
        console.warn('请求失败，正在重试...', e);
        retryCount++;
        setTimeout(sendRequest, 1000);
      } else {
        streamingContent.value = '请求失败：' + (e?.message || e);
      }
    } finally {
      loading.value = false
      scrollToBottom()
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  };

  timeoutId = setTimeout(() => {
    if (loading.value) {
      console.warn('AI响应超时，此刻算力不足，请重试...');
      if (retryCount < maxRetries) {
        retryCount++;
        sendRequest();
      } else {
        streamingContent.value = 'AI响应超时，此刻算力不足，请重试。';
        loading.value = false;
        scrollToBottom();
      }
    }
  }, 90000);

  sendRequest();
}

// 刷新组件的方法
const refreshComponent = async () => {
  messages.value = []; // 清空消息
  prompt.value = ''; // 清空输入框
  streamingContent.value = ''; // 清空流式内容
  loading.value = false; // 停止加载状态
  selectedMemesNum.value = 3; // 重置梗数量
  selectedTag.value = ''; // 重置标签
  tagOptions.value = []; // 清空标签选项

  // 重新获取标签列表
  try {
    const response = await httpInstance.get<DictListResponse>('/machine/dictList');
    if (response.data && response.code === 200) {
      tagOptions.value = response.data;
    }
  } catch (error) {
    console.error('获取标签列表失败:', error);
  }
};

// 在组件挂载时调用刷新，以初始化数据
onMounted(() => {
  refreshComponent();
});
</script>

<style scoped lang="scss">
.chatgpt-container {
  width: 95%;
  max-width: 960px;
  margin: 15px auto;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  min-height: 85vh;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    margin: 0;
    border-radius: 0;
    min-height: 80vh;
  }
}

.chat-window {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 20px;
  background: #f7f9fc;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 15px;
  }
}

.message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
}

.bubble {
  display: flex;
  align-items: flex-start;
  max-width: 85%;
}

.ai-bubble {
  flex-direction: row;
}

.user-bubble {
  flex-direction: row-reverse;
  margin-left: auto;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin: 0 8px;
  background: #eaeaea;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    margin: 0 5px;
  }
}

.bubble-content {
  background: #8caefd;
  color: #000000;
  padding: 12px 18px;
  border-radius: 16px;
  font-size: 1em;
  line-height: 1.6;
  box-shadow: 0 4px 15px rgba(64, 158, 255, 0.15);
  word-break: break-word;
  white-space: pre-wrap;
  transition: background 0.18s;
  min-width: 50px;

  @media (max-width: 768px) {
    font-size: 0.95em;
    padding: 10px 15px;
    border-radius: 12px;
  }
}

.ai-bubble .bubble-content {
  background: linear-gradient(90deg, #e0f2f7 0%, #e8f9fd 100%);
  color: #000000;
  border-bottom-left-radius: 6px;
}

.user-bubble .bubble-content {
  background: linear-gradient(90deg, #e3f0fd 0%, #edf7ff 100%);
  color: #1a568c;
  border-bottom-right-radius: 6px;
}

.cursor {
  color: #000000;
  animation: blink 1.1s steps(1) infinite;
}
.cursor-wait {
  color: #000000;
  animation: blink 1.2s steps(1) infinite;
}

@keyframes blink {

  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

.input-form {
  display: flex;
  padding: 15px 20px;
  border-top: 1px solid #eee;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 10px 15px;
  }
}

.input-form input {
  flex: 1;
  padding: 12px 18px;
  border: 1px solid #dcdfe6;
  border-radius: 20px;
  font-size: 0.95rem;
  margin-right: 8px;
  outline: none;
  transition: border-color 0.2s;

  @media (max-width: 768px) {
    flex-basis: 100%;
    margin-right: 0;
    margin-bottom: 8px;
  }
}

.input-form input:focus {
  border-color: #409eff;
}

.input-form button {
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 18px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.2s, transform 0.1s;
  white-space: nowrap;

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 15px;
  }
}

.input-form button:hover {
  background-color: #66b1ff;
  transform: translateY(-1px);
}

.input-form button:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
  transform: none;
}

.refresh-button {
  background-color: #67c23a; // Element Plus 绿色主题
  color: white;
  border: none;
  border-radius: 20px;
  padding: 4px 14px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s, transform 0.1s;
  white-space: nowrap;
  margin-left: 8px; // 与发送按钮保持距离

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-top: 8px; // 在移动端与上面元素保持距离
  }
}

.refresh-button:hover {
  background-color: #85ce61;
  transform: translateY(-1px);
}

.refresh-button:disabled {
  background-color: #b3e19d;
  cursor: not-allowed;
  transform: none;
}

.reasoning {
  // display: flex;
  align-items: center;
  margin-top: 15px;
  margin-left: 5px;
  font-size: 0.9rem;
  color: #606266;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    margin-top: 8px;
    justify-content: center;
  }
}

.reasoning input[type="checkbox"] {
  margin-right: 4px;
  width: 15px;
  height: 15px;
  cursor: pointer;
  accent-color: #409eff;
}

.controls-container {
  display: flex;
  padding: 12px 18px;
  border-top: 1px solid #eee;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 8px 12px;
  }
}

.control-item {
  margin-right: 8px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 8px;
    width: 100%;
    justify-content: center;
  }
}

.control-item label {
  width: auto;
  margin-right: 6px;
  font-weight: bold;
  color: #333;

  @media (max-width: 768px) {
    width: auto;
    margin-right: 8px;
  }
}

.control-item .el-select {
  min-width: 90px;

  @media (max-width: 768px) {
    width: 140px;
  }
}

.control-item #tagSelect.el-select {
  width: 160px;

  @media (max-width: 768px) {
    width: 140px;
  }
}

.ai-welcome-message {
  background: #e0f2f7;
  color: #2a7e73;
  padding: 5px 5px;
  border-radius: 25px;
  margin: 20px auto;
  text-align: center;
  font-size: .85rem;
  line-height: 1.5;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  max-width: 80%;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 12px 20px;
    margin: 15px auto;
    max-width: 90%;
  }
}
</style>