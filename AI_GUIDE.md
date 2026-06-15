# AI_GUIDE.md

这份文档给接手项目的人和 AI 助手用。重点不是“开发流程”，而是这个前端项目真正依赖的东西：

- 前端调了哪些后端接口
- 页面和组件怎么嵌套
- UI 布局在桌面端和移动端分别怎么排
- 后续改代码时最容易踩到哪里

## 项目定位

这是 `sb6657.cn` 的 Vue 前端。项目核心不是复杂前端状态机，而是：

1. 从后端接口拿烂梗、标签、屏蔽词、帖子、赛事、AI 会话等数据。
2. 用 Element Plus 表格、弹窗、分页、表单展示和提交。
3. 在桌面端和移动端做两套偏不同的布局。

技术栈：

| 类别 | 使用 |
| --- | --- |
| 框架 | Vue 3、Vue Router、Pinia |
| UI | Element Plus、Element Plus Icons |
| 样式 | SCSS、组件内 scoped 样式、少量全局 CSS |
| 图表/生成 | ECharts wordcloud、Three.js、html2canvas、html-to-image |
| 请求 | Axios 封装在 `src/apis/httpInstance.ts` |

## 请求层和后端地址

后端地址定义在 `src/constants/backend.ts`：

```ts
export const SERVER_ADDRESS = import.meta.env.VITE_BASE_URL || 'https://hguofichp.cn:10086';
```

统一请求实例在 `src/apis/httpInstance.ts`：

- `baseURL` 使用 `SERVER_ADDRESS`。
- 请求头会自动带：
  - `siteToken`：匿名统计用，存 cookie。
  - `dpahjdoiaw`：Web 前端来源统计标记，用来告诉后端“这次请求来自 sb6657.cn 官网前端”。
  - `Authorization: Bearer ${token}`：登录后带。
- `dpahjdoiaw` 不是鉴权密钥，也不是反爬安全边界。QQ bot、agent、油猴插件或第三方脚本如果复用网站后端接口，不要复制这个请求头，否则会把外部调用统计到官网前端来源里。
- 响应拦截器会把 AxiosResponse 解成后端返回体，所以组件里 `await httpInstance.get(...)` 得到的是 `{ code, data, msg }` 这一层，不是 Axios 原始响应。
- Token 即将过期时会用 `/refresh-token` 刷新，并把刷新期间的请求放进队列。
- 登录页的“15天内自动登录”控制 token 存储位置：勾选后存 `localStorage`，未勾选只存当前浏览器会话的 `sessionStorage`；业务代码统一通过 `cookieUtils.getToken()` 取登录态。
- 401 会弹登录框；500/601/其他错误会走 Element Plus 消息提示。

另外 `httpInstance.ts` 还导出了两个轻封装：

| 函数 | 返回 |
| --- | --- |
| `get<R>(url)` | `{ _failure, flatData }` |
| `post<T, R>({ url, data })` | `{ _failure, flatData }` |

目前只有部分 API 使用这两个封装，很多组件还是直接 `httpInstance.get/post`。

## 后端接口清单

下面按业务域列出前端实际调用过的接口。路径来自当前代码扫描，不只来自 `API` 常量。

### 登录、注册、用户

| 方法 | 路径 | 调用位置 | 用途 |
| --- | --- | --- | --- |
| GET | `/captchaImage` | `login.vue`、`register.vue` | 获取图片验证码和 uuid |
| POST | `/login` | `login.vue` | 登录，返回 token / refreshToken |
| POST | `/refresh-token` | `httpInstance.ts` | 刷新登录 token |
| GET | `/login/getMailCode` | `register.vue`、`resetPassword.vue` | 发送邮箱验证码 |
| POST | `/register` | `register.vue` | 注册 |
| POST | `/resetPassword` | `resetPassword.vue` | 未登录时重置密码 |
| GET | `/system/user/profile` | `user/components/index.vue` | 获取当前用户资料 |
| PUT | `/system/user/profile/updatePwd` | `user/components/resetPwd.vue` | 已登录用户修改密码 |

