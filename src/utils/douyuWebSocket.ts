import { useGuiBinStore } from '@/stores/GuiBinStore';
import { ref, onMounted } from 'vue';

// 获取 store
const store = useGuiBinStore();

type MessageHandler = (msg: string) => void


/**
 * 源于淳哥的开源项目DouYuEX的代码
 * https://github.com/qianjiachun/douyuEx
 */


class DouyuWebSocket {
    private timer: number | null = null
    private ws: WebSocket | null = null
    private rid: number
    private msgHandler: MessageHandler

    constructor(rid: number, msgHandler: MessageHandler) {
        this.rid = rid
        this.msgHandler = msgHandler
        if ('WebSocket' in window) {
            this.connect()
        }
    }

    connect(): void {
        const port = getRandom(2, 5)
        this.ws = new WebSocket(`wss://danmuproxy.douyu.com:850${port}`)
        this.ws.binaryType = 'arraybuffer'

        this.ws.onopen = () => {
            this.ws!.send(WebSocket_Packet(`type@=loginreq/roomid@=${this.rid}`))
            this.ws!.send(
                WebSocket_Packet(`type@=joingroup/rid@=${this.rid}/gid@=-9999/`)
            )
            this.timer = window.setInterval(() => {
                this.ws!.send(WebSocket_Packet('type@=mrkl/'))
            }, 40000)
        }

        this.ws.onerror = () => {
            this.close()
        }

        this.ws.onmessage = (e: MessageEvent): void => {
            const reader = new FileReader()
            reader.onload = () => {
                const arr = String(reader.result).split('\0')
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].length > 12) {
                        this.msgHandler(arr[i])
                    }
                }
            }
            reader.readAsText(new Blob([e.data]))
        }

        this.ws.onclose = () => {
            this.close()
            this.reconnect()
        }
    }

    reconnect(): void {
        setTimeout(() => {
            this.connect()
        }, 3000)
    }

    close(): void {
        if (this.timer !== null) {
            clearInterval(this.timer)
            this.timer = null
        }
        if (this.ws) {
            this.ws.close()
            this.ws = null
        }
    }
}

function WebSocket_Packet(str: string): Uint8Array {
    const MSG_TYPE = 689
    let bytesArr = stringToByte(str)
    const bufferSize =
        bytesArr.length + 4 + 4 + 2 + 1 + 1 + 1
    const buffer = new Uint8Array(bufferSize)
    const p_content = new Uint8Array(bytesArr.length) // 消息内容

    for (let i = 0; i < p_content.length; i++) {
        p_content[i] = bytesArr[i]
    }

    const p_length = new Uint32Array([bytesArr.length + 4 + 2 + 1 + 1 + 1]) // 消息长度
    const p_type = new Uint32Array([MSG_TYPE]) // 消息类型

    buffer.set(new Uint8Array(p_length.buffer), 0)
    buffer.set(new Uint8Array(p_length.buffer), 4)
    buffer.set(new Uint8Array(p_type.buffer), 8)
    buffer.set(p_content, 12)

    return buffer
}

function stringToByte(str: string): number[] {
    const bytes: number[] = []
    const len = str.length

    for (let i = 0; i < len; i++) {
        const c = str.charCodeAt(i)
        if (c >= 0x010000 && c <= 0x10ffff) {
            bytes.push(((c >> 18) & 0x07) | 0xf0)
            bytes.push(((c >> 12) & 0x3f) | 0x80)
            bytes.push(((c >> 6) & 0x3f) | 0x80)
            bytes.push((c & 0x3f) | 0x80)
        } else if (c >= 0x000800 && c <= 0x00ffff) {
            bytes.push(((c >> 12) & 0x0f) | 0xe0)
            bytes.push(((c >> 6) & 0x3f) | 0x80)
            bytes.push((c & 0x3f) | 0x80)
        } else if (c >= 0x000080 && c <= 0x0007ff) {
            bytes.push(((c >> 6) & 0x1f) | 0xc0)
            bytes.push((c & 0x3f) | 0x80)
        } else {
            bytes.push(c & 0xff)
        }
    }

    return bytes
}

