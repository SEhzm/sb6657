import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const RefreshTokenKey = 'Admin-Refresh-Token'
const TokenExpireKey = 'Admin-Token-Expire'

// 获取 token
export function getToken() {
    return localStorage.getItem(TokenKey)
}

// 设置 token
export function setToken(token: string, refreshToken: string, expiresIn: number) {
    const expireTime = Date.now() + expiresIn * 1000
    localStorage.setItem(TokenKey, token)
    localStorage.setItem(RefreshTokenKey, refreshToken)
    localStorage.setItem(TokenExpireKey, expireTime.toString())
}

// 获取刷新 token
export function getRefreshToken() {
    return localStorage.getItem(RefreshTokenKey)
}

// 获取 token 过期时间
export function getTokenExpireTime() {
    const expireTime = localStorage.getItem(TokenExpireKey)
    return expireTime ? parseInt(expireTime) : 0
}

// 检查 token 是否即将过期（比如还有 5 分钟过期）
export function isTokenExpiringSoon() {
    const expireTime = getTokenExpireTime()
    const now = Date.now()
    // 如果还有 5 分钟过期，就返回 true
    return expireTime - now < 5 * 60 * 1000
}

// 移除所有 token
export function removeToken() {
    localStorage.removeItem(TokenKey)
    localStorage.removeItem(RefreshTokenKey)
    localStorage.removeItem(TokenExpireKey)
}

// 站点 token 相关（保持不变）
export function setSiteToken(token: string) {
    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    return Cookies.set('siteToken', token, { expires })
}

export function getSiteToken() {
    return Cookies.get('siteToken')
}