### 烂梗、标签、投稿、搜索

| 方法 | 路径 | 调用位置 | 用途 |
| --- | --- | --- | --- |
| GET | `/machine/dictList` | `memeTags` store | 获取烂梗标签字典 |
| GET | `/machine/Page?` | `getMemeList()`、`memes-view.vue`、`didYouKnow.vue` | 分页获取烂梗，常带 `tags/pageNum/pageSize` |
| GET | `/machine/sortAllBarrage` | `memes-view.vue` | 全部烂梗按复制数排序 |
| POST | `/machine/pageSearch` | `search-dialog.vue`、`sendPost.vue` | 搜索烂梗，支持关键词、标签、时间、排序 |
| GET | `/machine/hotBarrageOf24H` | `header-bar.vue` | 24 小时热门 |
| GET | `/machine/hotBarrageOf7Day` | `header-bar.vue` | 7 天热门 |
| GET | `/machine/getRandOne` | `random-meme.vue` | 首页随机一条烂梗 |
| POST | `/machine/submission` | `Home.vue`、`submission-dialog.vue`、`setMeme.ts` | 投稿烂梗，可带 `tags/barrage/matchId` |
| GET | `/machine/addCnt/{memeId}` | 多处复制按钮 | 复制次数 +1 |
| GET | `/machine/getBarrageInfo/{barrageId}` | 帖子列表 | 根据烂梗 ID 获取烂梗内容 |
| GET | `/machine/MeMemesPageList` | `Me-memes.vue` | 我的烂梗投稿 |
| GET | `/machine/InProgressMatch` | `Home.vue`、`submission-dialog.vue` | 获取当前进行中的大型赛事，用于投稿关联赛事 |
| GET | `/machine/WordCloud` | `wordCloud.vue` | 搜索词云数据 |

`API` 常量里还保留了若干分类路径，例如 `GET_FK_WJQ_MEME`、`GET_QUQU_MEME`，现在主要靠 `/machine/Page?` 加 `tags` 参数实现分类。

### 屏蔽词

| 方法 | 路径 | 调用位置 | 用途 |
| --- | --- | --- | --- |
| GET | `/machine/getShieldWordDict` | `shieldWordStore` | 获取已生效屏蔽词字典，列表页用来标记烂梗 |
| GET | `/machine/getShieldWordList` | `shieldWord.vue` | 屏蔽词投票列表 |
| GET | `/machine/addIsShieldWord` | `shieldWord.vue` | 投票“这是屏蔽词”，参数 `id` |
| GET | `/machine/addNotShieldWord` | `shieldWord.vue` | 投票“这不是屏蔽词”，参数 `id` |
| GET | `/machine/addShieldWord` | `shieldWord.vue` | 投稿屏蔽词，参数 `shieldWord` |
| GET | `/machine/getMyShieldWordList` | `shieldWord.vue` | 我投稿的屏蔽词列表 |

### 帖子、评论、消息

| 方法 | 路径 | 调用位置 | 用途 |
| --- | --- | --- | --- |
| GET | `/machine/Post/list` | `post-bar-main.vue` | 社区帖子列表 |
| GET | `/machine/Post/selectIsMePageList` | `Me-Post.vue` | 我的帖子列表 |
| POST | `/machine/Post/ReviewPost/submit` | `sendPost.vue` | 发帖投稿，进入审核 |
| POST | `/machine/Post/like/{postId}` | `post-bar-main.vue`、`Me-Post.vue` | 点赞帖子 |
| POST | `/machine/Post/Statement` | `post-bar-main.vue`、`Me-Post.vue` | 给帖子发表态，`statementNum` 0-8 |
| GET | `/machine/Post/Comment/getComment/{postId}` | `CommentList.vue`、帖子列表 | 获取帖子评论 |
| POST | `/machine/Post/Comment/add` | `CommentList.vue` | 新增评论 |
| POST | `/machine/Post/Comment/like/{commentId}` | `CommentList.vue`、`CommentItem.vue` | 点赞评论 |
| POST | `/machine/Post/Comment/reply` | `CommentList.vue`、`CommentItem.vue` | 回复评论 |
| GET | `/machine/SysMessage/getMsgNum` | `header-bar.vue` | 顶部消息未读数 |
| GET | `/machine/SysMessage/getLikeMsgList` | `Post-Message.vue` | 我的消息列表 |

