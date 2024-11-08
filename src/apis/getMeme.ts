import httpInstance from '@/apis/httpInstance';
import { API } from '@/constants/backend';
import { MemeCategory } from '@/constants/backend';
interface hotMeme_res {
    barrage: string;
    barrageId: number;
    cnt: number;
    hotDateTime: null;
    id: null;
    tableName: string;
}
interface getHotMeme_res {
    code: string;
    msg: string;
    data: hotMeme_res[];
}
async function getHotMeme(url: string, tips: string) {
    try {
        const res: getHotMeme_res = await httpInstance.get(url);
        if (!res?.data?.[0]?.barrage) {
            console.log(`获取${tips}烂梗失败`, res);
            return false;
        }
        const memeArr: Meme[] = res.data.map((item) => {
            return {
                content: item.barrage,
                category: item.tableName,
                id: `${item.barrageId}`,
                copyCount: item.cnt,
            };
        });
        return memeArr;
    } catch (err: any) {
        console.log(`获取${tips}烂梗失败`, err);
        return false;
    }
}
export function getHotMeme24h() {
    return getHotMeme(API.GET_HOT_MEME_24h, '24h热门');
}
export function getHotMeme7d() {
    return getHotMeme(API.GET_HOT_MEME_7D, '七天热门');
}

interface searchMeme_data {
    barrage: string;
    cnt: string;
    id: string;
}
interface searchMeme_res {
    code: string;
    data: searchMeme_data[];
    msg: string;
}
export async function searchMeme(searchKey: string) {
    console.log(`搜索词: ${searchKey}`);
    try {
        const res: searchMeme_res = await httpInstance.post(API.SEARCH_MEME, {
            QueryBarrage: searchKey,
        });
        if (res.data.length === 0) {
            console.log('未搜索到烂梗');
            return 'notfound';
        }
        const memeArr: Meme[] = res.data.map((item) => {
            return {
                content: item.barrage,
                category: 'allbarrage', // 由于目前搜索不返分类，所以分类写死成所有
                id: item.id,
                copyCount: +item.cnt,
            };
        });
        return memeArr;
    } catch (err: any) {
        console.log('搜索烂梗失败', err);
        return false;
    }
}

interface getMemeList_meme {
    id: string;
    barrage: string;
    cnt: string;
}
interface getMemeList_data {
    total: number;
    list: getMemeList_meme[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
}
interface getMemeList_res {
    code: string;
    msg: string;
    data: getMemeList_data;
}
export async function getMemeList(category: string, pageIndex: number, pageSize: number) {
    console.log(`请求烂梗分类: ${category}, 页数: ${pageIndex}, 每页烂梗数: ${pageSize}`);
    try {
        const api = MemeCategory.find((item) => item.category === category)?.api;
        if (!api) {
            throw new Error('未找到此分类');
        }
        const res: getMemeList_res = await httpInstance.get(api, {
            params: {
                pageNum: pageIndex,
                pageSize: pageSize,
            },
        });
        if (res.data?.list?.length <= 0) {
            throw new Error('请求到的烂梗列表为空');
        }
        const memeArr: Meme[] = res.data.list.map((item) => {
            return {
                content: item.barrage,
                id: item.id,
                category: category,
                copyCount: +item.cnt,
            };
        });
        return {
            memeArr,
            total: res.data.total,
        };
    } catch (err: any) {
        console.error('请求烂梗列表失败', err);
        return false;
    }
}
