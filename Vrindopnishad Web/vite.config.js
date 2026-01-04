import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                mobile: resolve(__dirname, 'Home/main/index(forSmallScreen).html'),
            },
        },
    },
    server: {
        open: true,
    },
});