### 赛事竞猜、赛事烂梗库

| 方法 | 路径 | 调用位置 | 用途 |
| --- | --- | --- | --- |
| GET | `/machine/matches` | `CS2Major.vue` | 当前 Major 赛事和阶段配置 |
| GET | `/machine/matches/{matchId}/teams` | `match.ts`、`MajorPhase.vue`、`MajorChampion.vue` | 获取某赛事某阶段队伍，参数 `phase` |
| POST | `/machine/prediction/submit` | `match.ts` | 保存预测 |
| GET | `/machine/prediction/records` | `match.ts` | 获取当前用户预测记录，参数 `matchId/phase` |
| GET | `/machine/shareMatch` | `CS2Major.vue` | 分享截图后统计 |
| GET | `/machine/matchCoin` | `CS2Major.vue` | 预览 3D 硬币后统计 |
| GET | `/machine/getMatchList` | `matchLib.vue` | 赛事库列表 |
| GET | `/machine/matchPageList` | `matchLib.vue` | 某赛事关联烂梗列表，参数 `matchId/pageNum/pageSize` |

### 年度 TOP20

| 方法 | 路径 | 调用位置 | 用途 |
| --- | --- | --- | --- |
| POST | `/machine/hotTop20/pick` | `AnnualHotList.vue` | TOP20 提名/投票 |
| POST | `/machine/hotTop20/Query` | `AnnualHotList.vue` | TOP20 活动内搜索候选烂梗 |
| GET | `/machine/hotTop20/loadTop20` | `AnnualHotList.vue` | 加载提名榜、阶段榜或最终结果 |
| GET | `/machine/hotTop20/pickSum` | `AnnualHotList.vue` | 总提名数 |

另一个展示页 `memeTop20.vue` 不走后端，直接读 OSS JSON：

| 方法 | URL | 用途 |
| --- | --- | --- |
| GET | `https://sb6657oss.wishao.fun/memeTop20_2025.json` | 2025 TOP20 展示 |
| GET | `https://sb6657oss.wishao.fun/memeTop20_2024.json` | 2024 TOP20 展示 |

### AI 造梗

| 方法 | 路径 | 调用位置 | 用途 |
| --- | --- | --- | --- |
| GET | `/ai/sessions` | `AIChat.vue` | 会话列表 |
| GET | `/ai/sessions/{sessionId}/messages` | `AIChat.vue` | 某会话消息 |
| DELETE | `/ai/sessions/{sessionId}` | `AIChat.vue` | 删除会话 |
| POST | `/ai/chat/stream` | `AIChat.vue` | SSE 流式聊天/造梗 |
| GET | `/ai/daily-remaining` | `AIChat.vue` | 今日剩余次数 |

`/ai/chat/stream` 使用原生 `fetch`，不是 `httpInstance`，手动带 `Authorization`。请求体大致是：

```json
{
  "prompt": "用户输入",
  "needReasoning": true,
  "sessionId": 123,
  "enableWebSearch": true,
  "skill": "MEME_MAKER",
  "mode": "MEME"
}
```

### 相册、外部数据和其他接口

| 方法 | 路径 / URL | 调用位置 | 用途 |
| --- | --- | --- | --- |
| GET | `/machine/showImage` | `image.vue` | 主播相册分页 |
| POST | `/machine/addCommentname` | `image.vue` | 图片评论 |
| GET | `https://sb6657oss.wishao.fun/dejaVuNiko.json` | `deja-vu-niko.vue` | 超级逮虾户战报数据 |
| GET | `https://sb6657oss.wishao.fun/15warriorsDonk_2025.json` | `15warriorsDonk.vue` | 2025 布雷德十五勇士榜 |
| GET | `https://sb6657oss.wishao.fun/15warriorsDonk_2026.json` | `15warriorsDonk.vue` | 2026 布雷德十五勇士榜 |
| POST | `https://easycomment.ai/api/xhs/v1/detect-sensitive-words` | `ChatRoom.vue` | 敏感词检测实验接口 |

