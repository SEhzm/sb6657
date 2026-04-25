# AI_GUIDE.md

> 本文档面向工程师和 AI 助手，旨在快速建立对项目结构、设计思路和工程约定的理解。  
> 不重复 README 中的介绍性内容，聚焦工程实现细节。

---

## 项目结构说明

```
src/
├── apis/                    # 网络请求层（按业务域拆分）
│   ├── httpInstance.ts      # Axios 实例 + 请求/响应拦截器（认证、Token 刷新、错误码处理）
│   ├── getMeme.ts           # 弹幕/烂梗 读取类接口（搜索、分类、热门、随机）
│   ├── setMeme.ts           # 弹幕/烂梗 写入类接口（提交、复制计数）
│   ├── getShieldWordDict.ts # 屏蔽词字典接口
│   └── match.ts             # CS2 赛事竞猜接口
│
├── stores/                  # Pinia 全局状态（仅存放需要跨组件共享的数据）
│   ├── useAuthStore.ts      # 登录态、userId、登录弹窗可见性
│   ├── memeTags.ts          # 标签字典缓存（Promise 化初始加载）
│   ├── shieldWordStore.ts   # 屏蔽词字典缓存 + 检测方法
│   └── GuiBinStore.ts       # 斗鱼直播间贵宾数（WebSocket 实时推送）
│
├── types/                   # TypeScript 类型定义
│   ├── meme.ts              # Meme、搜索请求/响应、标签等核心类型
│   └── shieldWord.ts        # 屏蔽词类型
│
├── constants/
│   └── backend.ts           # 全部后端 API 路径常量 + 侧栏导航配置（MemeCategory）
│
├── common/
│   └── CommunityNorms.ts    # 社区公约/隐私政策 HTML 文本
│
├── utils/                   # 纯工具函数（无业务状态依赖）
│   ├── douyuWebSocket.ts    # 斗鱼弹幕 WebSocket 协议实现（二进制协议 type 689）
│   ├── clipboard.ts         # 复制到剪贴板 + 用户反馈通知
│   ├── cookieUtils.ts       # Token 存取（localStorage）+ siteToken 分析（js-cookie）
│   ├── jsencrypt.js         # RSA 公钥加密（用于密码等敏感字段）
│   ├── throttle.ts          # 节流/防抖（泛型，保留函数签名）
│   ├── tags.ts              # 标签 ID → 显示名转换
│   ├── time.ts              # ISO 时间格式化
│   └── common.ts            # sleep()、useIsMobile() 响应式 Hook
│
├── components/              # 可复用 UI 组件（不绑定路由）
│   ├── tag-selector.vue     # 标签多选器（v-model 双向绑定）
│   ├── submission-dialog.vue# 弹幕提交对话框
│   ├── ChatRoom.vue         # WebSocket 聊天室
│   ├── wordCloud.vue        # 搜索词词云（echarts-wordcloud）
│   ├── CoinPreview.vue      # 赛事竞猜金币展示
│   ├── flip-num.vue         # 数字翻转动画
│   └── like-num.vue         # 点赞数展示
│
├── views/                   # 页面级组件（绑定路由）
│   ├── MainLayout/
│   │   ├── MainLayout.vue   # 全局布局容器（侧栏 + Header + Footer + WebSocket 连接）
│   │   └── components/
│   │       ├── Home.vue             # 首页（提交表单 + 随机弹幕 + 词云）
│   │       ├── memes-view.vue       # 弹幕列表页（分类浏览 + 标签筛选 + 排序）
│   │       ├── memeTop20.vue        # 年度 TOP20 投票
│   │       ├── shieldWord.vue       # 屏蔽词社区投票
│   │       ├── header-bar/          # 顶部导航栏（搜索、热门轮播、通知、用户菜单）
│   │       ├── post-bar/            # 社区贴吧（帖子、评论、9种表态反应）
│   │       ├── match-prediction/    # CS2 赛事竞猜（拖拽选队）
│   │       ├── AiGenerateMemes/     # AI 造梗（SSE 流式对话）
│   │       └── user/                # 用户中心（个人信息、我的弹幕、改密）
│   ├── Starrysky.vue        # 星空背景装饰组件
│   └── 404.vue              # 404 页面
│
├── assets/
│   ├── css/                 # 全局样式（global.css + index.scss）
│   ├── icons/               # SVG 图标
│   └── imgs/                # 静态图片资源
│
├── router/index.ts          # 路由配置（Hash 模式，全部嵌套在 MainLayout 下）
├── main.ts                  # 应用入口（Element Plus 注册、生产环境 console 屏蔽、24h 自动刷新）
├── App.vue                  # 根组件（RouterView + StarrySky 背景）
└── env.d.ts                 # Vue SFC 类型声明
```

