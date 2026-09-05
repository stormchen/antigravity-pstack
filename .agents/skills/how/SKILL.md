---
name: how
description: "探索與解釋代碼架構與執行流程。適用於「X 是如何運作的」、變更前的代碼導覽、模組歸屬與分層問題，並支援架構批判模式 (Critique Mode)。"
---

# How (系統架構與流程解析)

深入探索代碼庫以回答「X 是如何運作的？」之問題。產出資深工程師入職等級的高清晰度架構說明，旨在建立準確的心智模型，而非單純貼上帶有註解的原始碼。

支援兩種模式：
1. **Explain (預設解釋模式)**：探索代碼庫並產出清晰的架構說明。
2. **Critique (架構批判模式)**：先完成架構解析，再調度 Subagent 獨立識別架構問題與壞味道。

## Explain 模式

### Step 1. 理解問題與評估複雜度
解析使用者關注的對象：
- 單一模組、函式或狹窄問題（簡單）：直接由 Agent 進行單趟探索與說明（進入 Step 2b）。
- 跨越多個檔案/服務的子系統、全域架構（複雜）：平行派發多個 Explorer Subagent 先行探索（進入 Step 2a）。

### Step 2a. 平行探索 (複雜問題)
將問題拆解為 2-4 個平行的探索切片（例如：資料模型與狀態、請求路徑與執行、配置與監控）。
Main Agent 呼叫 `invoke_subagent` 同時派發 Explorer Subagent：
- 每個 Explorer 負責專屬切片。
- 由入口點追蹤調用鏈、資料流與型別定義，閱讀真實代碼。
- 標註出乎意料或容易誤解之處。

### Step 2b. 直接探索與解釋 (簡單問題)
由 Agent 自身使用搜尋與閱讀工具進行探索，直接產出架構說明。

### Step 3. 整合資訊 (複雜問題)
收集各 Explorer Subagent 的回傳結果，由 Main Agent 消除重複、解決矛盾，織結為統一的全貌。

### Step 4. 產出架構說明
依據以下結構輸出架構說明：
- **總覽 (Overview)**：核心功能與存在原因。
- **關鍵概念 (Key Concepts)**：重要型別、服務與抽象概念。
- **運作機制 (How It Works)**：核心執行流程、觸發點、資料流動路徑與決策點。
- **模組分佈 (Where Things Live)**：關鍵檔案與目錄索引。
- **注意事項 (Gotchas)**：非直觀的設計、歷史背景與潛在邊界。

## Critique 模式 (架構批判模式)

當使用者詢問架構缺陷、潛在問題或重構建議時觸發：
1. **先完成解釋 (Explain First)**：必須先確實理解系統架構。
2. **調度審查 Subagent (Spawn Critics)**：
   Main Agent 呼叫 `invoke_subagent` 派發 `code-architect` 與 `code-adversary`：
   - `code-architect` 專注於審視模組邊界、介面深度、單向依賴與型別嚴謹度。
   - `code-adversary` 專注於尋找並行競態、記憶體洩漏與過度設計。
3. **主導裁決 (Lead Judgment)**：
   Main Agent 結合全域上下文，將發現分類為 **Act on (必須處理)**、**Consider (值得考慮)**、**Noted (記錄參考)**、**Dismissed (駁回)**，附上整合分析後呈現給使用者。
