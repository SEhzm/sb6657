import httpInstance from '@/apis/httpInstance';
import { API } from '@/constants/backend';
import type { getData } from '@/types/meme';
import type { getShieldWordDict as ShieldWordDictType } from '@/types/shieldWord';

export async function getShieldWordDict() {
    const res: getData<getShieldWordDict[]> = await httpInstance.get(API.GET_SHIELD_WORD);
    if (res.code !== 200) {
        throw new Error(res.msg);
    }
    return res.data;
}
