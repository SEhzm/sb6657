import {ElMessage} from 'element-plus'
import router from '../router'
import axios from "axios";

const request = axios.create({
    //线上版本测试
    baseURL: 'https://dgq63136.icu:9090',
    //线下测试
    // baseURL: 'http://localhost:9090',
    timeout: 5000  // 后台接口超时时间设置
})
// request 拦截器
// 可以自请求发送前对请求做一些处理
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config
}, error => {
    return Promise.reject(error)
});

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
    response => {
        let res = response.data;
        // 如果是返回的文件
        if (response.config.responseType === 'blob') {
            return res
        }
        // 兼容服务端返回的字符串数据
        if (typeof res === 'string') {
            res = res ? JSON.parse(res) : res
        }
        // 当权限验证不通过的时候给出提示
        // if (res.code === '401') {
        //     ElMessage.error(res.msg);
        //     router.push("/login")
        // }
        return res;
    },
    error => {
        console.log('err' + error)
        return Promise.reject(error)
    }
)


export default request
