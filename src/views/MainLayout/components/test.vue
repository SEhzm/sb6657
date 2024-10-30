<template>
	<div>
		<div id="online-count">
			<p>当前在线人数: {{ onlineCount }}</p>
		</div>


		<el-button @click="closeWebSocket">关闭连接</el-button>
		<el-button @click="reconnectWebSocket"
			v-if="!websocket.value || websocket.value.readyState !== WebSocket.OPEN">重新连接</el-button>

		<div id="message-container">
			<div v-for="(msg, index) in messages" :key="index"
				:class="{ 'message-bubble': true, 'mine': msg.isMine, 'others': !msg.isMine }">
				<p>{{ msg.text }}</p>
			</div>
		</div>
		<el-input id="userId" type="text" v-model="userId" :disabled="firstIn" placeholder="请输入您的ID(你只能输入一次，请谨慎)" />
		<el-input id="text" type="text" v-model="message" placeholder="请输入内容" /><el-button
			@click="send">发送消息</el-button>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus'

const websocket = ref(null);
const clientId = ref(Math.random().toString(36).substr(2));
const userId = ref(''); // 用户输入的ID
const message = ref('');
const messages = ref([]);
const onlineCount = ref(0);

const firstIn = ref(false);

// 判断当前浏览器是否支持WebSocket
if ('WebSocket' in window) {
	websocket.value = new WebSocket(`ws://localhost:9090/machine/ws/${clientId.value}`);
} else {
	alert('Not support websocket');
}
//连接发生错误的回调方法
const onWebSocketError = () => {
	messages.value.push({ text: 'error', isMine: false });
};

//连接成功建立的回调方法
const onWebSocketOpen = () => {
	if (!localStorage.getItem("userId") == '') {
		firstIn.value = true;
		userId.value = localStorage.getItem("userId");
	}
	messages.value.push({ text: '连接成功', isMine: false });
};

//接收到消息的回调方法
const onWebSocketMessage = (event) => {
	try {
		const data = JSON.parse(event.data);
		// console.log('接收到的消息:', data);
		if (data.type === 'onlineCount') {
			onlineCount.value = data.count;
		} else if (data.type === 'serverMessage') {
			messages.value.push({ text: data.message, isMine: false });
		} else if (data.type === 'clientMessage') {
			const isMine = data.userId === userId.value;
			const userMessage = `${data.userId} ：${data.message}`;
			messages.value.push({ text: userMessage, isMine });
		} else {
			console.error('未知的消息类型:', data);
		}
	} catch (error) {
		console.error('解析消息失败:', event.data, error);
		messages.value.push({ text: '解析消息失败', isMine: false });
	}
};

//连接关闭的回调方法
const onWebSocketClose = () => {
	messages.value.push({ text: '连接已关闭', isMine: false });
};

//发送消息
const send = () => {
	if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
		localStorage.setItem("userId", userId.value)
		if (!localStorage.getItem("userId") == '' && !message.value=='') {
			firstIn.value = true;
			userId.value = localStorage.getItem("userId");
			websocket.value.send(JSON.stringify({ type: 'clientMessage', message: message.value, userId: userId.value }));
			message.value = ''; // 清空输入框
		} else {
			ElMessageBox.alert('请输入名字和内容', '请输入名字和内容', {
				confirmButtonText: 'OK',
			})
		}
	}
};

//关闭连接
const closeWebSocket = () => {
	if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
		websocket.value.close();
	}
};

//重新连接
const reconnectWebSocket = () => {
	if (!websocket.value || websocket.value.readyState !== WebSocket.CONNECTING) {
		websocket.value = new WebSocket(`ws://localhost:9090/machine/ws/${clientId.value}`);
		websocket.value.onerror = onWebSocketError;
		websocket.value.onopen = onWebSocketOpen;
		websocket.value.onmessage = onWebSocketMessage;
		websocket.value.onclose = onWebSocketClose;
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

<style scoped>
#online-count{
    color: black;
}
#message-container {
	margin-top: 10px;
	padding: 10px;
	max-height: 300px;
	overflow-y: auto;
	background-color: #f9f9f9;
	border: 1px solid #e1e1e1;
	border-radius: 10px;
}

.message-bubble {
	max-width: 60%;
	padding: 10px;
	margin-bottom: 10px;
	border-radius: 10px;
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
</style>