## 全局组件树

```text
App.vue
├─ RouterView
│  └─ MainLayout.vue
│     ├─ HeaderBar
│     │  ├─ 热门烂梗入口
│     │  ├─ 搜索框 -> search-dialog.vue
│     │  ├─ 消息入口
│     │  ├─ 用户入口 -> userHome.vue -> login/register/resetPassword
│     │  └─ 赞助/广告弹窗
│     ├─ 移动端横向 Tab 导航
│     ├─ 桌面端左侧 Sidebar 菜单
│     ├─ RouterView 页面内容
│     ├─ FooterBar
│     ├─ FloatingSidebar
│     │  ├─ 首页桌面端词云 HomeWordCloudPanel -> wordCloud.vue
│     │  ├─ 桌面端可拖拽 ChatRoom
│     │  ├─ 官方交流群竖向按钮
│     │  └─ 赞助/广告入口
│     └─ 直播间贵宾数 GuiBin
├─ Starrysky.vue
└─ IdleScreensaver.vue
```

说明：

- `Starrysky.vue` 是全局背景，不负责业务浮窗。
- `FloatingSidebar.vue` 是全局浮窗、右侧栏、桌面首页词云的入口。
- `MainLayout.vue` 会在挂载时启动斗鱼 WebSocket，用于直播间贵宾数和开播提示。

## 路由和页面组件

所有主页面都挂在 `MainLayout` children 下，路由在 `src/router/index.ts`。

| 路径 | 页面组件 | 主要用途 |
| --- | --- | --- |
| `/home` | `Home.vue` | 首页、介绍、随机烂梗、烂梗投稿 |
| `/memes/:category` | `memes-view.vue` | 烂梗列表页，目前主要 `/memes/AllBarrage` |
| `/shieldWord` | `shieldWord.vue` | 屏蔽词列表、投票、投稿 |
| `/post-bar` | `post-bar-main.vue` | 社区帖子流 |
| `/me-post` | `Me-Post.vue` | 我的帖子 |
| `/me-msg` | `Post-Message.vue` | 我的消息 |
| `/me-memes` | `Me-memes.vue` | 我的烂梗投稿 |
| `/UserInfo` | `user/components/index.vue` | 用户资料和修改密码 |
| `/aichat` | `AIChat.vue` | AI 闲聊/造梗 |
| `/matchPrediction` | `CS2Major.vue` | Major 赛事竞猜 |
| `/matchLib` | `matchLib.vue` | 赛事烂梗库 |
| `/image` | `image.vue` | 主播相册和评论 |
| `/dejaVuNiko` | `deja-vu-niko.vue` | 超级逮虾户战报 |
| `/15warriorsDonk` | `15warriorsDonk.vue` | 布雷德十五勇士榜 |
| `/memeTop20` | `memeTop20.vue` | 年度 TOP20 展示 |
| `/update` | `update-timeline.vue` | 更新日志 |
| `/Tampermonkey` | `Tampermonkey.vue` | 油猴脚本说明 |
| `/ChatRoom` | `ChatRoom.vue` | 聊天室独立路由 |

`MemeCategory` 在 `src/constants/backend.ts` 同时控制侧边栏和移动端 Tab 的主要菜单项。

## 核心页面和组件说明

### 首页 `Home.vue`

桌面端结构：

```text
Home
├─ 顶部 boom 图片
├─ cards-container
│  ├─ HomeIntro
│  └─ DidYouKnow
├─ RandomMeme
├─ 投稿卡片
│  ├─ tag-selector
│  ├─ textarea
│  ├─ 当前赛事关联区
│  └─ 投稿按钮
├─ ChatRoom（移动端内容流里显示，桌面端 CSS 隐藏）
├─ 友情链接
└─ HomeWordCloudPanel（移动端显示）
```

