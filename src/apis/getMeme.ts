import httpInstance from '@/apis/httpInstance';
import { API } from '@/constants/backend';
import { MemeCategory } from '@/constants/backend';
import type { getHotMeme_res, searchMeme_res, getMemeList_res, getData, getMemeTags } from '@/types/meme';

async function getHotMeme(url: string, tips: string) {
    try {
        const res: getHotMeme_res = await httpInstance.get(url);
        if (!res?.data?.[0]?.barrage) {
            console.log(`获取${tips}烂梗失败`, res);
            return false;
        }
        const memeArr: Meme[] = res.data.map((item) => {
            return {
                tags: item.tags,
                content: item.barrage,
                id: `${item.barrageId}`,
                copyCount: item.cnt,
                submitTime: item.submitTime,
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

// submitTime格式是yyyy-mm-dd
export async function searchMeme(searchKey: string, tags?: string[], submitTime?: [string, string] | []) {
    console.log(`搜索词: ${searchKey}, 标签: ${tags}, 投稿时间: ${submitTime}`);
    if (searchKey == null || searchKey == '') {
        return false;
    }
    try {
        const res: searchMeme_res = await httpInstance.post(API.SEARCH_MEME, {
            tags: tags?.join(',') || '',
            submitTime: submitTime || [],
            barrage: searchKey,
        });
        if (res.data.length === 0) {
            console.log('未搜索到烂梗');
            return 'notfound';
        }
        const memeArr: Meme[] = res.data.map((item) => {
            return {
                tags: item.tags,
                content: item.barrage,
                id: `${item.id}`,
                copyCount: Number(item.cnt),
                submitTime: item.submitTime,
            };
        });
        return memeArr;
    } catch (err: any) {
        console.log('搜索烂梗失败', err);
        return false;
    }
}

export async function getMemeList(category: string, pageIndex: number, pageSize: number, tags?: string) {
    console.log(`请求烂梗分类: ${category}, 页数: ${pageIndex}, 每页烂梗数: ${pageSize}`);
    try {
        const api = MemeCategory.find((item) => item.category === category)?.api;
        if (!api) {
            throw new Error('未找到此分类');
        }
        const res: getMemeList_res = await httpInstance.get(api, {
            params: {
                tags: tags,
                pageNum: pageIndex,
                pageSize: pageSize,
            },
        });
        if (res.data?.list?.length <= 0) {
            throw new Error('请求到的烂梗列表为空');
        }
        const memeArr: Meme[] = res.data.list.map((item) => {
            return {
                tags: item.tags,
                content: item.barrage,
                id: item.id,
                category: category,
                copyCount: +item.cnt,
                likes: +item.likes,
                submitTime: item.submitTime,
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

export async function getMemeTags() {
    const res: getData<getMemeTags[]> = await httpInstance.get(API.GET_MEME_TAGS);
    if (res.code !== 200) {
        throw new Error(res.msg);
    }
    return res.data;
}
