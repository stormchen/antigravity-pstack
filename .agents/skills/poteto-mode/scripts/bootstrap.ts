import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptsDirectory = typeof import.meta.dir === "string" 
  ? import.meta.dir 
  : dirname(fileURLToPath(import.meta.url));

const nodeModulesDirectory = join(scriptsDirectory, "node_modules");
const commanderPackagePath = join(
  nodeModulesDirectory,
  "commander",
  "package.json"
);
const installKeyPath = join(
  nodeModulesDirectory,
  ".poteto-mode-tools-install-key"
);

function currentInstallKey(): string {
  try {
    const pkg = readFileSync(join(scriptsDirectory, "package.json"));
    const lock = existsSync(join(scriptsDirectory, "bun.lock"))
      ? readFileSync(join(scriptsDirectory, "bun.lock"))
      : "";
    return createHash("sha256")
      .update(pkg)
      .update("\0")
      .update(lock)
      .digest("hex");
  } catch {
    return "default-key";
  }
}

export function ensureDependenciesInstalled(): void {
  const installKey = currentInstallKey();
  if (
    existsSync(commanderPackagePath) &&
    existsSync(installKeyPath) &&
    readFileSync(installKeyPath, "utf8").trim() === installKey
  ) {
    return;
  }

  const isBun = typeof (globalThis as any).Bun !== "undefined";
  const cmd = isBun ? "bun" : (process.platform === "win32" ? "npm.cmd" : "npm");
  const args = isBun ? ["install", "--frozen-lockfile"] : ["install"];

  const result = spawnSync(cmd, args, {
    cwd: scriptsDirectory,
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  if (result.status !== 0) {
    // 若安裝不成功但 commander 存在則繼續
    if (!existsSync(commanderPackagePath)) {
      console.warn(`警告: 相依性安裝可能未完全完成 (${cmd} install 退出碼: ${result.status})`);
    }
  }

  try {
    writeFileSync(installKeyPath, `${installKey}\n`);
  } catch {}
}
