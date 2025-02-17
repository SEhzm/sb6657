import { ElMessage, ElNotification } from 'element-plus';

export function copyError(err: any) {
    ElNotification({
        title: '复制失败',
        message: `复制操作失败，请稍后重试。
                可能你的浏览器不支持被动写入剪贴板，请换用其他浏览器`,
        type: 'error',
    });
    console.error('复制失败:', err);
}

export function copySuccess() {
    ElNotification({
        message: '复制成功',
        type: 'success',
    });
}

export function limitedCopy() {
    ElNotification({
        title: '请勿刷次数',
        message: '复制成功，但次数没有增加',
        type: 'warning',
    });
    return 'limitedSuccess';
}
export function limitedLike() {
    ElNotification({
        title: '请勿刷次数',
        message: '点赞成功，但次数没有增加',
        type: 'warning',
    });
    return 'limitedSuccess';
}

export function copyToClipboard(copyText: string): boolean {
    const inputDOM = document.createElement('input');
    inputDOM.value = copyText;
    document.body.appendChild(inputDOM);
    inputDOM.select();
    try {
        document.execCommand('Copy');
    } catch (err) {
        copyError(err);
        return false;
    }
    document.body.removeChild(inputDOM);
    return true;
}
