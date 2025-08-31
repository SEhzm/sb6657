declare global {
    type Meme = {
        tags?: string; //tags
        content: string; // 梗内容
        category?: string; // 分类
        id: string; // ID
        copyCount: number; // 复制次数
        likes?: number; //点赞次数
        submitTime?: string; // 投稿时间
    };
}

export interface getData<T> {
    code: number;
    msg: string;
    data: T;
}

export interface hotMeme_res {
    tags: string;
    barrage: string;
    barrageId: number;
    cnt: number;
    hotDateTime: null;
    id: null;
    tableName: string;
    likes: number;
    submitTime: string;
}
export interface getHotMeme_res {
    code: number;
    msg: string;
    data: hotMeme_res[];
}

export interface searchMeme_data {
    tags: string;
    barrage: string;
    cnt: string;
    id: string;
    likes: string;
    submitTime: string;
}
export interface searchMeme_res {
    code: number;
    data: searchMeme_data[];
    msg: string;
}

export interface getMemeList_meme {
    tags: string;
    id: string;
    barrage: string;
    cnt: string;
    likes: string;
    submitTime: string;
}
export interface getMemeList_data {
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
export interface getMemeList_res {
    code: number;
    msg: string;
    data: getMemeList_data;
}

export interface getMemeTags {
    dictCode: string;
    dictLabel: string;
    dictValue: string;
    dictType: string;
    iconUrl: string;
}