桌面首页右侧词云不是 `Home.vue` 直接放的，而是 `MainLayout` 给 `.content--with-home-sidebar` 预留右侧空间，`FloatingSidebar` 固定显示 `HomeWordCloudPanel`。

### 烂梗列表 `memes-view.vue`

用于分类/全部烂梗展示：

- `/memes/AllBarrage` 时顶部显示标签筛选卡片。
- 顶部有“投稿”和“按复制次数排序”。
- 主体是 `el-table`：
  - id 列
  - 内容列，hover 弹出标签和投稿时间
  - 复制按钮列，复制后调用 `/machine/addCnt/{id}`
- 含屏蔽词的内容会用警告图标标记。
- 内部挂了 `submission-dialog.vue` 用于投稿弹窗。

### 投稿弹窗 `submission-dialog.vue`

复用在烂梗列表页：

- 标签选择：`tag-selector`
- 输入弹幕：`el-input textarea`
- 底部：可关联当前进行中的赛事 `/machine/InProgressMatch`
- 提交：`/machine/submission`

`Home.vue` 里有一份相似的内联投稿表单，两者逻辑重复较多，后续可以考虑抽一个投稿表单组件。

### 标签选择器 `tag-selector.vue`

输入输出：

| 属性 | 说明 |
| --- | --- |
| `:tags` | 全部标签，从 `memeTagsStore.memeTags` 来 |
| `v-model:selectedTags` | 当前已选标签 |

UI：

- 上方显示已选标签，点击移除。
- 下方显示所有可选标签，点击加入。
- 标签带 icon，没 icon 时 store 会用默认 `tag.svg` 补。

### 顶部栏 `header-bar.vue`

桌面端显示：

- logo 和标题
- 24h 热门轮播入口
- 搜索框
- 上传照片/建议/BUG 按钮
- 商务/油猴/斗鱼/ GitHub /赞赏入口
- 消息入口
- 用户入口

移动端变化：

- 标题隐藏，只保留 logo。
- 搜索框移到 logo 区域内的 `.elinput-mobile`。
- 操作按钮压缩成一行。
- 24h 热门条在移动端以绝对定位显示，并且非首页时隐藏。

### 搜索弹窗 `search-dialog.vue`

由 Header 搜索框打开：

- 顶部高级筛选区域可折叠。
- 支持时间范围、标签筛选、按时间/id 或复制次数排序。
- 表格展示搜索结果，关键词高亮。
- 每页 20 条。
- 移动端分页简化为 `prev, pager, next`，按钮文案变短。

### 热门弹窗 `meme-dialog.vue`

Header 里的 24h/7d 热门弹窗复用组件：

- 接收 `memeArr/loading/emptyText`
- Header 用 slot 塞标题和切换按钮。
- 表格结构与 `memes-view.vue` 接近。

这个组件当前还有不少内联样式和注释掉的点赞列，后续清理时可以参考已经整理过的 `memes-view.vue`。

### 贴吧模块

组件结构：

```text
post-bar-main.vue
├─ sendPost.vue
├─ 帖子卡片列表
│  ├─ 烂梗 popover
│  ├─ 表态 popover
│  ├─ 点赞
│  └─ CommentList.vue
│     └─ CommentItem.vue（递归 children）
└─ 加载更多
```

接口集中在 `/machine/Post/**`。移动端主要是帖子卡宽度变 100%，字体略缩，footer 操作仍横向排列。

### 赛事竞猜

组件结构：

```text
CS2Major.vue
├─ 赛事信息面板
├─ 阶段 Tab：onePhase / twoPhase / threePhase / champion
├─ MajorPhase.vue
│  └─ Base.vue（通用拖拽预测版）
├─ MajorChampion.vue（冠军单选拖拽）
└─ CoinPreviewDialog.vue
```

布局：

- 桌面端左侧赛事信息，右侧预测区。
- 1200px 以下开始调整宽度。
- 768px 以下改为纵向布局，队伍卡片和拖拽区压缩。
- 375px 以下还有更细的队伍卡适配。

### 赛事烂梗库 `matchLib.vue`

