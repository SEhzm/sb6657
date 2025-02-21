import axios from 'axios';
import { SERVER_ADDRESS } from '@/constants/backend';
import { getCookie, setCookie } from '@/utils/cookieUtils';

const httpInstance = axios.create({
    baseURL: SERVER_ADDRESS,
    // baseURL: "http://127.0.0.1:10086",
    timeout: 60000, // 默认超时时间
});

export const sbVersion = '25.02.18';

/**
 * 后端使用siteToken来统计UV PV IP日均 
 * @param length 
 * @returns 
 */
// 生成随机的 10 位字符 数字组合
function generateRandomToken(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// 获取或生成 siteToken
function getSiteToken(): string {
    let siteToken = getCookie('siteToken');
    if (!siteToken) {
        siteToken = generateRandomToken();
        setCookie('siteToken', siteToken, 3650 * 24 * 60 * 60 * 1000); // 设置为永久 cookie
    }
    return siteToken;
}

// axios 请求拦截器
httpInstance.interceptors.request.use(
    (config) => {
        const siteToken = getSiteToken();
        config.headers['siteToken'] = siteToken;
        return config;
    },
    (e) => Promise.reject(e)
);

// axios 响应拦截器
httpInstance.interceptors.response.use(
    (res) => res.data,
    (error) => {
        console.log('err', error);
        return Promise.reject(error);
    }
);

export default httpInstance;