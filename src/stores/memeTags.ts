import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getMemeTags } from '@/apis/getMeme';
import type { getMemeTags as memeTag } from '@/types/meme';


export const useMemeTagsStore = defineStore('memeTags', () => {
    const memeTags = ref<memeTag[]>([]);
    async function setMemeTags(){
        const res = await getMemeTags();
        memeTags.value = res;
    }
    return {
        memeTags,
        setMemeTags,
    };
});
