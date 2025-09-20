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

// 0: 按id排序, 1: 按复制次数排序
export enum SortType { 
    ID = 0,
    COPY = 1,
}
export interface searchMeme_req {
    barrage: string;
    tags?: string;
    submitTime?: [string, string];
    sort: SortType;
    pageSize: number;
    pageNum: number;
}
export interface searchMemeElement {
    id: number;
    barrage: string;
    cnt: string;
    tags: string;
    submitTime: string;
}
export interface searchMeme_res {
    total: number;
    list: searchMemeElement[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: true;
    hasPreviousPage: false;
    hasNextPage: false;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
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
