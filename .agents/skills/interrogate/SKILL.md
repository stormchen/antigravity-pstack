---
name: interrogate
description: "對抗性審查與多角度代碼審查。調度 code-adversary 與多個獨立視角 Subagent 挑戰代碼變更，尋找盲點、邊界漏洞與過度設計，最終由 Main Agent 收斂為結構化裁決。"
---

# Interrogate (對抗性審查)

利用 Antigravity 原生 Subagent 機制，調度 `code-adversary` 與多個不同視角的審查 Subagent，對代碼變更進行對抗性審查。每個 Subagent 依據相同的審查標準與 prompt 獨立尋找漏洞與盲點。多個 Subagent 達成共識的問題屬於高信心訊號；單一 Subagent 提出的問題作為重要參考。

最終成果是由 Main Agent 彙整的結構化裁決 (Synthesized Verdict)。請勿直接自動套用修改。

## Step 1: 確定審查範圍 (Determine Scope)

從上下文確認要審查的範圍：
- 如果使用者指定了特定檔案或 diff，直接採用。
- 如果在 feature 分支上，執行 `git diff main...HEAD`（或相應的 base branch）獲取完整變更。
- 如果使用者提及近期的工作，收集相關檔案。

將 diff（或檔案內容）連同必要的周邊上下文一併打包提供給審查 Subagent。

## Step 2: 明確陳述意圖 (State the Intent)

在派發 Subagent 之前，先明確寫下一段話陳述代碼意圖：這段代碼試圖達成什麼目標？從以下來源提煉：
- 使用者的指令
- Commit 訊息與 PR 描述
- 代碼本身的架構與註解

審查員的職責是挑戰「實現方式是否精準且穩健地達成了意圖」，而非挑戰意圖本身。若對意圖有疑問，先與使用者確認。

## Step 3: 調度審查 Subagent (Spawn Reviewers)

Main Agent 呼叫 `invoke_subagent` 工具，同時派發多個審查角色：

1. **核心紅隊審查員 (`code-adversary`)**：
   - 角色：紅隊審查員與極端邊界獵人。
   - 職責：落實 Subtract Before You Add 與 Laziness Protocol，專注於找出 Race Conditions、記憶體洩漏、邊界未處理錯誤與不必要的新抽象。
2. **輔助架構審查員 (`code-architect` 或通用審查員)**：
   - 角色：系統架構與介面設計師。
   - 職責：檢查 Interface/API 契約、模組邊界、型別安全與依賴最小化。
3. **延伸審查視角 (`research` 或獨立視角 subagent)**：
   - 從不同角度（如可測試性、性能、可維護性）獨立檢視。

### 派發 Prompt 構建
填寫 `references/reviewer-prompt.md` 模板，包含：
1. Step 2 所陳述的代碼意圖
2. 代碼 Diff 或完整檔案內容
3. `references/rubric.md` 內的審查標準
4. `references/code-quality-review.md` 內的代碼品質視角

每個 Subagent 產出結構化的審查報告。

## Step 4: 整合與收斂 (Synthesize)

各 Subagent 完成回報後，Main Agent 進行整合：
1. **解析所有回報**：提取各 Subagent 提出的發現。
2. **識別共識 (Consensus)**：被多個 Subagent 獨立提出的問題具備最高信心度。
3. **識別單一意見 (Lone findings)**：仍值得檢視，但依上下文謹慎評估。
4. **去重與合併 (Deduplicate)**：將不同 Subagent 用不同詞彙描述的相同問題進行合併，標註提出的角色。
5. **記錄分歧 (Disagreements)**：若不同 Subagent 對同一設計持相反觀點，納入裁決考量。

## Step 5: 主導裁決 (Lead Judgment)

Main Agent 作為 Pragmatic Senior Engineer 擔任主審，具備全域上下文（目標、限制、時間表、已知的 Tradeoffs）。

依據 `references/lead-judgment.md` 框架將所有問題分類至四個區間：
- **Act on (必須處理)**：實質影響正確性、安全性或可維護性的重大問題，會阻擋 PR 合併。
- **Consider (值得考慮)**：合理的建議，但需評估改善效益是否大於目前投入成本。
- **Noted (記錄參考)**：技術上成立但當前不可行或優先級低（如過早最佳化）。
- **Dismissed (駁回/忽略)**：誤報、缺乏全域上下文或過於吹毛求疵，附上簡短駁回理由。

## 輸出格式 (Output Format)

以繁體中文呈現象徵裁決的結構化報告：

### 意圖說明 (Intent)
> [Step 2 陳述的意圖段落]

### 審查員參與清單 (Reviewers)
- Reviewer `code-adversary`: [發現數量] 項問題
- Reviewer `code-architect`: [發現數量] 項問題
- 其他視角 Reviewer: [發現數量] 項問題

### 必須處理 (Act On)
- [問題描述、提出之 Subagent、為何必須修正]

### 值得考慮 (Consider)
- [問題描述、提出之 Subagent、涉及的權衡]

### 記錄參考 (Noted)
- [有效但低優先級之觀察項目]

### 駁回項目 (Dismissed)
- [被過濾或駁回之項目與具體理由]

### 共識與分歧分析 (Agreement Map)
- [各 Subagent 在何處達成共識，在何處產生分歧，以及此分歧對架構的啟示]
