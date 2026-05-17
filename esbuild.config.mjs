import esbuild from "esbuild";

const prod = process.argv.includes("--prod");

await esbuild.build({
  entryPoints: ["main.ts"],
  bundle: true,
  external: ["obsidian", "electron"],
  format: "cjs",
  target: "es2020",
  platform: "node",
  sourcemap: !prod,
  outfile: "main.js",
  logLevel: "info",
  treeShaking: true,
});