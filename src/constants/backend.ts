export const SERVER_ADDRESS = 'https://dgq63136.icu:9090';

export const API = {
    INCREASE_COPY_COUNT: '/machine/addCnt', // 增加复制次数
    GET_HOT_MEME_24h: '/machine/hotBarrageOfAll', // 获取24小时热门烂梗
    GET_HOT_MEME_7D: '/machine/hotBarrageOf7Day', // 获取7天热门烂梗
    SEARCH_MEME: '/machine/Query', // 根据关键词搜索烂梗
    GET_ALL_MEME: '/machine/all/Page', // 获取全部烂梗分页
    GET_SORTED_ALL_MEME: '/machine/sortAllBarrage', // 获取排序后的全部烂梗
    GET_FK_WJQ_MEME: '/machine/penWJQ/Page', // 获取喷玩机器篇烂梗
    GET_FK_PLAYER_MEME: '/machine/penPlayer/Page', // 获取喷选手篇烂梗
    GET_P1_MEME: '/machine/p1/Page', // 获取加一篇烂梗
    GET_MYGO_MEME: '/machine/mygo/Page', // 获取木柜子篇烂梗
    GET_FK_EACHOTHER_MEME: '/machine/ZbjHuPen/Page', // 获取直播间互喷篇烂梗
    GET_QUQU_MEME: '/machine/QUQU/Page', // 获取QUQU篇烂梗
    GET_SHOWTIME_MEME: '/machine/QMLW/Page', // 获取群魔乱舞篇烂梗
    GET_RAND_ONE_MEME: '/machine/getRandOne', // 随机一条烂梗
    SUBMIT_MEME: '/machine/addUnaudit', // 烂梗投稿
} as const;

declare global {
    type Meme = {
        content: string; // 梗内容
        category: string; // 分类
        id: string; // ID
        copyCount: number; // 复制次数
    };
}
