import { babel } from '@rollup/plugin-babel'
import path from 'path'
import esbuild from 'rollup-plugin-esbuild'
import commonjs from '@rollup/plugin-commonjs'
import server from 'rollup-plugin-serve' 
import livereload from 'rollup-plugin-livereload'
export default  {
  input: path.resolve(__dirname, 'src/main.ts'),
  output: {
    file: path.resolve(__dirname, 'example/index.js'),
    name: 'ProxyValidator',
    format: 'umd',
    exports: 'default',
  },
  plugins: [
    babel(),
    esbuild({
      target: 'es2015',
    }),
    commonjs(),
    server("example"),
    livereload(),
  ],
}
