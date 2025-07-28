import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import svgr from 'vite-plugin-svgr';
import fs from 'fs';
import { compression } from 'vite-plugin-compression2';

function copyFilesPlugin(): Plugin {
  return {
    name: 'copy-files',
    async buildEnd() {
      const filesToCopy = [
        {
          from: 'node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js',
          to: 'public/vad.worklet.bundle.min.js',
        },
        {
          from: 'node_modules/@ricky0123/vad-web/dist/silero_vad.onnx',
          to: 'public/silero_vad.onnx',
        },

        {
          from: 'node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm',
          to: 'public/ort-wasm-simd-threaded.wasm',
        },

        {
          from: 'node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm',
          to: 'public/ort-wasm-simd.wasm',
        },
        {
          from: 'node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm',
          to: 'public/ort-wasm-threaded.wasm',
        },
        {
          from: 'node_modules/onnxruntime-web/dist/ort-wasm.wasm',
          to: 'public/ort-wasm.wasm',
        },
      ];

      filesToCopy.forEach(({ from, to }) => {
        const fromPath = path.resolve(__dirname, from);
        const toPath = path.resolve(__dirname, to);

        console.log('Copying file:', fromPath, 'to:', toPath);

        // Create directories if they don't exist
        fs.mkdirSync(path.dirname(toPath), { recursive: true });

        try {
          // Copy files
          fs.copyFileSync(fromPath, toPath);
          console.log('File copied successfully.');
        } catch (error) {
          console.error('Error copying file:', error);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [svgr(), react(), copyFilesPlugin(), compression()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8008',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'ws://localhost:8010',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'ai-assistant-component': path.resolve(__dirname, 'src/ai-assistant-component.js'),
      },
      external: ['src/global/config.js']
    }
  }
});
