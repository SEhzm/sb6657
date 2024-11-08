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
        const res: copyCountPlus1_res = await httpInstance.post(API.INCREASE_COPY_COUNT, {
            table: category,
            id: memeId,
            ...(pageNum ? { PageNum: pageNum } : {}),
            ...(PageSize ? { PageSize: 50 } : {}),
            ...(sortOrder ? { sortOrder: sortOrder } : {}),
        });
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
