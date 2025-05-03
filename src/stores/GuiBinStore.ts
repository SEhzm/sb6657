/**
 * 贵宾Store
 */
import { defineStore } from 'pinia';

export const useGuiBinStore = defineStore('guibin', {
    state: () => ({
        Oni: '', // 存储 Oni 的值
    }),
    actions: {
        updateOni(Oni: string) {
            this.Oni = Oni; // 更新 Oni 值
        },
    },
});
