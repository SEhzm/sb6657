import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
    return Cookies.get(TokenKey)
}
export function setToken(token: string) {

    return Cookies.set(TokenKey, token)
}
export function setSiteToken(token: string) {
    const expires = new Date()
    expires.setDate(expires.getDate() + 365)
    return Cookies.set('siteToken', token, { expires })}
export function getSiteToken() {
    return Cookies.get('siteToken')
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
