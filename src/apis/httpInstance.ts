import axios from 'axios';
import { SERVER_ADDRESS } from '@/constants/backend';
import { getToken, setSiteToken, getSiteToken } from '@/utils/cookieUtils';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import eventBus from '@/utils/eventBus'
const httpInstance = axios.create({
    baseURL: SERVER_ADDRESS,
    // baseURL: "http://127.0.0.1:10086",
    timeout: 60000, // 默认超时时间
});

export const sbVersion = '25.04.22';

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
function getSiteTokenString(): string {
    let siteToken = getSiteToken();
    if (!siteToken) {
        siteToken = generateRandomToken();
        setSiteToken(siteToken);
    }
    return siteToken;
}
// axios 请求拦截器
httpInstance.interceptors.request.use(
    (config) => {
        if (getSiteTokenString()) {
            config.headers['siteToken'] = getSiteToken();
        }
        if (getToken()) {
            config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
        }
        return config;
    },
    (e) => Promise.reject(e)
);

const errorCode: Record<string, string> = {
    '401': '认证失败，无法访问资源',
    '403': '当前操作没有权限',
    '404': '访问资源不存在',
    'default': '系统未知错误，请反馈给管理员'
};
// axios 响应拦截器
// httpInstance.interceptors.response.use(
    
//     (res) => res.data,
//     (res) => {
//         console.log(1123);
//         const response = res.response;
//         if (response) {
//             const { data, status } = response;
//             const code = data?.code || status;

//             switch (code) {
//                 case 401:
                        
                        
//                         ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示')
//                             .then(() => {
                                
//                             })
//                             .catch(() => {
                                
//                             });
                    
//                     return Promise.reject(new Error('无效的会话，或者会话已过期，请重新登录。'));
//                 case 4000:
//                     ElMessageBox.alert(data.msg || '你的操作太快啦', '提示', {
//                         confirmButtonText: 'OK',
//                     });
//                     break;
//                 case 500:
//                     ElMessage({ message: errorCode[code] || errorCode['default'], type: 'error' });
//                     return Promise.reject(new Error(errorCode[code] || errorCode['default']));
//                 case 601:
//                     ElMessage({ message: errorCode[code] || errorCode['default'], type: 'warning' });
//                     return Promise.reject(new Error(errorCode[code] || errorCode['default']));
//                 default:
//                     ElNotification.error({ title: errorCode[code] || errorCode['default'] });
//                     return Promise.reject(new Error(errorCode[code] || errorCode['default']));
//             }
//         } else {
//             console.error('请求失败:', res.message);
//             return Promise.reject(new Error('网络错误'));
//         }
//     }
// );
export let isRelogin = { show: false };
httpInstance.interceptors.response.use(
    res => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType ===  'blob' || res.request.responseType ===  'arraybuffer') {
      return res.data
    }
    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm('请先登录再使用该功能，或您的登录状态已过期，您可以继续留在该页面，或者重新登录', '请您先登录~', { confirmButtonText: '重新登录', cancelButtonText: '取消', type: 'warning' }).then(() => {
          isRelogin.show = false;
          eventBus.emit('showLogin')
      }).catch(() => {
        isRelogin.show = false;
      });
    }
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' })
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      ElNotification.error({ title: msg })
      return Promise.reject('error')
    } else {
      return  Promise.resolve(res.data)
    }
  },
  error => {
    console.log('err' + error)
    let { message } = error;
    if (error.response.status === 4000) {
      ElMessageBox.alert(error.response.data,'你的操作太快啦', {
          confirmButtonText: 'OK',
      });
  }else{
      console.log('err', error);
      return Promise.reject(error); 
  }
    if (message == "Network Error") {
      message = "接口连接异常";
    } else if (message.includes("timeout")) {
      message = "接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({ message: message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  }
)
export default httpInstance;