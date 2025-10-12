// 简单格式化时间，把类似2025-01-01T12:00:00.000Z 格式化成2025-01-01 12:00:00
export function easyFormatTime(string: string | undefined) {
    if (!string) return '';
    return string.replace('T', ' ').split('.')[0];
}
