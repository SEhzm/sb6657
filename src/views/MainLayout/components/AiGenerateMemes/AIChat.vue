<template>
  <div class="ai-chat-wrapper">
    <!-- ========== 左侧:会话列表 ========== -->
    <aside class="session-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <span v-show="!sidebarCollapsed">会话记录</span>
        <button class="toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed">
          {{ sidebarCollapsed ? '▶' : '◀' }}
        </button>
      </div>
      <button v-show="!sidebarCollapsed" class="new-chat-btn" @click="startNewChat">
        + 新建对话
      </button>
      <div v-show="!sidebarCollapsed" class="session-list">
        <div
          v-for="s in sessions"
          :key="s.id"
          :class="['session-item', { active: s.id === currentSessionId }]"
          @click="switchSession(s.id)"
        >
          <div class="session-info">
            <div class="session-title">{{ s.title }}</div>
            <div class="session-meta">
              <span :class="['type-badge', s.sessionType === 'MEME' ? 'meme' : 'chat']">
                {{ s.sessionType === 'MEME' ? '🎮' : '💬' }}
              </span>
              <span class="msg-count">{{ s.messageCount }}条</span>
            </div>
          </div>
          <button
            class="delete-btn"
            @click.stop="confirmDeleteSession(s.id)"
            title="删除会话"
          >
            🗑️
          </button>
        </div>
        <div v-if="sessions.length === 0" class="empty-hint">暂无会话</div>
      </div>
    </aside>

    <!-- ========== 右侧：聊天主区域 ========== -->
    <main class="chat-main">
      <!-- 顶部标题栏 -->
      <header class="chat-header">
        <h3>{{ currentTitle || 'AI造梗助手' }}</h3>
      </header>

      <!-- 消息列表 -->
      <div class="chat-window" ref="chatWindow">
        <div v-if="messages.length === 0 && !streaming" class="welcome-msg">
          <div class="welcome-icon">🤖</div>
          <h2>AI造梗助手</h2>
          <p>自动识别造梗/聊天/赛事分析 · 联网搜索最新赛事</p>
          <div class="quick-actions">
            <button @click="quickPrompt('帮我造几个CS2 Major的梗')">🎮 造CS2梗</button>
            <button @click="quickPrompt('分析最近的电竞赛事')">📊 赛事分析</button>
            <button @click="quickPrompt('聊聊Dota2的趣事')">💬 聊电竞</button>
          </div>
        </div>

        <!-- 历史消息 -->
        <div v-for="(msg, idx) in messages" :key="'msg-' + idx" :class="['msg-row', msg.role]">
          <img class="avatar" :src="msg.role === 'user' ? userAvatar : aiAvatar" :alt="msg.role" />
          <div class="msg-body">
            <details v-if="msg.thinkingContent" class="thinking-block">
              <summary>🧠 思考过程</summary>
              <div class="thinking-text">{{ msg.thinkingContent }}</div>
            </details>
            <div class="msg-content markdown-body" v-html="renderMd(msg.content)"></div>
            <div class="msg-time">{{ msg.createTime || '' }}</div>
          </div>
        </div>

        <!-- 流式加载中 -->
        <div v-if="streaming" class="msg-row assistant">
          <img class="avatar" :src="aiAvatar" alt="AI" />
          <div class="msg-body">
            <details v-if="showThinking && streamThinking" class="thinking-block" open>
              <summary>🧠 思考中...</summary>
              <div class="thinking-text">{{ streamThinking }}</div>
            </details>
            <div class="msg-content markdown-body">
              <span v-if="!streamContent" class="waiting-text">等待AI响应...</span>
              <div v-else v-html="renderMd(streamContent)"></div>
            </div>
            <span class="cursor-blink">|</span>
          </div>
        </div>
      </div>

      <!-- 输入区 -->
      <form class="input-area" @submit.prevent="sendMessage">
        <div class="input-row">
          <textarea
            ref="inputRef"
            v-model="prompt"
            placeholder="输入内容... (自动检测造梗/聊天/赛事分析)"
            :disabled="streaming"
            rows="1"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.shift.enter.prevent="prompt += '\n'"
            @input="autoResize"
          ></textarea>
          <button type="submit" :disabled="streaming || !prompt.trim()" class="send-btn">
            {{ streaming ? '⏳' : '发送' }}
          </button>
        </div>
        <div class="input-options">
          <label class="option-item">
            <input type="checkbox" v-model="showThinking" :disabled="streaming" />
            查看思考过程
          </label>
          <span class="divider">|</span>
          <span class="usage-hint">今日剩余 {{ dailyRemaining }} 次</span>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import httpInstance from '@/apis/httpInstance';
import { ElMessage, ElMessageBox } from 'element-plus';
import aiAvatarUrl from '@/assets/imgs/user-img-0.png';
import userAvatarUrl from '@/assets/icons/ai_chat_user.svg';

