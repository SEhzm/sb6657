<template>
	<div>
		<div id="online-count">
			<p>当前在线人数: {{ onlineCount }}</p>
		</div>

		<el-button @click="closeWebSocket">关闭连接</el-button>
		<el-button @click="reconnectWebSocket"
			v-if="!websocket.value || websocket.value.readyState !== WebSocket.OPEN">重新连接</el-button>
		<div id="message-container" ref="messageContainer">
			<div v-for="(msg, index) in messages" :key="index"
				:class="{ 'message-bubble': true, 'mine': msg.isMine, 'others': !msg.isMine }">
				<span class="time">{{ msg.time }}</span>
				<p>{{ msg.text }}</p>
			</div>
		</div>
		<el-input id="userId" type="text" v-model="userId" :disabled="firstIn" maxlength="10"
			placeholder="请输入您的ID(你只能输入一次，请谨慎)" />
		<el-input id="text" type="text" v-model="message" maxlength="30" placeholder="请输入内容" />
		<el-button class="btn-animate btn-animate__vibrate" type="primary" @click="send">发送消息</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import httpInstance from "@/apis/httpInstance";

interface Message {
	text: string;
	isMine: boolean;
	time: string;
}

interface WebSocketData {
	type: string;
	message?: string;
	userId?: string;
	count?: number;
}

const websocket = ref<WebSocket | null>(null);
const clientId = ref<string>(Math.random().toString(36).substr(2));
const userId = ref<string>(''); // 用户输入的ID
const message = ref<string>('');
const isFilter = ref<boolean>(false);
const messages = ref<Message[]>([]);
const onlineCount = ref<number>(0);

const firstIn = ref<boolean>(false);
const messageContainer = ref<HTMLElement | null>(null); // 引用消息容器

// 判断当前浏览器是否支持WebSocket
if ('WebSocket' in window) {
	websocket.value = new WebSocket(`wss://dgq63136.icu:9090/machine/ws/${clientId.value}`);
} else {
	ElMessageBox.alert('浏览器不支持在线聊天', '😣', {
		confirmButtonText: 'OK',
	});
}
//过滤敏感词
const filterWord = async () => {
	try {
		const res = await httpInstance.post("https://easycomment.ai/api/xhs/v1/detect-sensitive-words", {
			content: message.value
		});
		// console.log(res);
		if (res.data.sensitive_words.length > 0) {
			await ElMessageBox.alert('您的内容中包含一些可能不适宜的词语，建议您检查并修改', '❌❌❌', {
				confirmButtonText: '好的',
			});
			// 有敏感词，直接返回 false
			return false;
		} else {
			// 没有敏感词
			isFilter.value = true;
			return true;
		}
	} catch (error) {
		return false;
	}
};


// 连接发生错误的回调方法
const onWebSocketError = () => {
	messages.value.push({ text: 'error', isMine: false, time: getCurrentTime() });
};

// 连接成功建立的回调方法
const onWebSocketOpen = () => {
	if (localStorage.getItem('userId')) {
		firstIn.value = true;
		userId.value = localStorage.getItem('userId')!;
	}
	scrollToBottom();
	messages.value.push({ text: '连接成功：仅显示近20条记录', isMine: false, time: getCurrentTime() });
};

// 接收到消息的回调方法
const onWebSocketMessage = (event: MessageEvent) => {
	try {
		const data: WebSocketData = JSON.parse(event.data);
		if (data.type === 'onlineCount' && data.count !== undefined) {
			onlineCount.value = data.count;
		} else if (data.type === 'serverMessage' && data.message) {
			messages.value.push({ text: data.message, isMine: false, time: getCurrentTime() });
		} else if (data.type === 'clientMessage' && data.message && data.userId) {
			const isMine = data.userId === userId.value;
			const userMessage = `${data.userId} ：${data.message}`;
			messages.value.push({ text: userMessage, isMine, time: getCurrentTime() });
		} else {
			console.error('未知的消息类型:', data);
		}
	} catch (error) {
		console.error('解析消息失败:', event.data, error);
		messages.value.push({ text: '解析消息失败', isMine: false, time: getCurrentTime() });
	}
};

