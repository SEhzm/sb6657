/**
 * 经典节流函数，但是真是tm酣畅淋漓的类型体操啊，加了节流中触发要怎么处理的回调，有完善类型推导
 * @param cb 回调，真正要节流的函数
 * @param cbthen 回调2，节流时间段如果调了触发这个。一般是提示之类的，不能带参数
 * @param delay 节流时间，传入毫秒
 * @returns 返回节流处理过的函数
 */
export function throttle<CB extends (...args: any[]) => any, CBTHEN extends () => any>(
    cb: CB,
    cbthen: CBTHEN,
    delay: number
): (...args: Parameters<CB>) => ReturnType<CB> | ReturnType<CBTHEN> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<CB>): ReturnType<CB> | ReturnType<CBTHEN> => {
        if (!timer) {
            const res = cb(...args);
            timer = setTimeout(() => {
                timer = null;
            }, delay);
            return res;
        } else {
            return cbthen();
        }
    };
}

/**
 * 防抖函数，在指定时间内多次调用只执行最后一次
 * @param cb 回调函数
 * @param delay 防抖时间，传入毫秒
 * @returns 返回防抖处理过的函数
 */
export function debounce<CB extends (...args: any[]) => any>(
    cb: CB,
    delay: number
): (...args: Parameters<CB>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<CB>): void => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            cb(...args);
            timer = null;
        }, delay);
    };
}