// ========== 配置 marked ==========
marked.setOptions({ breaks: true, gfm: true });

// ========== 类型定义 ==========
interface Message {
  role: 'user' | 'assistant';
  content: string;
  thinkingContent?: string;
  createTime?: string;
}

interface SessionItem {
  id: number;
  title: string;
  sessionType: string;
  messageCount: number;
  updateTime: string;
}

// ========== 状态 ==========
const chatWindow = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);
const prompt = ref('');
const messages = ref<Message[]>([]);
const streaming = ref(false);
const streamContent = ref('');
const streamThinking = ref('');
const showThinking = ref(false);
const currentSessionId = ref<number | null>(null);
const currentTitle = ref('');
const sessions = ref<SessionItem[]>([]);
const sidebarCollapsed = ref(false);
const dailyRemaining = ref(50);
const aiAvatar = aiAvatarUrl;
const userAvatar = userAvatarUrl;

// ========== Markdown渲染 ==========
function renderMd(text: string): string {
  if (!text) return '';
  try {
    const html = marked.parse(text) as string;
    return DOMPurify.sanitize(html);
  } catch {
    return text.replace(/\n/g, '<br>');
  }
}

// ========== 滚动 ==========
async function scrollToBottom() {
  await nextTick();
  if (chatWindow.value) {
    chatWindow.value.scrollTo({
      top: chatWindow.value.scrollHeight,
      behavior: 'smooth',
    });
  }
}

// ========== textarea自动调整高度 ==========
function autoResize() {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
    inputRef.value.style.height = Math.min(inputRef.value.scrollHeight, 150) + 'px';
  }
}

// ========== 加载会话列表 ==========
/**
 * RuoYi axios 拦截器:
 *   成功时返回 res.data = { code: 200, msg: "...", data: ... }
 *   所以 `await httpInstance.get(...)` 的结果就是 { code, msg, data }
 *   实际业务数据在 .data 字段
 */
async function loadSessions() {
  const token = localStorage.getItem('Admin-Token');
  if (!token) {
    console.warn('[会话] 未登录，跳过加载');
    return;
  }
  try {
    const res: any = await httpInstance.get('/ai/sessions');
    // res = { code: 200, msg: "操作成功", data: [...] }
    const list = res.data;
    if (Array.isArray(list)) {
      sessions.value = list;
    } else {
      console.warn('[会话] 返回数据不是数组:', res);
      sessions.value = [];
    }
  } catch (e: any) {
    console.error('[会话] 加载失败:', e?.response?.status, e?.message);
    sessions.value = [];
  }
}

// ========== 加载会话消息 ==========
async function loadMessages(sessionId: number) {
  try {
    const res: any = await httpInstance.get(`/ai/sessions/${sessionId}/messages`);
    // res = { code: 200, msg: "...", data: [...] }
    const list = res.data;
    if (Array.isArray(list)) {
      messages.value = list.map((m: any) => ({
        role: m.role === 'USER' ? 'user' : 'assistant',
        content: m.content || '',
        thinkingContent: m.thinkingContent || undefined,
        createTime: m.createTime || '',
      }));
    } else {
      messages.value = [];
    }
    await scrollToBottom();
  } catch (e: any) {
    console.error('[消息] 加载失败:', e?.response?.status, e?.message);
    messages.value = [];
  }
}

// ========== 切换会话 ==========
async function switchSession(sessionId: number) {
  if (currentSessionId.value === sessionId) return;
  currentSessionId.value = sessionId;
  const s = sessions.value.find((item) => item.id === sessionId);
  currentTitle.value = s?.title || '';
  messages.value = [];
  streamContent.value = '';
  streamThinking.value = '';
  await loadMessages(sessionId);
}

// ========== 新建对话 ==========
function startNewChat() {
  currentSessionId.value = null;
  currentTitle.value = '';
  messages.value = [];
  streamContent.value = '';
  streamThinking.value = '';
}

