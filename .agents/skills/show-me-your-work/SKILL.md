---
name: show-me-your-work
description: "為長時間或多階段任務維護可審查的決策軌跡。以 TSV 記錄決策點、動機、證據與結果，並支援派發獨立 Subagent 進行軌跡交叉審查。"
---

# Show Me Your Work (決策軌跡記錄與審查)

針對需要事後審查的長時間或多階段任務，維護一份標準化的決策軌跡記錄，讓人類或其他協作者能在不重新執行任務或翻閱完整對話的情況下，快速理解各個關鍵決策的動機與依據。

## 格式規範

採用單一 TSV (Tab-Separated Values) 檔案，每行代表一個決策點。
欄位包含：
- **ts**：ISO8601 時間戳記。
- **phase**：階段或工作流名稱。
- **decision**：單行決策內容（做了什麼選擇）。
- **why**：以清晰文字說明決策原因與原則。
- **evidence**：證明依據（Commit SHA、PR 編號、`file:line`、測試產物路徑等）。
- **result**：結果狀態（如 `tests green`、`reverted`、`open`）。

Write each entry the way you'd tell a teammate what you did. Plain words, concrete actions, no AI speak or abstract jargon (the **unslop** skill applies to log text too). A reviewer should understand each row without decoding it.

Use the helper so rows stay well-formed:
- Cross-platform Node.js: `node scripts/log.mjs <logfile> <phase> <decision> <why> <evidence> <result>`
- Windows PowerShell: `pwsh scripts/log.ps1 <logfile> <phase> <decision> <why> <evidence> <result>`
- Linux/macOS Bash: `scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>`

It stamps `ts`, writes the header on first use, strips stray tabs/newlines, and prefixes any cell starting with `=`, `+`, `-`, or `@` with a single quote so a reviewer opening the log in a spreadsheet doesn't trigger formula execution.

## 存放位置

預設存放在工作目錄的 `decisions.tsv` 或 `.audit/<task-slug>.tsv` 作為工作產物。僅在大型重構或重要遷移時才將其納入 Git 提交。

## 審查決策軌跡 (Audit Trail)

在任務交付前，核對決策日誌與實際執行的真實情況：
- 每一行決策必須對應真實發生的操作，不得捏造。
- 證據連結必須能正確解析。
- 修正記錄而非竄改歷史；若方向改變，追加新的決策行。

## 獨立交叉審查 (Cross-Review)

對於重大變更，Main Agent 呼叫 `invoke_subagent` 派發具備獨立視角的審查 Subagent，審核決策記錄：
- 檢查缺乏證據支撐的薄弱決策。
- 檢查是否跳過了必要的驗證步驟。
- 標註存在潛在風險的決策。
- 最終在報告末尾附上「Attention (注意事項)」區塊供使用者檢視。
