#!/usr/bin/env node
/**
 * 跨平台 Git Worktree 審計與清理評估腳本
 * 用法: node worktree-audit.mjs [repo-path]
 */
import { execSync } from 'node:child_process';
import { statSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const repoPath = resolve(process.argv[2] || process.cwd());

function runGit(cmd, cwd = repoPath) {
  try {
    return execSync(`git ${cmd}`, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

try {
  const root = runGit('rev-parse --show-toplevel');
  if (!root) {
    console.error('錯誤: 目錄不在 git 儲存庫內');
    process.exit(1);
  }
} catch {
  console.error('錯誤: 無法執行 git 指令');
  process.exit(1);
}

const worktreesOutput = runGit('worktree list --porcelain');
if (!worktreesOutput) {
  console.log('未發現任何額外的 worktree。');
  process.exit(0);
}

const worktrees = [];
let current = {};
for (const line of worktreesOutput.split('\n')) {
  if (line.startsWith('worktree ')) {
    if (current.path) worktrees.push(current);
    current = { path: line.replace('worktree ', '').trim() };
  } else if (line.startsWith('HEAD ')) {
    current.head = line.replace('HEAD ', '').trim();
  } else if (line.startsWith('branch ')) {
    current.branch = line.replace('branch refs/heads/', '').trim();
  }
}
if (current.path) worktrees.push(current);

if (worktrees.length <= 1) {
  console.log('僅存在主工作目錄 (Main Worktree)，無多餘 worktree 需要清理。');
  process.exit(0);
}

const mainWt = worktrees[0].path;
const nowSec = Math.floor(Date.now() / 1000);

let prs = [];
try {
  const ghPrs = execSync('gh pr list --author "@me" --state all --limit 1000 --json number,state,headRefName', {
    cwd: repoPath,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'ignore']
  });
  prs = JSON.parse(ghPrs || '[]');
} catch {
  // gh cli 未安裝或無權限，忽略
}

console.log(['SIZE', 'AGE', 'MERGED', 'DIRTY', 'REMOTE', 'PR', 'BUCKET', 'WORKTREE'].join('\t'));

for (let i = 1; i < worktrees.length; i++) {
  const wt = worktrees[i];
  const wtPath = wt.path;

  // 計算大小
  let sizeStr = '?';
  try {
    const stat = statSync(wtPath);
    sizeStr = stat.isDirectory() ? 'DIR' : `${stat.size}B`;
  } catch {}

  // 年齡
  const headTs = parseInt(runGit(`-C "${wtPath}" log -1 --format=%ct HEAD`), 10) || 0;
  const age = headTs > 0 ? `${Math.floor((nowSec - headTs) / 86400)}d` : '?';

  // 是否已合併
  const isMerged = runGit(`merge-base --is-ancestor "${wt.head}" origin/main`);
  const merged = isMerged !== '' ? 'YES' : 'no';

  // 狀態
  const porcelain = runGit(`-C "${wtPath}" status --porcelain`);
  let dirty = 'clean';
  if (porcelain) {
    const lines = porcelain.split('\n').filter(Boolean);
    const untracked = lines.filter(l => l.startsWith('??')).length;
    const tracked = lines.length - untracked;
    if (tracked > 0) dirty = `wip:${tracked}`;
    else dirty = `scratch:${untracked}`;
  }

  // 遠端狀態
  const branch = wt.branch || '';
  let remote = 'no-remote';
  if (!branch) {
    remote = 'detached';
  } else {
    const hasRemote = runGit(`-C "${wtPath}" show-ref --verify --quiet "refs/remotes/origin/${branch}"`);
    if (hasRemote !== '') {
      const originHead = runGit(`-C "${wtPath}" rev-parse "origin/${branch}"`);
      if (originHead === wt.head) remote = 'pushed';
      else {
        const count = runGit(`-C "${wtPath}" rev-list --count "origin/${branch}..HEAD"`);
        remote = `ahead:${count || 0}`;
      }
    }
  }

  // PR 狀態
  let prStr = '-';
  if (branch) {
    const match = prs.find(p => p.headRefName === branch);
    if (match) prStr = `#${match.number}/${match.state}`;
  }

  // 分類建議 (Bucket)
  let bucket = 'review';
  if (dirty.startsWith('wip:')) {
    bucket = 'hold-wip';
  } else if (prStr.includes('OPEN')) {
    bucket = 'hold-open-pr';
  } else if (merged === 'YES' || prStr.includes('MERGED')) {
    bucket = 'safe';
  }

  console.log([sizeStr, age, merged, dirty, remote, prStr, bucket, wtPath].join('\t'));
}
