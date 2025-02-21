// 获取 cookie
export function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

// 设置 cookie
export function setCookie(name: string, value: string, maxAge: number): void {
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/`;
}