// 连接关闭的回调方法
const onWebSocketClose = () => {
	messages.value.push({ text: '连接已关闭', isMine: false, time: getCurrentTime() });
};

// 发送消息
const send = async () => {
	const isPassFilter = await filterWord();  // 等待过滤词语结果
	if (!isPassFilter) {
		// 如果过滤没有通过，直接返回，不发送消息
		return;
	}
	if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
		localStorage.setItem('userId', userId.value);
		if (localStorage.getItem('userId') && message.value.trim() && isFilter.value === true) {
			firstIn.value = true;
			userId.value = localStorage.getItem('userId')!;
			websocket.value.send(JSON.stringify({
				type: 'clientMessage',
				message: message.value,
				userId: userId.value,
				time: getCurrentTime()
			}));
			message.value = ''; // 清空输入框
			scrollToBottom(); // 滚动到最底部
		} else {
			ElMessageBox.alert('请输入名字和内容', '☝️🤓', {
				confirmButtonText: 'OK',
			});
		}
	} else {
		ElMessageBox.alert('☝️🤓请点击重新连接', '连接未打开', {
			confirmButtonText: 'OK',
		});
	}
};

// 关闭连接
const closeWebSocket = () => {
	if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
		websocket.value.close();
	}
};

// 重新连接
const reconnectWebSocket = () => {
	if (!websocket.value || websocket.value.readyState !== WebSocket.CONNECTING) {
		websocket.value = new WebSocket(`wss://dgq63136.icu:9090/machine/ws/${clientId.value}`);
		websocket.value.onerror = onWebSocketError;
		websocket.value.onopen = onWebSocketOpen;
		websocket.value.onmessage = onWebSocketMessage;
		websocket.value.onclose = onWebSocketClose;
	}
};

// 获取当前时间
const getCurrentTime = (): string => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 滚动到最底部
const scrollToBottom = () => {
	if (messageContainer.value) {
		setTimeout(() => {
			messageContainer.value?.scrollTo({
				top: messageContainer.value.scrollHeight,
				behavior: 'smooth',
			});
		}, 20);
	}
};

// 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接
onBeforeUnmount(() => {
	closeWebSocket();
});

onMounted(() => {
	if (websocket.value) {
		websocket.value.onerror = onWebSocketError;
		websocket.value.onopen = onWebSocketOpen;
		websocket.value.onmessage = onWebSocketMessage;
		websocket.value.onclose = onWebSocketClose;
	}
});
</script>

<style scoped lang="scss">
.btn-animate {
	position: relative;
	width: 130px;
	height: 40px;
	line-height: 40px;
	border: none;
	border-radius: 5px;
	background: #027efb;
	color: #fff;
	text-align: center;
}

@keyframes vibrate {
	60% {
		transform: scale3d(.8, .8, 1)
	}

	85% {
		transform: scale3d(1.1, 1.1, 1)
	}

	100% {
		transform: scale3d(1, 1, 1)
	}
}

@keyframes vibrate2 {
	to {
		opacity: 0;
		transform: scale3d(1, 1, 1)
	}
}

.btn-animate__vibrate {
	width: 100%;

	&::before {
		content: '';
		position: absolute;
		top: -15px;
		left: -15px;
		bottom: -15px;
		right: -15px;
		background: inherit;
		z-index: -1;
		opacity: 0.5;
		transform: scale3d(.6, .4, 1);
	}

	&:hover {
		&::before {
			animation: vibrate2 .3s .3s forwards;
		}

		animation: vibrate .3s forwards;
	}
}

#online-count {
	color: black;
}

#message-container {
	margin-top: 10px;
	padding: 10px;
	max-height: 200px;
	overflow-y: auto;
	background-color: #f9f9f9;
	border: 1px solid #e1e1e1;
}

.message-bubble {
	max-width: 70%;
	padding: 5px;
	margin-bottom: 10px;
	word-wrap: break-word;
	position: relative;
}

.mine {
	background-color: #d1f0ff;
	align-self: flex-end;
	text-align: right;
	margin-left: auto;
}

.others {
	background-color: #e1e1e1;
	align-self: flex-start;
	text-align: left;
	margin-right: auto;
}

.time {
	display: block;
	font-size: 0.8em;
	color: gray;
	margin-bottom: 5px;
}
</style>