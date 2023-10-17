import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

import fs from 'fs'; // [tl! 追加]

// 環境変数のAPP_DOMAIN（hoge.comなど）を渡す
const host = process.env.APP_DOMAIN; // [tl! 追加]

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    server: { // [tl! 追加]
        host: true, // 追加。「true(全て許可)」でいけた。公式hostは無理だった
        // host, // [tl! 追加]が公式だがしない
        hmr: { host }, // [tl! 追加]
        https: { // [tl! 追加]
            key: fs.readFileSync(`./ssl/default.key`), // [tl! 追加]
            cert: fs.readFileSync(`./ssl/default.crt`), // [tl! 追加]
        }, // [tl! 追加]
    }, // [tl! 追加]
});
