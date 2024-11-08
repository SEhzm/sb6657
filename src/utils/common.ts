/**
 * @param t sleep的毫秒数
 * @returns 空promise
 */
export const sleep = (t: number) => new Promise((r) => setTimeout(r, t));