### 目录划分原则

| 层级 | 职责边界 | 注意事项 |
|------|---------|---------|
| `apis/` | 只做 HTTP 调用和响应解包，不含 UI 逻辑 | 每个文件按业务域聚合，读写分离（get/set） |
| `stores/` | 跨组件共享的全局状态 | 组件私有状态不放 store，用 `ref`/`reactive` |
| `utils/` | 纯函数或无状态 class，不依赖 Vue 生命周期 | `douyuWebSocket` 是唯一例外，内部操作了 store |
| `components/` | 可复用、无路由绑定 | 通过 props/emits/v-model 通信 |
| `views/` | 页面容器，绑定路由 | 可依赖 store 和 apis，组装 components |
| `constants/` | 静态常量（API 路径、导航配置） | 是侧栏菜单和路由的"单一真相源" |

---

## 核心领域模型

### Meme（弹幕/烂梗）—— 整个系统的核心实体

```typescript
type Meme = {
  id: string;            // 唯一标识
  content: string;       // 弹幕正文（max 255 字符）
  tags?: string;         // 标签 ID（逗号分隔，如 "01,03,06"）
  category?: string;     // 所属分类（路由参数决定）
  copyCount: number;     // 被复制次数 —— 核心热度指标
  likes?: number;        // 点赞数
  submitTime?: string;   // 提交时间（ISO 格式）
};
```

**设计要点：**
- `copyCount` 是核心度量指标，24h/7d 热门排行均基于此
- `tags` 是逗号分隔的字符串（非数组），前端用 `getDisplayTags()` 转换为可展示结构
- 标签体系由后端 dictList 接口返回，前端缓存在 `memeTagsStore`

### MemeTag（标签字典）

```typescript
type memeTag = {
  dictCode: string;    // 内部编码
  dictLabel: string;   // 显示名（如"喷玩机器篇"）
  dictValue: string;   // 标识符（"00"-"09"）
  dictType: string;    // 分类
  iconUrl: string;     // 标签图标 URL
};
```

**标签值对照（当前已知）：**
- `00` 喷玩机器篇、`01` 喷选手篇、`02` 加一篇、`03` QUQU 篇
- `05` 木柜子篇、`06` 群魔乱舞篇、`09` 直播间互喷篇

### ShieldWord（屏蔽词）

社区驱动的敏感词管理。用户可提交、投票（是/不是屏蔽词），通过审核后生效。  
前端缓存在 `shieldWordStore`，用于在弹幕列表中标注含敏感词的条目。

### User（用户）

通过 `useAuthStore` 管理。认证基于 JWT（accessToken + refreshToken），  
Token 存储在 localStorage，siteToken（匿名分析标识）存储在 cookie（1 年有效期）。

### Match / Prediction（赛事竞猜）

```typescript
interface Team { id, matchesId, teamName, teamImgUrl }
interface PredictionRecord { id, userId, matchesId, s_l, l_s, advance, createTime }
```
- `s_l` / `l_s`：两个分组的预测结果
- `advance`：晋级队伍（数组序列化为字符串）

---

## 关键业务流程

### 1. 弹幕提交流程

```
用户填写表单（Home.vue / submission-dialog.vue）
  → 选择 1-5 个标签（tag-selector 组件）
  → 输入弹幕文本（≤255 字符）
  → 可选：关联当前进行中的赛事
  → POST /machine/submission
  → 后端进入审核（AI + 人工）
  → 审核通过后出现在对应分类列表中
```

### 2. 弹幕复制流程（核心交互）

```
用户点击复制按钮
  → throttle 守卫（2s 节流，节流期内显示"请勿刷次数"）
  → clipboard.ts 写入剪贴板
  → POST /machine/addCnt（copyCount +1）
  → 500 响应 = 已计过数（服务端去重）
  → flip-num 动画更新计数显示
```

### 3. 认证与 Token 刷新流程

```
httpInstance 请求拦截器
  → 检查 Token 是否即将过期（<5 分钟缓冲）
  → 若即将过期：
      → 设置 isRefreshing = true
      → 调用刷新接口获取新 Token
      → 期间后续请求进入等待队列（Promise）
      → 刷新成功 → 重放队列中所有请求
      → 刷新失败 → 清除登录态
  → 401 响应 → 弹出登录对话框（useAuthStore.showLogin）
```

### 4. 斗鱼 WebSocket 弹幕连接

```
MainLayout 挂载时
  → new DouyuWebSocket(6979222, handler)
  → 连接 wss://danmuproxy.douyu.com:850X（随机端口 2-5）
  → 二进制协议握手（type 689）
  → 40s 心跳保活
  → 解析 oni/vn@= 字段 → 更新 GuiBinStore.Oni（贵宾数）
  → 检测 ss=1 → 触发桌面通知"开播了"
  → 断线自动重连
```

