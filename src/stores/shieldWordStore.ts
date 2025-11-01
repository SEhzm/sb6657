import { getShieldWordDict } from '@/apis/getShieldWordDict';
import type { getShieldWordDict as ShieldWordDictType } from '@/types/shieldWord';
import { ElMessage } from 'element-plus';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useShieldWordStore = defineStore('shieldWord', () => {
    const shieldWords = ref<ShieldWordDictType[]>([]);
    const loading = ref(false);

    // 屏蔽词加载好标志
    let shieldWordsLoadedPromise: Promise<void>;
    let resolveShieldWordsLoaded: (() => void) | null = null;
    shieldWordsLoadedPromise = new Promise<void>((resolve) => {
        resolveShieldWordsLoaded = resolve;
    });

    /**
     * 获取屏蔽词列表
     */
    async function setShieldWords() {
        loading.value = true;
        try {
            const res = await getShieldWordDict();
            shieldWords.value = res;
            resolveShieldWordsLoaded?.();
        } catch (error) {
            console.error('获取屏蔽词失败:', error);
            ElMessage.error('获取屏蔽词失败');
            throw error;
        } finally {
            loading.value = false;
        }
    }

    /**
     * 检查文本是否包含屏蔽词
     * @param text 要检查的文本
     * @returns 如果包含屏蔽词，返回匹配的屏蔽词数组；否则返回空数组
     */
    function checkShieldWords(text: string): string[] {
        if (!text || shieldWords.value.length === 0) {
            return [];
        }
        return shieldWords.value.filter((word) => text.includes(word));
    }

    /**
     * 检查文本是否包含屏蔽词（布尔值）
     * @param text 要检查的文本
     * @returns 如果包含屏蔽词返回 true，否则返回 false
     */
    function hasShieldWord(text: string): boolean {
        return checkShieldWords(text).length > 0;
    }

    return {
        shieldWords,
        loading,
        setShieldWords,
        shieldWordsLoaded: shieldWordsLoadedPromise,
        checkShieldWords,
        hasShieldWord,
    };
});
