<template>
    <div class="update-timeline">
        <h2 class="title">
            更新日志
            <span class="tips">(与源码 更新日志.md 同步)</span>
        </h2>
        <el-timeline>
            <el-timeline-item v-for="version in parsedVersions" :key="version.version" :timestamp="version.date" placement="top">
                <h3>{{ version.version }}</h3>
                <ul>
                    <li v-for="(item, index) in version.updates" :key="index" :class="getUpdateTypeClass(item.type)" class="update-content">
                        <strong>【{{ item.type }}】</strong>
                        <span class="content-text">{{ item.content }}</span>
                    </li>
                </ul>
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import updateMd from '/更新日志.md?raw';
import { ElTimeline, ElTimelineItem } from 'element-plus';

interface UpdateItem {
    type: string;
    content: string;
}

interface VersionInfo {
    version: string;
    date: string;
    updates: UpdateItem[];
}

// 将版本号转换为日期格式
function convertVersionToDate(versionStr: string): string {
    // 提取版本号中的日期部分，如 "25.7.07" -> "2025-07-07"
    const match = versionStr.match(/(\d{2})\.(\d{1,2})\.(\d{1,2})/);
    if (match) {
        const [, year, month, day] = match;
        const fullYear = `20${year}`;
        const paddedMonth = month.padStart(2, '0');
        const paddedDay = day.padStart(2, '0');
        return `${fullYear}-${paddedMonth}-${paddedDay}`;
    }
    return versionStr; // 如果无法解析，返回原始字符串
}

// 解析更新日志 Markdown 字符串
function parseUpdateLog(): VersionInfo[] {
    const versions: VersionInfo[] = [];

    // 按版本分割
    const versionBlocks = updateMd.split(/## 版本【/).filter((block) => block.trim());

    versionBlocks.forEach((block) => {
        const lines = block.trim().split('\n');
        if (lines.length === 0) return;

        // 提取版本号
        const versionMatch = lines[0].match(/^([^】]+)】/);
        if (!versionMatch) return;

        const versionNumber = versionMatch[1];
        const version = `版本【${versionNumber}】`;
        const date = convertVersionToDate(versionNumber);
        const updates: UpdateItem[] = [];

        // 解析更新项
        let currentUpdate: UpdateItem | null = null;

        lines.slice(1).forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) return;

            // 匹配格式：数字、【类型】内容
            const updateMatch = trimmedLine.match(/^\d+、【([^】]*)】(.*)$/);
            if (updateMatch) {
                // 如果有之前的更新项，先保存
                if (currentUpdate) {
                    updates.push(currentUpdate);
                }

                let type = updateMatch[1].trim();
                let content = updateMatch[2].trim();

                // 处理空类型或只有空格的类型
                if (!type) {
                    type = '其他';
                }

                // 创建新的更新项
                currentUpdate = {
                    type,
                    content,
                };
            } else if (trimmedLine.match(/^\d+、/)) {
                // 匹配没有类型标记的更新项：数字、内容
                if (currentUpdate) {
                    updates.push(currentUpdate);
                }

                const cleanContent = trimmedLine.replace(/^\d+、/, '').trim();
                if (cleanContent) {
                    currentUpdate = {
                        type: '其他',
                        content: cleanContent,
                    };
                }
            } else if (currentUpdate && (line.startsWith('\t') || line.startsWith('​') || line.match(/^\s{2,}/))) {
                // 处理缩进的多行内容，合并到当前更新项
                currentUpdate.content += '\n' + trimmedLine;
            } else if (trimmedLine && !trimmedLine.startsWith('##')) {
                // 其他非空行，如果没有当前更新项就创建一个
                if (!currentUpdate) {
                    currentUpdate = {
                        type: '其他',
                        content: trimmedLine,
                    };
                } else {
                    // 如果有当前更新项，追加到内容中
                    currentUpdate.content += '\n' + trimmedLine;
                }
            }
        });

        // 保存最后一个更新项
        if (currentUpdate && currentUpdate.content.trim()) {
            updates.push(currentUpdate);
        }

        if (updates.length > 0) {
            versions.push({ version, date, updates });
        }
    });

    // 倒序排列，最新版本在最上面
    return versions.reverse();
}

// 静态解析结果
const parsedVersions = ref<VersionInfo[]>(parseUpdateLog());

// 根据更新类型返回对应的CSS类
function getUpdateTypeClass(type: string): string {
    switch (type) {
        case '新增':
            return 'update-type-add';
        case '修复':
            return 'update-type-fix';
        case '优化':
            return 'update-type-optimize';
        case '删除':
            return 'update-type-delete';
        default:
            return 'update-type-other';
    }
}
</script>

<style lang="scss" scoped>
.update-timeline {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background-color: #fff;
    .title {
        margin-bottom: 16px;
        font-size: 20px;
        color: #303133;
        .tips {
            font-weight: normal;
            font-size: 12px;
            color: gray;
            font-style: italic;
        }
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin-bottom: 6px;
        font-size: 14px;
        color: #606266;

        strong {
            margin-right: 6px;
        }

        .content-text {
            white-space: pre-line;
            line-height: 1.6;
        }
    }

    // 不同类型的颜色标识
    .update-type-add strong {
        color: #67c23a;
    }
    .update-type-fix strong {
        color: #e6a23c;
    }
    .update-type-optimize strong {
        color: #409eff;
    }
    .update-type-delete strong {
        color: #f56c6c;
    }
    .update-type-other strong {
        color: #909399;
    }
}

// 移动端适配
@media (max-width: 600px) {
    .update-timeline {
        padding: 15px;
        li {
            font-size: 13px;
        }
    }
}
</style>