### 5. AI 造梗流程

```
用户选择生成数量（1-10）+ 可选标签 + 是否显示推理过程
  → SSE 流式请求 POST /suanli/stream
  → 逐 token 接收，实时渲染（光标动画）
  → 90s 超时保护 → 自动重试
  → 响应清洗：移除 <think> 标签、合并断行 markdown 列表
  → 每日限制 50 次
```

### 6. 屏蔽词社区投票流程

```
用户浏览屏蔽词列表
  → 每个词可投"这是屏蔽词" / "这不是屏蔽词"
  → 票数累计，达标后标记为"不是屏蔽词"并打戳
  → 用户可提交新词（1-10字符）→ 进入待审核
  → 审核状态：通过 / 未通过 / 待审核
```

---

## 重要工程约定

### API 层约定

1. **读写分离命名**：`getMeme.ts`（读）、`setMeme.ts`（写），按业务域拆文件
2. **统一泛型封装**：`post<T, R>(url, data)` 和 `get<R>(url)` 保证类型安全
3. **所有后端路径集中在 `constants/backend.ts`**，组件内不出现硬编码 URL
4. **错误码约定**：
   - `200` 成功、`401` 未认证、`403` 无权限、`500` 服务端错误
   - `601` 非致命警告（ElMessage.warning）
   - `4000` 请求过快（限流）

### 状态管理约定

1. **只有跨组件共享的数据才放 Pinia Store**（当前共 4 个 store）
2. **Promise 化初始加载**：`memeTags` 和 `shieldWordStore` 使用 `tagsLoadedPromise` 模式，  
   依赖方 `await store.tagsLoaded` 后再渲染，避免竞态
3. **组件私有状态**一律用 `ref()` / `reactive()`，不上提到 store

### 命名规则

| 类型 | 约定 | 示例 |
|------|------|------|
| 组件文件 | PascalCase 或 kebab-case（项目中两者混用） | `ChatRoom.vue`、`header-bar.vue` |
| API 函数 | camelCase，get/set 前缀表示读写 | `getHotMeme24h()`、`submitMeme()` |
| Store 文件 | camelCase 或 use 前缀 | `memeTags.ts`、`useAuthStore.ts` |
| 类型文件 | 与所描述的实体同名 | `meme.ts`、`shieldWord.ts` |
| 路由路径 | kebab-case | `/post-bar`、`/match-prediction` |
| CSS 类名 | kebab-case | `.header-bar`、`.meme-item` |

### 响应式设计约定

- **断点**：600px（唯一断点，移动端 vs 桌面端）
- **检测方式**：`useIsMobile()` Hook（基于 `matchMedia`，响应式 Ref）
- **布局策略**：
  - 桌面：侧栏导航 + 主内容区
  - 移动：顶部横向滚动 Tab + 全宽内容

### 代码风格

- **Prettier**：单引号、4 空格缩进、200 字符行宽、尾逗号 es5
- **ESLint**：允许 `any` 类型（`@typescript-eslint/no-explicit-any: off`）
- **未使用变量**：warn 级别，`_` 前缀的可豁免
- **Vue**：允许单词组件名（`vue/multi-word-component-names: off`）

### 版本号约定

格式为 `YY.MM.DD`（如 `25.09.20` = 2025 年 9 月 20 日），写在 `package.json` 的 `version` 字段。

---

## 技术实现要点

### 1. httpInstance 的 Token 刷新队列

`httpInstance.ts` 实现了一个**请求队列 + 单次刷新**的并发安全机制：

```
当 Token 即将过期时：
  - 第一个请求触发刷新，设 isRefreshing = true
  - 后续请求不再重复刷新，而是将自己的 resolve/reject 推入队列
  - 刷新完成后，遍历队列，用新 Token 重放所有等待的请求
  - 若刷新失败，队列中所有请求统一 reject
```

这避免了多个并发请求同时触发 Token 刷新的问题。

### 2. 斗鱼 WebSocket 二进制协议

`douyuWebSocket.ts` 实现了斗鱼私有的二进制弹幕协议：
- 消息头：12 字节（4 字节长度 + 4 字节长度 + 2 字节 type 689 + 1 字节加密 + 1 字节保留）
- 编码：自定义 `@=` 分隔的键值对格式
- 心跳：每 40s 发送 keep-alive 包
- 端口：随机选择 `wss://danmuproxy.douyu.com:8502-8505`
- 断线重连：自动处理

### 3. 节流函数的双回调设计

`throttle.ts` 不同于常见的"丢弃"型节流，它接受**两个回调**：

```typescript
throttle(mainCallback, throttledCallback, delay)
```