function byteToString(arr: number[] | string): string {
    if (typeof arr === 'string') {
        return arr
    }
    let str = ''
    const _arr = arr
    for (let i = 0; i < _arr.length; i++) {
        const one = _arr[i].toString(2)
        const v = one.match(/^1+?(?=0)/)
        if (v && one.length === 8) {
            const bytesLength = v[0].length
            let store = _arr[i].toString(2).slice(7 - bytesLength)
            for (let st = 1; st < bytesLength; st++) {
                store += _arr[st + i].toString(2).slice(2)
            }
            str += String.fromCharCode(parseInt(store, 2))
            i += bytesLength - 1
        } else {
            str += String.fromCharCode(_arr[i])
        }
    }
    return str
}

function hex2bin(e: string): number[] | null {
    if (typeof e === 'string' && e.length % 8 === 0) {
        const r: string[] = []
        const t = e.length
        for (let o = 0; o < t;) {
            r.push(e.substr(o, 2))
            o += 2
        }

        const n: number[] = []
        const i = r.length
        for (let s = 0; s < i;) {
            n.push(parseInt(r.slice(s, s + 4).reverse().join(''), 16))
            s += 4
        }
        return n
    }
    return null
}

function hex(e: number[]): string {
    if (Array.isArray(e)) {
        const r = '0123456789abcdef'.split('')
        return e
            .map((num) => {
                let t = ''
                for (let o = 0; o < 4; o++) {
                    t +=
                        r[(num >> (8 * o + 4)) & 15] +
                        r[(num >> (8 * o)) & 15]
                }
                return t
            })
            .join('')
    }
    return ''
}

function getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getStrMiddle(text: string, startStr: string, endStr: string): string {
    const start = text.indexOf(startStr)
    if (start === -1) return ''
    const end = text.indexOf(endStr, start + startStr.length)
    if (end === -1) return ''
    return text.substring(start + startStr.length, end)
}

function showMessageWindow(title: string, message: string, callback: () => void): void {
    if (confirm(`${title}\n\n${message}`)) {
        callback()
    }
}

export function handleDanmu(msg: string): void {
    // 检测 type=oni 并提取 vn、rid、list 字段
    const typeMatch = msg.match(/type@=(.*?)(\/|@)/)
    // 提取 vn 并更新 store
    const oni = getStrMiddle(msg, 'oni/vn@=', '/')
    if (oni) {
        // 更新 Pinia store 中的 oni
        store.updateOni(oni)
        // console.log(oni)
    }

    if (typeMatch && typeMatch[1] === 'rss') {
        const rid = getStrMiddle(msg, 'rid@=', '/')
        const ss = getStrMiddle(msg, 'ss@=', '/')
        const ivl = getStrMiddle(msg, 'ivl@=', '/')
console.log(ss);

        if (ss === '1' && ivl === '0') {
            //发送开播通知 
            sendMsg()
        }
    }
}

function sendMsg() {
    // 检查浏览器是否支持 Notification API
    if (!('Notification' in window)) {
        alert('当前浏览器不支持开播通知');
        return;
    }

    // 请求用户授权（如果尚未授权）
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                showNotification(); // 授权通过后显示通知
            } else {
                alert('你拒绝了通知权限，无法收到开播通知，请在网址左侧打开权限');
            }
        });
    } else {
        showNotification(); // 已经授权，直接显示通知
    }
}
function showNotification() {
    const notification = new Notification('来自sb6657.cn开播提醒', {
        body: '6657直播间已开播，快去观看吧！',
    });

    // 点击通知时触发的动作
    notification.onclick = () => {
        window.focus(); // 聚焦窗口
        window.open("https://www.douyu.com/6657", "_blank");
    };
}

// 启动连接
const socket = ref()
onMounted(() => {
    socket.value = new DouyuWebSocket(6979222, handleDanmu);
});
export default DouyuWebSocket