// ========== 删除会话 ==========
async function confirmDeleteSession(sessionId: number) {
  try {
    await ElMessageBox.confirm('确定删除此会话？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    });
    await httpInstance.delete(`/ai/sessions/${sessionId}`);
    ElMessage.success('已删除');
    if (currentSessionId.value === sessionId) {
      startNewChat();
    }
    await loadSessions();
  } catch {
    /* 取消 */
  }
}

// ========== 快捷输入 ==========
function quickPrompt(text: string) {
  prompt.value = text;
}

// ========== 发送消息（SSE fetch方式） ==========
async function sendMessage() {
  if (!prompt.value.trim() || streaming.value) return;

  const userPrompt = prompt.value.trim();
  messages.value.push({
    role: 'user',
    content: userPrompt,
    createTime: new Date().toLocaleTimeString(),
  });
  prompt.value = '';
  streaming.value = true;
  streamContent.value = '';
  streamThinking.value = '';
  await scrollToBottom();

  const token = localStorage.getItem('Admin-Token');
  if (!token) {
    ElMessage.warning('请先登录！');
    streaming.value = false;
    return;
  }

  try {
    const resp = await fetch(`${httpInstance.defaults.baseURL}/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({
        prompt: userPrompt,
        needReasoning: showThinking.value,
        sessionId: currentSessionId.value,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 401) {
        ElMessage.warning('请先登录！');
      } else {
        ElMessage.error('请求失败: ' + resp.status);
      }
      streaming.value = false;
      return;
    }

    // 读取SSE流
    const reader = resp.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalSessionId: number | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 按双换行分割SSE事件块
      const eventBlocks = buffer.split('\n\n');
      // 最后一个可能不完整，放回buffer
      buffer = eventBlocks.pop() || '';

      for (const block of eventBlocks) {
        if (!block.trim()) continue;

        let eventName = '';
        let dataStr = '';

        for (const line of block.split('\n')) {
          if (line.startsWith('event:') || line.startsWith('event: ')) {
            eventName = line.replace(/^event:\s*/, '').trim();
          } else if (line.startsWith('data:') || line.startsWith('data: ')) {
            dataStr = line.replace(/^data:\s*/, '').trim();
          }
        }

        if (!dataStr) continue;

        try {
          const data = JSON.parse(dataStr);
          handleSseEvent(eventName || 'content', data);

          // 捕获会话ID和标题（done事件中会带）
          if (data.sessionId) {
            finalSessionId = data.sessionId;
          }
          if (data.title) {
            currentTitle.value = data.title;
          }
        } catch (e) {
          console.warn('[SSE] JSON解析失败:', dataStr);
        }
      }
    }

    // 流结束，保存AI回复到消息列表
    if (streamContent.value) {
      messages.value.push({
        role: 'assistant',
        content: streamContent.value,
        thinkingContent: streamThinking.value || undefined,
        createTime: new Date().toLocaleTimeString(),
      });
    }

    // 更新当前会话ID
    if (finalSessionId) {
      currentSessionId.value = finalSessionId;
    }

    // 刷新会话列表
    await loadSessions();
  } catch (e: any) {
    ElMessage.error('请求异常: ' + (e.message || '未知错误'));
  } finally {
    streaming.value = false;
    streamContent.value = '';
    streamThinking.value = '';
    await scrollToBottom();
  }
}

function handleSseEvent(eventType: string, data: any) {
  switch (eventType) {
    case 'connected':
      // 连接成功，忽略
      break;
    case 'thinking':
      streamThinking.value += data.content || '';
      scrollToBottom();
      break;
    case 'content':
      if (data.content) {
        streamContent.value += data.content;
        scrollToBottom();
      }
      break;
    case 'error':
      ElMessage.warning(data.content || '服务异常');
      streaming.value = false;
      break;
    case 'done':
      // 流结束标记，不做特殊处理（消息保存在外层处理）
      break;
    default:
      // 兼容没有event名的情况
      if (data.type === 'content' && data.content) {
        streamContent.value += data.content;
        scrollToBottom();
      } else if (data.type === 'thinking' && data.content) {
        streamThinking.value += data.content;
        scrollToBottom();
      }
      break;
  }
}

// ========== 加载今日剩余次数 ==========
async function loadDailyRemaining() {
  const token = localStorage.getItem('Admin-Token');
  if (!token) return;
  try {
    const res: any = await httpInstance.get('/ai/daily-remaining');
    if (res.data !== undefined) {
      dailyRemaining.value = res.data;
    }
  } catch {
    // 静默失败
  }
}

// ========== 生命周期 ==========
onMounted(async () => {
  await loadSessions();
  await loadDailyRemaining();

  // 如果有会话，自动进入最新的会话
  if (sessions.value.length > 0) {
    const latestSession = sessions.value[0]; // 假设后端返回的列表已按时间倒序排列
    await switchSession(latestSession.id);
  }
});
</script>

<style scoped>
/* ========== 布局 ========== */
.ai-chat-wrapper {
  display: flex;
  height: calc(90vh);
  background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
  color: #2c3e50;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ========== 左侧栏 ========== */
.session-sidebar {
  width: 240px;
  min-width: 240px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid #e1e8ed;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}
.session-sidebar.collapsed {
  width: 50px;
  min-width: 50px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 12px;
  font-weight: 600;
  font-size: 15px;
  color: #34495e;
  border-bottom: 1px solid #e1e8ed;
}
.toggle-btn {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}
.toggle-btn:hover {
  background: rgba(52, 152, 219, 0.1);
}

.new-chat-btn {
  margin: 12px;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}
.new-chat-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.session-item:hover {
  background: rgba(52, 152, 219, 0.08);
}
.session-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-left: 3px solid #667eea;
}

.session-info {
  flex: 1;
  min-width: 0;
}

.session-title {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #2c3e50;
  font-weight: 500;
}
.session-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 11px;
  color: #95a5a6;
}
.type-badge.meme { color: #f39c12; }
.type-badge.chat { color: #3498db; }

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  opacity: 0;
  transition: all 0.2s;
  border-radius: 4px;
  margin-left: 8px;
}
.session-item:hover .delete-btn {
  opacity: 1;
}
.delete-btn:hover {
  background: rgba(231, 76, 60, 0.1);
  transform: scale(1.1);
}

.empty-hint {
  text-align: center;
  color: #bdc3c7;
  margin-top: 40px;
  font-size: 13px;
}

/* ========== 主区域 ========== */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: rgba(255, 255, 255, 0.7);
}
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e1e8ed;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.chat-header h3 {
  margin: 0;
  font-size: 17px;
  color: #2c3e50;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
  font-weight: 600;
}
.model-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* ========== 消息窗口 ========== */
.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  scroll-behavior: smooth;
}
.welcome-msg {
  text-align: center;
  margin-top: 10vh;
}
.welcome-icon { font-size: 56px; }
.welcome-msg h2 {
  color: #667eea;
  margin: 16px 0 6px;
  font-size: 24px;
  font-weight: 600;
}
.welcome-msg p {
  color: #7f8c8d;
  font-size: 15px;
  margin-bottom: 28px;
}
.quick-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.quick-actions button {
  padding: 10px 20px;
  background: #fff;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}
.quick-actions button:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* ========== 消息气泡 ========== */
.msg-row {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  max-width: 85%;
}
.msg-row.user {
  margin-left: auto;
  flex-direction: row-reverse;
}
.msg-row.assistant {
  margin-right: auto;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.msg-body {
  flex: 1;
  min-width: 0;
}
.msg-content {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.msg-row.user .msg-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-bottom-right-radius: 4px;
}
.msg-row.assistant .msg-content {
  background: #fff;
  color: #2c3e50;
  border-bottom-left-radius: 4px;
  border: 1px solid #e1e8ed;
}
.msg-time {
  font-size: 11px;
  color: #95a5a6;
  margin-top: 4px;
  padding: 0 4px;
}

/* ========== 思考过程 ========== */
.thinking-block {
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #7f8c8d;
  border: 1px solid #e1e8ed;
}
.thinking-block summary {
  cursor: pointer;
  color: #667eea;
  font-weight: 600;
}
.thinking-text {
  margin-top: 6px;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
}

/* ========== 流式光标 ========== */
.waiting-text {
  color: #95a5a6;
  font-style: italic;
}
.cursor-blink {
  animation: blink 1s infinite;
  color: #667eea;
  font-weight: bold;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ========== 输入区 ========== */
.input-area {
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid #e1e8ed;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}
.input-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}
.input-row textarea {
  flex: 1;
  padding: 12px 16px;
  background: #fff;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  color: #2c3e50;
  font-size: 14px;
  resize: none;
  outline: none;
  min-height: 44px;
  max-height: 150px;
  font-family: inherit;
  transition: all 0.3s;
}
.input-row textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
.send-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}
.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.input-options {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  font-size: 13px;
  color: #7f8c8d;
}
.option-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}
.option-item input { accent-color: #667eea; }
.divider { color: #dfe6e9; }
.usage-hint {
  color: #667eea;
  font-weight: 500;
}

/* ========== Markdown渲染 ========== */
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 10px 0 6px;
  color: #667eea;
  font-weight: 600;
}
.markdown-body :deep(p) { margin: 6px 0; }
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 20px;
  margin: 6px 0;
}
.markdown-body :deep(code) {
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  color: #667eea;
}
.markdown-body :deep(pre) {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 10px;
  overflow-x: auto;
  border: 1px solid #e1e8ed;
}
.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  color: #2c3e50;
}
.markdown-body :deep(table) {
  border-collapse: collapse;
  margin: 10px 0;
  font-size: 13px;
  width: 100%;
}
.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #e1e8ed;
  padding: 8px 12px;
  text-align: left;
}
.markdown-body :deep(th) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  font-weight: 600;
}
.markdown-body :deep(blockquote) {
  border-left: 4px solid #667eea;
  margin: 8px 0;
  padding: 6px 14px;
  color: #7f8c8d;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 0 8px 8px 0;
}
.markdown-body :deep(strong) {
  color: #667eea;
  font-weight: 600;
}
.markdown-body :deep(a) {
  color: #667eea;
  text-decoration: none;
  border-bottom: 1px dashed #667eea;
}
.markdown-body :deep(a:hover) {
  color: #764ba2;
  border-bottom-color: #764ba2;
}
</style>
