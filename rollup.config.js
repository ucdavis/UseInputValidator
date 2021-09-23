import babel from "@rollup/plugin-babel";
import external from "rollup-plugin-peer-deps-external";
import del from "rollup-plugin-delete";
import pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";
import cleanup from "rollup-plugin-cleanup";

export default {
  input: "./src/index.ts",
  output: [{ format: "esm", dir: "dist" }],
  plugins: [
    external(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
    }),
    del({ targets: ["dist/*"] }),
    typescript(),
    cleanup({ comments: "none" }),
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};
