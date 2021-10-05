import babel from "@rollup/plugin-babel";
import external from "rollup-plugin-peer-deps-external";
import del from "rollup-plugin-delete";
import pkg from "./package.json";
import typescript from "rollup-plugin-typescript2";
import cleanup from "rollup-plugin-cleanup";
import { builtinModules } from "module";

export default {
  input: "./src/index.ts",
  output: [
    { file: pkg.main, format: "cjs", sourcemap: true },
    { file: pkg.module, format: "esm", sourcemap: true },
  ],
  plugins: [
    external(),
    del({ targets: ["dist/*"] }),
    typescript(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
    }),
    cleanup({ comments: "none" }),
  ],
  external: [
    ...builtinModules,
    ...(pkg.dependencies == null ? [] : Object.keys(pkg.dependencies)),
    ...(pkg.devDependencies == null ? [] : Object.keys(pkg.devDependencies)),
    ...(pkg.peerDependencies == null ? [] : Object.keys(pkg.peerDependencies)),
  ],
  treeshake: false, // TODO: figure out why treeshaking disappears code inside try/catch blocks
};
