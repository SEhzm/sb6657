/**
 * 经典节流函数
 * @param cb 回调，真正要节流的函数
 * @param cbthen 回调2，节流时间段如果调了触发这个。一般是提示之类的，不能带参数
 * @param delay 节流时间，传入毫秒
 * @returns 返回节流处理过的函数
 */
export function throttle(cb: (...arg: any[]) => any, cbthen: () => void, delay: number): (...arg: any[]) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return (...args: any[]): any => {
        if (!timer) {
            cb(...args);
            timer = setTimeout(() => {
                timer = null;
            }, delay);
        } else {
            cbthen();
        }
    };
}