- 先展示赛事卡片列表 `/machine/getMatchList`。
- 点击赛事打开弹窗，展示该赛事期间投稿并关联的烂梗 `/machine/matchPageList`。
- 弹窗宽度桌面 75%，移动端 100%。

### AI 造梗 `AIChat.vue`

组件内部是两栏布局：

```text
AIChat
├─ 左侧 session-sidebar
│  ├─ 会话列表
│  └─ 新建/切换/右键删除
└─ 右侧 chat-main
   ├─ header
   ├─ chat-window
   └─ input-area
      ├─ 模式：闲聊 / 造梗
      ├─ 开关：思考过程 / 联网搜索
      └─ 发送框
```

特点：

- 会话接口走 `httpInstance`。
- 流式回复走原生 `fetch('/ai/chat/stream')`。
- Markdown 用 `marked` 渲染，再用 `DOMPurify` 清洗。
- 主题跟随系统深浅色。

### 屏蔽词页面 `shieldWord.vue`

- 主列表是卡片网格，不是表格。
- 每个词可以投“这是屏蔽词”和“这不是屏蔽词”。
- 已判定不是屏蔽词的卡片会加 disabled/stamp。
- 另有投稿弹窗和“我投稿的屏蔽词”表格弹窗。
- 1200px/768px/500px 有多级响应式卡片布局。

### 图片和榜单页面

| 页面 | 数据来源 | UI 说明 |
| --- | --- | --- |
| `image.vue` | `/machine/showImage`、`/machine/addCommentname` | 图片瀑布/列表、图片预览、评论弹窗 |
| `memeTop20.vue` | OSS JSON | 年度 TOP20 静态榜单，年份下拉切换 |
| `AnnualHotList.vue` | `/machine/hotTop20/**` | 年度 TOP20 评选活动页 |
| `deja-vu-niko.vue` | OSS JSON | 战报式表格页面 |
| `15warriorsDonk.vue` | OSS JSON | 榜单页面，可导出图片 |

## 桌面端和移动端布局

### 全局断点

项目主要断点是：

| 断点 | 使用 |
| --- | --- |
| `600px` | 全局移动端判断，`useIsMobile()` 也是 `(max-width: 600px)` |
| `601px` | 桌面端样式起点 |
| `768px` | 部分复杂页面，如首页卡片、赛事、投稿弹窗、随机烂梗 |
| `1200px` | 赛事竞猜和屏蔽词卡片的中等屏适配 |
| `375px/360px` | 赛事拖拽卡片和榜单超窄屏 |

`src/utils/common.ts` 的 `useIsMobile()` 只认 600px，因此用它控制显隐的组件和 CSS 里的 768px 断点可能不完全一致。

### 桌面端

`MainLayout.vue`：

- Header sticky 在顶部。
- 左侧 `el-menu` 侧栏显示。
- `.main-content` 是横向 flex。
- `.content` 占剩余空间。
- 首页额外加 `.content--with-home-sidebar`，右侧预留 360px 给词云/广告。
- `FloatingSidebar` 显示可拖拽聊天室、首页词云、广告、竖排按钮。

### 移动端

`MainLayout.vue`：

- 左侧 sidebar 隐藏。
- 顶部出现横向滚动 Tab。
- 内容区全宽。
- Header 不 sticky，内部换行。
- `FloatingSidebar` 隐藏可拖拽聊天室和固定广告，只保留变窄的竖排入口。
- `Home.vue` 里显示移动端 `HomeWordCloudPanel`，聊天室进入内容流。
- 许多页面表格仍然存在横向压力，后续如果优化移动端，优先看表格列宽和弹窗宽度。

## 目录地图

