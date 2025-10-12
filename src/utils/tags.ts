import type { getMemeTags as memeTag } from '@/types/meme';
/**
 * 解析标签显示信息，把后台给的标签字符串转换成真正显示的标签信息
 * @param tagNums 标签数字字符串，例如：'01,02,03'
 * @param memeTags 标签数组，一般从useMemeTagsStore里取
 * @returns 真正显示的标签信息数组，label是标签名，iconUrl是标签图标
 */
export function getDisplayTags(tagNums: string | undefined, memeTags: memeTag[]): { label: string; iconUrl: string }[] {
    if (!tagNums) return [];
    const tagsArr = tagNums.split(',');
    return memeTags.filter((item) => tagsArr.includes(item.dictValue)).map((item) => ({ label: item.dictLabel, iconUrl: item.iconUrl }));
}
