import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(async () => {
    const { default: checker } = await import('vite-plugin-checker');
    return {
        base: '/',
        plugins: [
            vue(),
            viteCompression({
                algorithm: 'gzip', // 使用 gzip 压缩算法
                ext: '.gz', // 生成的文件扩展名
                threshold: 10240, // 只有文件大小超过 10KB 才会被压缩
                deleteOriginFile: false, // 是否删除原始文件，默认为 false
            }),
            checker({
                typescript: true,
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        build: {
            chunkSizeWarningLimit: 1000, // 调整包的大小
            rollupOptions: {
                // external: [
                //     'three',
                //     'three/examples/jsm/controls/OrbitControls.js'
                // ], // 将 three 和 OrbitControls 设置为外部依赖
                output: {
                    // 最小化拆分包
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    },
                    // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
                    entryFileNames: 'assets/js/[name].[hash].js', // 用于命名代码拆分时创建的共享块的输出命名
                    chunkFileNames: 'assets/js/[name].[hash].js', // 用于输出静态资源的命名，[ext]表示文件扩展名
                    assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
                },
            },
        },
    };
});
