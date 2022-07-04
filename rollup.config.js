import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
// import { terser } from "rollup-plugin-terser";
import path from "path";
import esbuild from "rollup-plugin-esbuild";

export default [
  {
    input: path.resolve(__dirname, "src/main.ts"),
    output: {
      file: path.resolve(__dirname, "dist/dist-web/bundle.js"),
      name: "bundle",
      format: "umd",
      exports: "default",
    },
    plugins: [
      esbuild({
        target: "es2015",
      }),
      commonjs(),
      // terser({
      //   compress: { drop_console: true },
      // }),
    ],
  },
  {
    input: path.resolve(__dirname, "src/main.ts"),
    output: {
      file: path.resolve(__dirname, "dist/dist-esm/bundle.js"),
      format: "esm",
    },
    plugins: [
      esbuild(),
      // terser({
      //   compress: { drop_console: true },
      // }),
    ],
    external: ["gsap"],
  },
  {
    input: path.resolve(__dirname, "src/main.ts"),
    output: {
      file: path.resolve(__dirname, "dist/dist-types/bundle.d.ts"),
      format: "es",
    },
    plugins: [dts()],
  },
];
