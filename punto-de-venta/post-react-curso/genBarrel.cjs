const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "src");
const barrelFile = path.join(rootDir, "index.js");

// Función recursiva para recolectar archivos .js y .jsx
function collectExports(dir, relativeTo = rootDir) {
  let exports = [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      exports = exports.concat(collectExports(fullPath, relativeTo));
    } else if (/\.(js|jsx)$/.test(entry.name) && entry.name !== "index.js") {
      const relPath =
        "./" +
        path
          .relative(relativeTo, fullPath)
          .replace(/\.(js|jsx)$/, "")
          .replace(/\\/g, "/");
      exports.push(`export * from '${relPath}';`);
    }
  }

  return exports;
}

const allExports = collectExports(rootDir);

fs.writeFileSync(barrelFile, allExports.join("\n") + "\n");
console.log(`✅ Barrel generado en: ${barrelFile}`);
