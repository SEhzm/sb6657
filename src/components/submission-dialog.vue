<template>
    <el-dialog v-model="dialogFormVisible" draggable title="投稿烂梗" width="82%">
        <!-- 预设标签 -->
        <h4>可选标签<el-popover :width="300">
                <template #reference>
                    <el-icon size="16">
                        <Warning />
                    </el-icon>
                </template>
                为解决烂梗分栏不足和分类不清晰问题。<br>
                <b>点击标签即可添加</b>
            </el-popover>
            <el-button link type="success" style="margin-left: 50%">投稿标签
                <el-popover :width="300">
                    <template #reference>
                        <el-icon size="16">
                            <QuestionFilled />
                        </el-icon>
                    </template>
                    <b>功能待完善(后续更新将添加)，请在上方(建议/提交)问卷投稿，sry。</b><br>
                    <b>审核巨严格，(重复，相似等)将不通过</b>
                </el-popover>
            </el-button>
        </h4>

        <div class="preset-tags-container">
            <div class="preset-tags">
                <el-tag round v-for="(tag, index) in presetTags" :key="index" closable @close="removeTagFromPreset(tag)"
                    @click="removeTagFromPreset(tag)" style=" padding:15px; cursor: pointer;font-size: 16px;"
                    type="primary">
                    <img v-if="tag.iconUrl" :src="tag.iconUrl" style=" width: 22px; height: 22px; object-fit: cover;vertical-align: middle;" />
                    <span style="vertical-align: middle;"> {{ tag.label }}</span>
                </el-tag>
            </div>
        </div>

        <!-- 已添加标签 -->
        <h4>已选标签
            <el-popover :width="300">
                <template #reference>
                    <el-icon size="16">
                        <Warning />
                    </el-icon>
                </template>
                <b>最少一个标签，最多五个标签。</b>
            </el-popover>
        </h4>

        <div class="added-tags">
            <el-tag round v-for="(tag, index) in addedTags" :key="index" closable @click="removeTag(tag)"
                @close="removeTag(tag)" style="padding:15px; cursor: pointer;font-size: 16px;" effect="dark">
                {{ tag.label }}
            </el-tag>
        </div>
        <el-input v-model="barrage" maxlength="255" autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }"
            show-word-limit type="textarea" placeholder=" 烂梗...."></el-input>
        <template #footer>

            <el-button type="plain" @click="dialogFormVisible=false">关闭</el-button>
            <el-button type="primary" @click="saveBarrage">投稿</el-button>
        </template>
    </el-dialog>

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
                iconUrl: item.iconUrl,
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

// 添加标签的点击事件
const removeTagFromPreset = (tag) => {
    if (addedDictValues.value.length >= 5) {
        ElNotification.info("最多5个标签")
        return
    }
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
            }else if (res.code === '500') {
                ElNotification.error("烂梗已经有了，勿重复提交")
            } else {
                ElNotification.error("请求失败");
            }
        }).catch(err => {
            console.error('投稿失败', err);
            ElNotification.error("请求失败");
        });
    }
};
const dialogFormVisible = defineModel();
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
    margin-bottom: 20px;
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
    min-height: 40px;
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
}

.added-tags .el-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}
</style>