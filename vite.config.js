import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// 导入对应包

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import ElementPlus from 'unplugin-element-plus/vite'


// https://vitejs.dev/config/
export default defineConfig({
    base: "/sb6657/",
    plugins: [
        vue(),
        AutoImport({
            // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
            imports: ['vue'],
            resolvers: [
                IconsResolver({
                    prefix: 'Icon',
                }),
                // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
                ElementPlusResolver(
                    {importStyle: 'sass'}
                )
            ],
        }),
        Components({
            resolvers: [
                // 自动注册图标组件
                IconsResolver({
                    enabledCollections: ['ep'],
                }),
                // 自动导入 Element Plus 组件
                ElementPlusResolver(
                    {importStyle: 'sass'}
                )],
        }),

        // 按需定制主题配置
        ElementPlus({
            useSource: true,
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                // 自动导入定制化样式文件进行样式覆盖
                additionalData: `
          @use "@/assets/css/index.scss" as *;
        `,
            }
        }
    },
    build: {
        outDir: "docs"
    }
    // build: {
    //     chunkSizeWarningLimit: 1000, // 调整包的大小
    //     rollupOptions: {
    //         output: {
    //             // 最小化拆分包
    //             manualChunks(id) {
    //                 if (id.includes('node_modules')) {
    //                     return id.toString().split('node_modules/')[1].split('/')[0].toString()
    //                 }
    //             },
    //             // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
    //             entryFileNames: 'assets/js/[name].[hash].js', // 用于命名代码拆分时创建的共享块的输出命名
    //             chunkFileNames: 'assets/js/[name].[hash].js', // 用于输出静态资源的命名，[ext]表示文件扩展名
    //             assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
    //         }
    //     }
    // },
    // devServer: {
    //     proxy: {
    //         '/api': {//获取路径中包含了/api的请求，与axios请求同步增加
    //             target: 'https://localhost:9090',//后台服务所在的源
    //             changeOrigin: true,//修改源
    //             rewrite: (path) => path.replace(/^\/api/, '')///api替换为''
    //         }
    //     }
    // },

})

