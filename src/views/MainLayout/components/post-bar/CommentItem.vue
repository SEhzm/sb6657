<template>
    <div class="comment-item">
        <div class="comment-header">
            <img class="avatar" :src="getAvatar(comment.userId)" />
            <span class="username">
                {{ comment.userName }}
                <span style="color: #808080ff;" v-if="comment.toUserName"> <span style="color: #000;font-size: 12px;">回复</span> {{ comment.toUserName }} :</span> <span v-else>：</span>
            </span>
            <span>{{ comment.content }}</span>
        </div>
        <span class="time">{{ formatTime(comment.createTime) }}</span>
        <el-button text size="small" @click="likeCommentById(comment.id)"><img class="likeImg"
                src="/src/assets/icons/postNotLike.svg"> {{ comment.likeCount }}</el-button>
        <el-button text size="small" @click="replyTo">回复</el-button>

        <!-- 回复输入框弹窗 -->
        <el-dialog v-model="replyVisible" title="回复评论">
            <el-input v-model="replyContent" type="textarea" placeholder="请输入回复内容" rows="4" />
            <template #footer>
                <el-button @click="replyVisible = false">取消</el-button>
                <el-button type="primary" @click="submitReply">发送</el-button>
            </template>
        </el-dialog>

        <div v-if="comment.children?.length" :style="{ marginLeft: level === 1 ? '15px' : '0' }" class="child-comments">
            <CommentItem v-for="child in comment.children" :key="child.id" :comment="child" :level="(level || 0) + 1"
                @refresh="emit('refresh')" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, inject } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import httpInstance from '@/apis/httpInstance'

interface CommentType {
    id: number
    postId: number
    parentId: number
    userId: number
    userName: string
    content: string
    likeCount: number
    createTime: string
    isDelete: string
    toUserName: string
    children?: CommentType[] | null
}

const props = defineProps<{
    comment: CommentType
    level?: number
}>()

const emit = defineEmits(['refresh'])

const getAvatar = (userId: number) => {
    const randomNumber = Math.floor(Math.random() * 5)
    return `/src/assets/imgs/user-img-${randomNumber}.png`
}

const formatTime = (time: string) => new Date(time).toLocaleString()

const likeCommentById = async (commentId: number) => {
    try {
        const res = await httpInstance.post(`/machine/Post/Comment/like/${commentId}`)
        if (res.code === 200) {
            ElMessage.success('点赞成功')
            emit('refresh')
        } else {
            ElMessage.error('点赞失败')
        }
    } catch (error) {
        
    }
}

const replyContent = ref('')
const replyVisible = ref(false)

const replyTo = () => {
    replyContent.value = ''
    replyVisible.value = true
}

const submitReply = async () => {
    if (!replyContent.value.trim()) {
        ElMessage.warning('请输入回复内容')
        return
    }

    try {
        const res = await httpInstance.post('/machine/Post/Comment/reply', {
            postId: props.comment.postId,
            parentId: props.comment.id,
            toUserName: props.comment.userName,
            content: replyContent.value
        })

        if (res.code === 200) {
            ElMessage.success('回复成功')
            replyVisible.value = false
            emit('refresh') // 通知父组件刷新
        } else {
            ElMessage.error('回复失败')
        }
    } catch (err) {
        
    }
}
</script>

<style scoped lang="scss">
@media (min-width: 601px) {
    .comment-item {
        .likeImg {
            width: 18px;
            height: 18px;
            margin-right: 3px;
        }

        font-size: 15px;
        font-family: PingFang SC;
        margin-bottom: 15px;
    }

    .comment-header {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .username {
        color: #808080ff;
    }

    .time {
        margin-left: 30px;
        font-size: 12px;
        color: #999;
    }

    .avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }

    .child-comments {
        margin-top: 5px;
    }
}
@media (max-width:600px) {
    .comment-item {
        .likeImg {
            width: 18px;
            height: 18px;
            margin-right: 3px;
        }

        font-size: 14px;
        margin-bottom: 15px;
    }

    .comment-header {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .username {
        color: #808080ff;
    }

    .time {
        margin-left: 30px;
        font-size: 12px;
        color: #999;
    }

    .avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
    }

    .child-comments {
        margin-top: 5px;
    }
}
</style>