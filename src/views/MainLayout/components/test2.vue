<template>
    
        <div class="card">
            <!-- 预设标签 -->
            <h3>预设标签</h3>
            <div class="preset-tags-container">
                <div class="preset-tags">
                    
                    <el-tag round v-for="(tag, index) in presetTags" :key="index" closable
                        @close="removeTagFromPreset(tag)" @click="removeTagFromPreset(tag)"
                        style=" padding:15px; cursor: pointer;font-size: 20px;" type="primary">
                        {{ tag.label }}
                    </el-tag>
                </div>
            </div>

            <!-- 已添加标签 -->
            <h3>已添加标签</h3>
            <div class="added-tags">
                <el-tag round v-for="(tag, index) in addedTags" :key="index" closable @click="removeTag(tag)"
                    @close="removeTag(tag)" style="padding:15px; cursor: pointer;font-size: 20px;" effect="dark">
                    {{ tag.label }}
                </el-tag>
            </div>
            <el-input v-model="barrage" placeholder="投稿"></el-input>
            <el-button type="primary" @click="saveBarrage">投稿</el-button>
        </div>
    
</template>

<script setup>
import { ElMessage, ElNotification } from 'element-plus';
import httpInstance from '@/apis/httpInstance';
import { API } from '@/constants/backend';
import { ref } from 'vue';

const barrage = ref('');
// 预设标签
const presetTags = ref([]);

// 已添加标签
const addedTags = ref([]);

// 已添加标签的 dictValue 数组
const addedDictValues = ref([]);

// 获取字典数据
function getDict() {
    httpInstance.get('/machine/dictList').then(res => {
        if (res.code === '200') {
            presetTags.value = res.data.map(item => ({
                label: item.dictLabel,
                value: item.dictValue
            }));
        }
    });
}

getDict();

// 删除已添加标签
const removeTag = (tag) => {
    addedTags.value = addedTags.value.filter(t => t.value !== tag.value);
    addedDictValues.value = addedDictValues.value.filter(value => value !== tag.value);
    presetTags.value.push(tag);
};

// 删除预设标签的点击事件
const removeTagFromPreset = (tag) => {
    // 当删除预设标签时，将其移到已添加标签
    if (!addedTags.value.some(t => t.value === tag.value)) {
        addedTags.value.push(tag);
        addedDictValues.value.push(tag.value);
        presetTags.value = presetTags.value.filter(t => t.value !== tag.value);
    }
};

const saveBarrage = () => {
    if (addedDictValues.value.length === 0 || barrage.value === '' || barrage.value === null) {
        ElNotification.error("请选择标签或输入弹幕");
    } else {
        if (addedDictValues.value.length > 5) {
            ElNotification.error('最少一个标签，最多五个标签。');
            return;
        }
        httpInstance.post(API.SUBMIT_MEME, {
            tags: addedDictValues.value.join(','),
            barrage: barrage.value
        }).then(res => {
            barrage.value = '';
            if (res.code === '200') {
                ElNotification.success("投稿成功，待审核(一天内)");
            } else {
                ElNotification.error("请求失败");
            }
        }).catch(err => {
            console.error('投稿失败', err);
            ElNotification.error("请求失败");
        });
    }
};
</script>

<style scoped>
h3 {
    margin-top: 20px;
}

/* 预设标签容器 */
.preset-tags-container {
    max-height: 100px;
    overflow-y: auto;
    margin-top: 10px;
}

/* 预设标签按钮的样式 */
.preset-tags {
    display: flex;
    flex-wrap: wrap;
}

.preset-tags .el-tag {
    position: relative;
    margin-right: 10px;
    margin-bottom: 10px;
}

::v-deep .preset-tags .el-tag__close {
    font-size: 30px;
    transform: rotate(45deg);
}

.added-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
}

.added-tags .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>