import axios from 'axios';
import { SERVER_ADDRESS } from '@/constants/backend';

const httpInstance = axios.create({
    baseURL: SERVER_ADDRESS,
    // baseURL: 'http://localhost:10086',
    timeout: 60000, // 默认超时时间
});

export const sbVersion = '25.02.03';
// axios请求拦截器
// 可以自请求发送前对请求做一些处理
httpInstance.interceptors.request.use(
    (config) => {
        return config;
    },
    (e) => Promise.reject(e)
);

// axios响应拦截器
// 可以在接口响应后统一处理结果
httpInstance.interceptors.response.use(
    (res) => res.data,
    (error) => {
        console.log('err', error);
        return Promise.reject(error);
    }
);

export default httpInstance;
