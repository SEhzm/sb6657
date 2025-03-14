import httpInstance from '@/apis/httpInstance';
import { API } from '@/constants/backend';
import { ElNotification } from 'element-plus';

interface copyCountPlus1_res {
    code: string;
    data: object;
    msg: string;
}
export async function copyCountPlus1(category: string, memeId: string, pageNum?: number, PageSize?: number, sortOrder?: string) {
    try {
        const res: copyCountPlus1_res = await httpInstance.get(API.INCREASE_COPY_COUNT+`/${memeId}`);
        console.log('弹幕复制次数+1成功', res);
        return true;
    } catch (err: any) {
        console.error('弹幕复制次数+1失败', err);
        return false;
    }
}

export function plus1Error() {
    ElNotification({
        title: '复制成功',
        message: '但是复制次数没有增加，可能是网络有问题',
        type: 'warning',
    });
}

interface submitMeme_res {
    code: string;
    msg: string;
    data: object;
}
export async function submitMeme(category: string, meme: string) {
    console.log(`烂梗投稿\n 所属分类: ${category} \n烂梗内容: ${meme}`);
    try {
        const res: submitMeme_res = await httpInstance.post(API.SUBMIT_MEME, {
            table: category,
            barrage: meme,
        });
        if (res.code === '500') {
            console.log('烂梗已经有了，勿重复提交');
            ElNotification({
                title: '烂梗已经有了',
                message: '勿重复提交',
                type: 'error',
            });
            return false;
        }
        else if(res.code !== '200') {
            console.log('烂梗投稿失败');
            return false;
        }
        return true;
    } catch (err: any) {
        console.error('烂梗投稿失败', err);
        return false;
    }
}
