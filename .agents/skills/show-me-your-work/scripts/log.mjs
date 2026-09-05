#!/usr/bin/env node
/**
 * 跨平台向 show-me-your-work 決策日誌 (TSV) 追加記錄
 * 用法: node log.mjs <logfile> <phase> <decision> <why> <evidence> <result>
 */
import { existsSync, mkdirSync, appendFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const args = process.argv.slice(2);
if (args.length !== 6) {
  console.error('用法: node log.mjs <logfile> <phase> <decision> <why> <evidence> <result>');
  process.exit(1);
}

const [logfile, phase, decision, why, evidence, result] = args;
const logdir = dirname(logfile);
if (logdir && logdir !== '.' && !existsSync(logdir)) {
  mkdirSync(logdir, { recursive: true });
}

if (!existsSync(logfile)) {
  writeFileSync(logfile, 'ts\tphase\tdecision\twhy\tevidence\tresult\n', 'utf8');
}

const ts = new Date().toISOString();

function clean(val) {
  const v = String(val || '').replace(/[\t\n\r]/g, '   ');
  if (/^[=+\-@]/.test(v)) {
    return `'${v}`;
  }
  return v;
}

const line = `${ts}\t${clean(phase)}\t${clean(decision)}\t${clean(why)}\t${clean(evidence)}\t${clean(result)}\n`;
appendFileSync(logfile, line, 'utf8');
