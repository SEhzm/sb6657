import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getMemeTags } from '@/apis/getMeme';
import type { getMemeTags as memeTag } from '@/types/meme';
import defaultTag from '@/assets/icons/tag.svg';

export const useMemeTagsStore = defineStore('memeTags', () => {
    const memeTags = ref<memeTag[]>([]);

    // tag加载好标志
    let tagsLoadedPromise: Promise<void>;
    let resolveTagsLoaded: (() => void) | null = null;
    tagsLoadedPromise = new Promise<void>((resolve) => {
        resolveTagsLoaded = resolve;
    });

    async function setMemeTags() {
        const res = await getMemeTags();
        res.forEach((item) => {
            item.iconUrl = item.iconUrl || defaultTag;
        });
        memeTags.value = res;
        resolveTagsLoaded?.();
    }
    return {
        memeTags,
        setMemeTags,
        tagsLoaded: tagsLoadedPromise,
    };
});
