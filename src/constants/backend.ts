export const SERVER_ADDRESS = 'https://hguofichp.cn:10086';

export const API = {
    INCREASE_COPY_COUNT: '/machine/addCnt',             // 增加复制次数
    INCREASE_LIKE_COUNT: '/machine/like',               // 增加复制次数
    GET_HOT_MEME_24h: '/machine/hotBarrageOf24H',       // 获取24小时热门烂梗
    GET_HOT_MEME_7D: '/machine/hotBarrageOf7Day',       // 获取7天热门烂梗
    SEARCH_MEME: '/machine/Query',                      // 根据关键词搜索烂梗
    GET_ALL_MEME: '/machine/Page?',                     // 获取全部烂梗分页
    GET_SORTED_ALL_MEME: '/machine/sortAllBarrage',     // 获取排序后的全部烂梗
    GET_FK_WJQ_MEME: '/machine/Page?tags=00',           // 获取喷玩机器篇烂梗
    GET_FK_PLAYER_MEME: '/machine/Page?tags=01',        // 获取喷选手篇烂梗
    GET_P1_MEME: '/machine/Page?tags=02',               // 获取加一篇烂梗
    GET_MYGO_MEME: '/machine/Page?tags=05',             // 获取木柜子篇烂梗
    GET_FK_EACHOTHER_MEME: '/machine/Page?tags=09',     // 获取直播间互喷篇烂梗
    GET_QUQU_MEME: '/machine/Page?tags=03',             // 获取QUQU篇烂梗
    GET_SHOWTIME_MEME: '/machine/Page?tags=06',         // 获取群魔乱舞篇烂梗
    GET_RAND_ONE_MEME: '/machine/getRandOne',           // 随机一条烂梗
    SUBMIT_MEME: '/machine/submission',                 // 烂梗投稿
} as const;

import home_icon from '@/assets/icons/home_icon.svg';
import post_icon from '@/assets/icons/post-bar.svg';
import all_icon from '@/assets/icons/all_icon.svg';
import image_icon from '@/assets/icons/image_icon.svg';
import wjq_icon from '@/assets/icons/wjq_icon.svg';
import mygo_icon from '@/assets/icons/mygo_icon.svg';
import ZbjHuPen_icon from '@/assets/icons/ZbjHuPen_icon.svg';
import penPlayer_icon from '@/assets/icons/penPlayer_icon.svg';
import p1_icon from '@/assets/icons/p1_icon.svg';
import QMLW_icon from '@/assets/icons/QMLW_icon.svg';
import Z_icon from '@/assets/icons/Z_icon.png';
export const MemeCategory = [
    { path: '/home', text: '首页', icon: home_icon },
    { path: '/post-bar', text: '社区贴吧', icon: post_icon },
    { path: '/memes/AllBarrage', text: '全部烂梗', icon: all_icon, api: API.GET_ALL_MEME, category: 'allbarrage' },
    { path: '/image', text: '时光相册', icon: image_icon },
    { path: '/memes/penWJQ', text: '喷玩机器篇', icon: wjq_icon, api: API.GET_FK_WJQ_MEME, category: 'penWJQ' },
    { path: '/memes/mygo', text: '木柜子篇', icon: mygo_icon, api: API.GET_MYGO_MEME, category: 'mygo' },
    { path: '/memes/ZbjHuPen', text: '直播间互喷篇', icon: ZbjHuPen_icon, api: API.GET_FK_EACHOTHER_MEME, category: 'ZbjHuPen' },
    { path: '/memes/penPlayer', text: '喷选手篇', icon: penPlayer_icon, api: API.GET_FK_PLAYER_MEME, category: 'penPlayer' },
    { path: '/memes/p1', text: '+1', icon: p1_icon, api: API.GET_P1_MEME, category: 'p1' },
    { path: '/memes/QMLW', text: '群魔乱舞篇', icon: QMLW_icon, api: API.GET_SHOWTIME_MEME, category: 'QMLW' },
    { path: '/memes/QUQU', text: 'QUQU篇', icon: Z_icon, api: API.GET_QUQU_MEME, category: 'QUQU' },
];

declare global {
    type Meme = {
        tags: string; //tags
        content: string; // 梗内容
        category: string; // 分类
        id: string; // ID
        copyCount: number; // 复制次数
        likes: number; //点赞次数
        submitTime: string; // 投稿时间
    };
}
