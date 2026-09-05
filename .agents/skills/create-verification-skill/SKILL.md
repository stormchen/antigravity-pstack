---
name: create-verification-skill
description: "為專案生成專屬的真實應用驗證技能 (Verification Skill)。自動探索專案啟動、驅動與檢查方式，建立包含功能地圖 (Feature Map) 的驗證腳本與技能定義。"
---

# Create a verification skill (建立專案驗證技能)

任何嚴肅的專案都需要一套可程式化的方式來驅動真實應用並驗證行為：啟動應用、模擬使用者操作特定功能、並捕獲具體證據。本技能為目前專案生成專屬的驗證技能（例如 `.agents/skills/verify-<app>/`）。

## 1. 探勘代碼庫 (Interview the repo)

從代碼庫中找出以下要素（僅在無法直接觀察時向使用者確認）：
- **互動表面 (Surface)**：使用者實際接觸的介面？Web UI、CLI/TUI、API 服務、或桌面應用？
- **啟動方式 (Run)**：本機如何啟動？（如 `npm run dev`、Makefile、Docker 等），記錄 Port、環境變數與 Auth。
- **驅動途徑 (Drive)**：如何程式化互動？既有測試套件（Playwright/Cypress）、curl 腳本、PTY 等。
- **證據捕獲 (Observe)**：截圖、終端輸出、回應內容、日誌、DB 狀態。
- **隔離性 (Isolate)**：能否多實例並行執行而不互相干擾。

## 2. 生成技能定義檔案

在專案中建立 `verify-<app>/SKILL.md`（包含標準 Antigravity YAML Frontmatter `name: verify-<app>` 與 `description`）：
- **Launch**：啟動應用的精確指令與就緒判斷條件（日誌標記、Port 監聽等）。
- **Doctor**：唯讀健康檢查指令（確認進程正常、版本正確、連接埠未被佔用）。
- **Drive**：具體的自動化操作配方（精確的 Selector、指令或 API 請求）。
- **Evidence**：捕獲證據的標準與存放位置。
- **Cleanup**：清理環境與終止進程的指令（確保不留下殭屍進程）。

## 3. 建立功能地圖 (Feature Map)

在該技能目錄下的 `features/` 中建立 `README.md` 與主要功能檔案，記錄各功能的存取路徑、驅動方式與驗證標準。

## 4. 實機執行驗證
在交付前，完整執行一次自定義的 Launch -> Doctor -> Drive -> Evidence -> Cleanup 流程，確保腳本可穩定執行。
