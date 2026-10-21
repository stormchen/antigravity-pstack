---
name: create-verification-skill
description: "為專案生成專屬的真實應用驗證技能 (Verification Skill)。自動探索專案啟動、驅動與檢查方式，建立包含功能地圖 (Feature Map) 的驗證腳本與技能定義。"
---

# Create a verification skill (建立專案驗證技能)

任何嚴肅的專案都需要一套可程式化的方式來驅動真實應用並驗證行為：啟動應用、模擬使用者操作特定功能、並捕獲具體證據。本技能為目前專案生成專屬的驗證技能（例如 `.agents/skills/verify-<app>/`），供後續初次接手的 Agent 在無須人工指導下直接執行。

## 1. 探勘代碼庫 (Interview the repo)

從代碼庫中找出以下要素（僅在無法直接觀察時向使用者確認）：
- **互動表面 (Surface)**：使用者實際接觸的介面？Web UI、CLI/TUI、API 服務、或桌面應用？
- **啟動方式 (Run)**：本機如何啟動？（如 `npm run dev`、Makefile、Docker 等），記錄 Port、環境變數、遷移腳本與種子資料。
- **驅動途徑 (Drive)**：如何程式化互動？優先複用既有測試套件（Playwright/Cypress、PTY helpers、curl 端點），其次才選用通用配方。
- **證據捕獲 (Observe)**：截圖、終端輸出、回應內容、日誌、Exit code、DB 狀態。
- **隔離性 (Isolate)**：能否多實例並行執行（獨立 Port、獨立資料目錄）而不互相干擾？若無法隔離，必須在生成的技能中明確禁止雙重驅動同一共享實例，避免污染使用者工作區。

若當前代碼無法建置或啟動，必須先修復（或精確回報原因）再生成技能。

## 2. 生成技能定義檔案

在專案中建立 `.agents/skills/verify-<app>/SKILL.md`（包含標準 Antigravity YAML Frontmatter `name: verify-<app>` 與 `description`，不留任何占位符）：
- **Launch**：啟動應用的精確指令與就緒判斷條件（日誌標記、Port 監聽等）。**「就緒（Ready）」代表應用程式已達實際可操作狀態（Usable）**，包含從空白資料目錄完成資料庫遷移與種子資料載入，而非僅僅是進程存活或 Health check 有回應。
- **Doctor**：唯讀健康檢查指令（確認進程正常、版本正確、連接埠為我們所擁有、Auth 有效）。
- **Drive**：具體的自動化操作配方（使用真實且穩定的 ARIA labels、data attributes、路由或命令，避免脆弱的座標與 Tab 順序）。
- **Evidence**：捕獲證據的標準與存放位置。必須走真實使用者路徑，同時驗證畫面狀態與外部副作用（寫入的檔案、新增的資料列）。若使用 dry-run 模式，須實測確認其真正跳過的範圍。
- **Cleanup**：清理環境與終止進程的指令。**嚴禁依進程名稱通殺（Never kill by process name）**，只終止本次啟動的進程。**Cleanup 僅移除實例與臨時狀態，絕不可刪除驗證證據（Proof artifacts 必須在清理後留存於指定位置）。**
- **Helpers**：技能隨附的任何輔助腳本必須可直接執行，並在技能內文中寫明呼叫範例。

## 3. 建立功能地圖 (Feature Map)

在該技能目錄下的 `features/` 中建立 `README.md` 索引與前 3~5 個核心使用者功能檔案。每個檔案從使用者視角記錄：`Sub-features`、`How to get to it (user POV)`、`Driving it with <harness>` 與 `Gotchas`。若種子資料缺乏某項前置條件導致流程失敗，應如實回報並記錄於 `Gotchas`，嚴禁為了湊綠燈而削弱驗證流程。

## 4. 交付前實機執行驗證

在交付前，親自照著生成的技能完整執行一次端到端流程：Launch -> Doctor -> Drive（至少跑通一項映射功能） -> Evidence -> Cleanup。**清理完成後，確認驗證證據依然完好存在於指定路徑**（若清理腳本把證據一併誤刪即視為失敗）。未曾實機執行過的生成技能只是草稿。

## 5. 銜接維護循環

交付時指引使用者：隨著應用程式演進，可隨時執行 `/maintain-verification-skill` 審核功能地圖漂移並保持驗證技能同步。