```text
src/
├─ apis/
│  ├─ httpInstance.ts        请求实例、token 刷新、错误处理
│  ├─ getMeme.ts             烂梗读取、搜索、标签、随机
│  ├─ setMeme.ts             复制计数、老投稿函数
│  ├─ getShieldWordDict.ts   屏蔽词字典
│  └─ match.ts               赛事竞猜接口封装
├─ constants/
│  └─ backend.ts             SERVER_ADDRESS、API 常量、侧栏菜单 MemeCategory
├─ stores/
│  ├─ memeTags.ts            标签字典缓存
│  ├─ shieldWordStore.ts     屏蔽词缓存和检测
│  ├─ useAuthStore.ts        登录弹窗和 userId
│  └─ GuiBinStore.ts         斗鱼贵宾数
├─ components/
│  ├─ tag-selector.vue
│  ├─ submission-dialog.vue
│  ├─ ChatRoom.vue
│  ├─ wordCloud.vue
│  ├─ header-bar/search-dialog.vue
│  └─ home/*
└─ views/
   ├─ MainLayout/
   │  ├─ MainLayout.vue
   │  └─ components/
   │     ├─ Home.vue
   │     ├─ memes-view.vue
   │     ├─ header-bar/
   │     ├─ right-sidebar/
   │     ├─ post-bar/
   │     ├─ match-prediction/
   │     ├─ AiGenerateMemes/
   │     └─ user/
   ├─ Starrysky.vue
   └─ IdleScreensaver.vue
```

## 状态和数据缓存

| Store | 内容 | 使用场景 |
| --- | --- | --- |
| `memeTags` | 烂梗标签字典 | 标签选择器、烂梗 popover、投稿表单 |
| `shieldWordStore` | 屏蔽词字典 | 烂梗列表和搜索结果标记风险内容 |
| `useAuthStore` | 登录弹窗可见性、userId | 401 后弹登录，赛事预测读取 userId |
| `GuiBinStore` | 斗鱼直播间贵宾数 | MainLayout 底部显示 |

`memeTags` 和 `shieldWordStore` 都用了 Promise loaded 模式：

```ts
memeTagsStore.tagsLoaded.then(() => {
  allTags.value = memeTagsStore.memeTags;
});
```

改组件时注意：如果页面一进来就要展示标签，不能假设 `memeTags` 已经有值。

## 样式现状和维护建议

全局样式：

- `src/assets/css/index.scss`：Element Plus 主题变量。
- `src/assets/css/global.css`：全局 reset、`.card`、`.el-backtop`、`.site-version` 等。

组件样式：

- 大多数是 `<style scoped lang="scss">`。
- 历史代码里还有不少行内样式，尤其是搜索弹窗、热门弹窗、帖子模块、相册、榜单页。
- 最近整理过：
  - `src/views/MainLayout/components/memes-view.vue`
  - `src/views/MainLayout/components/Home.vue`
  - `src/components/submission-dialog.vue`

继续清样式时建议：

1. 先只改一个组件，不要跨组件顺手重构。
2. 行内 `style` 迁到语义 class。
3. Element Plus 弹窗、popover、table 内部样式要注意 teleport 和 scoped，必要时用 `:deep()` 或给弹层内容自己的 root class。
4. 移动端先确认这个组件使用的是 600px 还是 768px，不要硬套一个断点。
5. 改完跑 `npm run build`。当前 `npm run lint` 因 ESLint 9 缺少 `eslint.config.js` 会直接失败，不是单个文件的问题。

## 常见坑

- 后端不开源，接口行为只能从前端调用和返回处理推断。
- 很多接口没有统一放在 `API` 常量里，新增接口最好先补 `constants/backend.ts`，但查旧接口要全局搜 `httpInstance`。
- `tags` 字段是逗号分隔字符串，不是数组。
- `httpInstance.get/post` 返回的是后端 body，不是 AxiosResponse。
- AI 流式接口不走 `httpInstance`，要手动拼 `httpInstance.defaults.baseURL`，token 通过 `cookieUtils.getToken()` 读取。
- 生产环境会屏蔽 `console.log/dir/warn`，只保留 `console.error`。
- `main.ts` 每 24 小时自动 `location.reload()`。
- `FloatingSidebar.vue` 还有动态 `:style`，属于拖拽定位必需；不要和普通行内 CSS 一起机械删除。
- 当前 dev/build 会输出一些 Vite 警告，例如大 chunk、动态/静态 import 重复、某图片运行时解析；这些不是最近组件整理引入的。
