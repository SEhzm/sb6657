export const SERVER_ADDRESS = 'https://dgq63136.icu:9090';

export const API = {
    INCREASE_COPY_COUNT: '/machine/addCnt',
    GET_HOT_MEME_24h: '/machine/hotBarrageOfAll',
    GET_HOT_MEME_7D: '/machine/hotBarrageOf7Day',
    SEARCH_MEME: '/machine/Query',
} as const;

declare global {
    type Meme = {
        content: string; // 梗内容
        category: string; // 分类
        id: string; // ID
        copyCount: number; // 复制次数
    };
}
