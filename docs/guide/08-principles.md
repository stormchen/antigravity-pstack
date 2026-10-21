# 核心工程守則架構

在移植至 Antigravity 原生架構的過程中，我們將原有的 24 個零散原則目錄進行了提煉與淬火，匯聚為高密度的權威規範文件：[`.agents/rules/engineering-principles.md`](../../.agents/rules/engineering-principles.md)，並透過專案根目錄的 [`AGENTS.md`](../../AGENTS.md) 實現每次對話的全程常駐約束。

你不需要繁瑣地重新定義規則，只需直接引用**原則名稱**，就能以一句話精確校正 Agent 的執行方向。

---

## 1. 原則即時糾偏實例

當 Agent 即將在三個舊介面之上再疊加第四層適配器時：
```text
落實 Subtract Before You Add（先做減法再做加法）。先刪除過期的舊適配器，再重新設計剩餘邊界。
```

當 Agent 僅憑 Build 通過就宣稱功能已完成時：
```text
遵守 Prove It Works（真機驗證）。執行真實的資料寫入流程，並出示資料庫內的實際記錄。
```

當 Agent 修了兩次同一個地方卻依然在同一個測試關卡失敗時：
```text
套用 Attack the Premise（質疑前提）。先把這兩次失敗修復背後共同假設的前提寫下來，直接測試該前提是否成立。
```

當 Agent 報告某項改動讓速度提升了 5 倍卻沒交代原因時：
```text
遵守 Explain the Number（解釋數字背後意義）。追問為什麼不是兩倍快，找出當前的限制因子並排除快取或空操作假象。
```

每一句原則呼叫都對應著清晰的底層契約。Agent 在回覆時必須指名**該原則改變了哪一項實體決策**，防範空泛點名。

---

## 2. 精煉後的 24 項工程守則概覽

完整的詳細定義請直接查閱 [`.agents/rules/engineering-principles.md`](../../.agents/rules/engineering-principles.md)，核心分組如下：

### A. 核心實作守則 (Core Implementation)
- **Laziness Protocol**：偏向刪除而非新增，追求能解決問題的最小代碼變更。
- **Subtract Before You Add**：在擴充前先清理既有壞味道與死代碼。
- **Minimize Reader Load**：扁平化調用鏈，隱藏細節但介面深厚，降低閱讀者心智負擔。
- **Foundational Thinking**：在編寫業務邏輯之前，優先鎖定核心資料結構與模型。
- **Redesign from First Principles**：融入新需求時，視為系統自第一天起就有的設計，而非打補丁。
- **Outcome-Oriented Execution**：以最終架構目標為導向，拒絕長期維護過渡相容垃圾。
- **Experience First**：以使用者與呼叫端的體驗為最高優先，而非實現者的便利。
- **Exhaust the Design Space**：缺乏先例時，主動設計 2~3 個原型對比探索。
- **Build the Lever**：將驗證或重複性工作編寫為可複用的自動化腳本。

### B. 架構與邊界守則 (Architecture & Boundary)
- **Model the Domain**：將領域規則集中在核心結構，而非散落於各處條件判斷。
- **Boundary Discipline**：在系統對外邊界嚴格驗證，內部深處維持純粹強型別信任。
- **Type System Discipline**：善用型別系統，讓非法狀態在編譯期無法表達。
- **Make Operations Idempotent**：讓操作具備冪等性，重試收斂至相同穩定狀態。
- **Migrate Callers Then Delete Legacy APIs**：呼叫端遷移完畢後，在同一次變更中乾淨刪除舊 API。
- **Separate Before Serializing Shared State**：在引入同步鎖之前，優先將狀態拆分以消除共享。

### C. 驗證與修復守則 (Verification & Fixes)
- **Prove It Works**：以真實產物的客觀運行結果為準，拒絕以「能編譯」作為驗證。
- **Fix Root Causes**：動手前必先重現並追查根因，拒絕症狀補丁；深度挖掘後主動提議低成本常駐防護訊號。
- **Attack the Premise**：當兩個以上基於相同前提的修復接連失敗時，先寫下並直接測試該前提假設本身。
- **Explain the Number**：採信數據前先追問「為什麼不是兩倍好？」，指認限制因子並排除假性加速。
- **Test Behavior, Not Implementation**：只斷言呼叫方或使用者可觀察的外部行為，確保內部重構不弄壞測試、外部行為破壞必被捕獲。
- **Sequence Work into Verifiable Units**：將大任務拆解為獨立可驗證的小單元，步步為營。

### D. 調度與流程守則 (Delegation & Meta)
- **Guard the Context Window**：重度搜尋與大量檔案檢索委派 Subagent，維持主線清晰。
- **Never Block on the Human**：面對可逆操作時主動推進，攜帶驗證結果等待審核。
- **Encode Lessons in Structure**：重複犯錯兩次以上的教訓，立即固化為 Lint 規則、測試或自動化腳本。

---

下一章：[自訂你的工作模式與結構化防呆](./09-make-it-yours.md)
