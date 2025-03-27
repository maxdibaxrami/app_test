import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    mkcert(),
    // Uncomment checker if needed
    // checker({ typescript: false })
  ],
  publicDir: './public',
  server: {
    host: true,
  },
  resolve: {
    alias: {
      // Alias for Node polyfills:
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      // add any other required polyfills here
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Define global variable mapping for browser:
      define: { global: 'globalThis' },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin()
      ],
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Use the rollup plugin to polyfill Node.js core modules in the bundle
        rollupNodePolyFill()
      ]
    }
  }
});