- 正常触发时执行 `mainCallback`（如：复制 + 计数 +1）
- 节流期内触发时执行 `throttledCallback`（如：显示"请勿刷次数"提示）

这样用户在节流期内操作时能获得明确反馈，而不是静默忽略。

### 4. 标签系统的"延迟初始化"模式

标签字典需要从后端加载，但多个组件在 mount 时就需要用到标签数据。  
解决方案是在 store 中创建一个 Promise：

```typescript
// store 初始化时
tagsLoadedPromise = setMemeTags()  // 返回 API 请求的 Promise

// 组件中
await memeTagsStore.tagsLoaded    // 等待加载完成后再渲染
```

这确保了无论组件挂载顺序如何，标签数据都能正确可用。

### 5. 生产环境的静默处理

`main.ts` 在生产环境下重写了 `console.log`、`console.dir`、`console.warn` 为空函数，  
仅保留 `console.error`，既避免了生产日志泄露，又保留了错误追踪能力。

### 6. 24 小时自动刷新

`main.ts` 和 `MainLayout.vue` 都设置了 `setInterval(() => location.reload(), 86400000)`，  
目的是强制用户每 24 小时获取最新前端版本，属于简易的缓存破坏策略。

### 7. AI 造梗的流式响应处理

`AIChat.vue` 使用 fetch + ReadableStream 实现 SSE 流式接收：
- 逐 chunk 解码追加到消息内容
- 实时渲染带光标动画
- 90s 超时自动断开
- 响应后处理：清除 `<think>` 标签、修复断行的 markdown 列表格式

### 8. 构建优化

`vite.config.ts` 中的关键优化：
- **Gzip 压缩**：>10KB 的文件自动生成 `.gz`
- **按依赖拆包**：`node_modules` 下每个包独立 chunk（利用浏览器缓存）
- **TypeScript 检查**：构建时通过 `vite-plugin-checker` 执行类型检查
- **路径别名**：`@` → `src/`

---

## 开发建议（给 AI 和新人）

### 新增一个弹幕分类页面

1. 在 `constants/backend.ts` 的 `API` 对象中添加新的 API 路径
2. 在 `constants/backend.ts` 的 `MemeCategory` 数组中添加导航项（含 path、text、icon、api）
3. 在 `router/index.ts` 中添加对应路由（通常复用 `memes-view.vue` 组件）
4. 准备图标：在 `assets/icons/` 下添加 SVG

> `memes-view.vue` 是通用的弹幕列表容器，通过路由参数 + `MemeCategory` 配置自动匹配 API。  
> 多数分类页面**不需要**新建 Vue 文件。

### 新增一个 API 接口

1. 在 `constants/backend.ts` 的 `API` 对象中定义路径常量
2. 在 `types/` 下定义请求和响应类型
3. 在 `apis/` 下对应文件中添加函数，使用 `post<T, R>()` 或 `get<R>()` 泛型
4. 如果返回数据需要跨组件共享，在 `stores/` 中添加缓存

### 新增一个全局共享状态

1. 在 `stores/` 下新建 `use[Name]Store.ts`
2. 使用 `defineStore` + Composition API 风格
3. 如果需要异步初始化，使用 Promise 模式（参考 `memeTags.ts`）
4. 在 `MainLayout.vue` 的 `onMounted` 中触发初始化

### 修改样式时注意

- 全局样式在 `assets/css/global.css` 和 `assets/css/index.scss`
- 组件样式使用 `<style scoped>`
- Element Plus 主题色覆盖通过 CSS 变量
- 移动端适配统一使用 `useIsMobile()` + `v-if` 或 CSS `@media (max-width: 600px)`

### 常见坑点

1. **后端暂未开源**：所有 API 行为只能从前端代码推断，修改接口需联系后端作者
2. **标签是字符串**：`tags` 字段是 `"01,03"` 而非数组，操作时注意 split/join
3. **两处 24h 刷新**：`main.ts` 和 `MainLayout.vue` 各有一个 `setInterval`，修改时两处都要改
4. **jsencrypt.js 是 JS 文件**：内含公私钥，未迁移到 TypeScript，修改时注意类型
5. **ChatRoom 部分功能已注释**：WebSocket 聊天功能 UI 大部分被注释，仅保留在线人数展示
6. **env 文件中开发和生产 API 地址相同**：目前都指向 `hguofichp.cn:10086`，本地调试时可能需要代理

### 给 AI 助手的特别提示

- 本项目后端不开源，不要尝试修改后端代码或假设后端结构
- 修改 API 调用时，务必保持与 `constants/backend.ts` 中路径常量的一致性
- 新增组件优先考虑复用现有的 `components/` 下的组件
- 提交代码前运行 `npm run lint:fix` 确保代码风格一致
- 项目使用 4 空格缩进、单引号、200 字符行宽——请严格遵守
