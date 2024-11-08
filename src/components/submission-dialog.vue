<template>
    <el-dialog v-model="dialogFormVisible" draggable title="投稿弹幕" width="82%">
        <el-form :model="inputMeme" label-width="100px" :rules="rules" label-position="right">
            <el-form-item label="分栏" :label-width="100" prop="category">
                <el-select v-model="inputMeme.category" placeholder="选择上传的分栏">
                    <el-option label="喷玩机器篇" value="machine_penWJQ" />
                    <el-option label="木柜子篇" value="machine_mygo" />
                    <el-option label="直播间互喷篇" value="machine_ZbjHuPen" />
                    <el-option label="喷选手篇" value="machine_penPlayer" />
                    <el-option label="+1" value="machine_p1" />
                    <el-option label="群魔乱舞篇" value="machine_QMLW" />
                    <el-option label="QUQU" value="machine_QUQU" />
                </el-select>
            </el-form-item>
            <el-form-item label="弹幕内容" prop="content">
                <el-input maxlength="255" v-model="inputMeme.content" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit type="textarea" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">关闭</el-button>
                <el-button type="primary" @click="saveBarrage">投稿并关闭</el-button>
                <el-button type="primary" @click="continuousSaveBarrage">连续投稿</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { ElNotification } from 'element-plus';
import httpInstance from '@/apis/httpInstance';

const dialogFormVisible = defineModel();

const rules = {
    category: [{ required: true, message: '请选择分栏', trigger: 'blur' }],
    content: [{ required: true, message: '请输入弹幕', trigger: 'blur' }],
};

const inputMeme = reactive({
    category: '',
    content: '',
});

//提交并关闭
const saveBarrage = () => {
    if (inputMeme.category === '' || inputMeme.content === '') {
        ElNotification.error('请选择分栏或输入弹幕');
    } else {
        httpInstance
            .post('/machine/addUnaudit', {
                table: inputMeme.category,
                barrage: inputMeme.content,
            })
            .then((res) => {
                dialogFormVisible.value = false;
                inputMeme.content = '';
                inputMeme.category = '';
                if (res.code === '200') {
                    ElNotification.success('投稿成功，待审核(一天内)');
                } else {
                    ElNotification.error('请求失败');
                }
            });
    }
};

//连续提交
const continuousSaveBarrage = () => {
    if (inputMeme.category === '' || inputMeme.content === '') {
        ElNotification.error('请选择分栏或输入弹幕');
    } else {
        httpInstance
            .post('/machine/addUnaudit', {
                table: inputMeme.category,
                barrage: inputMeme.content,
            })
            .then((res) => {
                inputMeme.content = '';
                if (res.code === '200') {
                    ElNotification.success('投稿成功，待审核(一天内)');
                } else {
                    ElNotification.error('投稿失败，必要时请及时反馈');
                }
            });
    }
};
</script>
<style scoped lang="scss"></style>
