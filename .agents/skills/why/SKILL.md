---
name: why
description: "深入探究代碼背後的設計動機、歷史脈絡與權衡決策。平行搜尋版本控制歷史、問題追蹤、設計文件與通訊記錄，由 Main Agent 綜合信心度後回傳具體引證報告。"
---

# Why (代碼動機與歷史脈絡探究)

調查代碼背後的動機與意圖：為何這樣設計？當初考慮了哪些極端邊界？有哪些產品或維運約束塑造了目前的結構？為何否決了其他替代方案？

本技能為 `how` 技能的補充：`how` 回答「代碼做什麼以及如何運作」；`why` 回答「背後的原因與歷史推動力」。

## 運作原則與立場

- **證據先於敘事 (Evidence before narrative)**：先收集事實碎片，再看支持何種推論，嚴禁預設立場。
- **精確引證 (Precision over polish)**：所有結論必須引用具體的 Commit Hash、PR 編號、Ticket ID、文件連結或代碼註解。
- **誠實揭露盲點與空白 (Name the gaps)**：若找不到某些決策的記錄，誠實標明「無法確定」，不以臆測填補。
- **適當標註信心等級 (Hedge on purpose)**：間接證據使用「似乎 (appears to)」、「可能 (likely)」，直接明確證據才使用確定語氣。

## 執行流程

### Step 1. 確認調查目標與問題
解析使用者詢問的核心：設計理念、替代方案權衡、防禦性代碼動機、或死代碼歷史。

### Step 2. 建立代碼錨點 (Code Anchor)
在派發調查前，先從本機環境獲取基礎事實：
- 相關檔案路徑與行號範圍。
- 透過 `git blame`、`git log` 找出最後修改與關鍵 Commits。
- 透過 `gh pr view` 或相關工具獲取 PR 描述與討論。

### Step 3. 平行派發調查 Subagent (Spawn Investigators)
檢視目前環境中可用的 MCP 工具與外部資料來源，分類為以下面向並透過 `invoke_subagent` 平行派發調查：
1. **版本控制歷史 (Source Control)**：Git log、PR 討論、歷史 diff、代碼註解。
2. **問題/工單追蹤 (Issue Tracker)**：相關 Ticket、需求背景與 Bug 回報。
3. **長篇設計文件 (Documents)**：PRD、RFC、架構設計文件、事後復盤 (Postmortem)。
4. **即時通訊與討論 (Chat/Discussions)**：即時討論中沉澱的背景脈絡。
5. **維運監控與錯誤日誌 (Observability & Errors)**：導致加入防禦性代碼的錯誤堆疊或監控警報。

每個調查 Subagent 專注於單一來源，產出帶有精確引證的發現（包括無相關記錄的搜尋結果，無結果也是重要證據）。

### Step 4. 整合與收斂 (Synthesize)
Main Agent 彙整所有調查結果，依據信心框架嚴格區分「已證實的事實」與「合理推論」，產出結構化報告。

## 輸出格式

### 提問核心 (The Question)
簡要重述使用者詢問的核心問題。

### 目標代碼 (The Code in Question)
檔案路徑、行號範圍與關鍵符號。

### 直接事實與證據 (What We Found - Direct Evidence)
包含明確引證（PR #、Commit Hash、文件連結、帶有行號的代碼註解）的事實條列。

### 合理推論 (What We Can Reasonably Infer)
基於間接證據推導的合理結論，明確說明推論鏈並使用謹慎語氣。

### 替代假設與分歧 (Competing Hypotheses)
若證據支持多種可能原因，客觀列出各假設與支持/反對證據。

### 未知與盲點 (What We Don't Know)
明確標註搜尋過但無果的領域與尚無法解答的疑問。

### 檢索來源清單 (Sources Consulted)
條列所有查詢過的來源與結果（例如：`Git log: 查詢 PR #123，發現...`）。
