import { ref, onMounted, onUnmounted, type Ref } from 'vue';

/**
 * @param t sleep的毫秒数
 * @returns 空promise
 */
export const sleep = (t: number) => new Promise((r) => setTimeout(r, t));

/**
 * 是否是移动端hooks。判断基准为屏幕最大宽度是否小于600px
 * @returns {Ref<boolean>} - 是否为移动端的响应式状态
 */
export function useIsMobile(): Ref<boolean> {
    const mobile = ref(false);
    let mediaQuery: MediaQueryList | null = null;

    function update(e: MediaQueryListEvent) {
        mobile.value = e.matches;
    }

    onMounted(() => {
        mediaQuery = window.matchMedia('(max-width: 600px)');
        mobile.value = mediaQuery.matches;
        mediaQuery.addEventListener('change', update);
    });
    onUnmounted(() => {
        if (mediaQuery) {
            mediaQuery.removeEventListener('change', update);
        }
    });

    return mobile;
}
