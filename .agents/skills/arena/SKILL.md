---
name: arena
description: "多方案並行競技場與最佳方案嫁接。透過 Antigravity 原生 invoke_subagent 調度多個平行 Subagent 獨立產生候選方案，由評審 Subagent 交叉打分，最後由 Main Agent 挑選基準並嫁接優勢特點。"
---

# Arena (多方案競技場)

針對關鍵架構或非平凡代碼，同時派發多個平行 Subagent 獨立嘗試解決同一任務。Main Agent 完整閱讀所有候選方案，挑選出最堅固的方案作為基準 (Base)，並將其他方案中的亮點構想嫁接 (Graft) 進基準中，最後驗證合成產物。

## 執行流程

在開始前建立任務階段清單：
1. 定義規格 (Frame)
2. 平行派發 (Fan out)
3. 交叉評審 (Cross-judge)
4. 挑選基準 (Pick Base)
5. 嫁接精華 (Graft)
6. 驗證產物 (Verify)

## Phase A: 定義規格 (Frame)

所有候選 Subagent 將收到相同的 Prompt，因此規格是契約：
1. 明確說明每個候選者需產出的產物 (Artifact)。
2. 制定評分標準 (Rubric)：將成功標準具體化為 3-6 項可客觀評分的準則（例如：「提供 --dry-run 旗標跳過寫入」）。
3. 分配獨立輸出路徑或 Worktree 工作區（例如獨立分支或工作目錄），避免共用狀態干擾（遵循 **separate-before-serializing-shared-state** 原則）。

## Phase B: 平行派發 (Fan out)

Main Agent 呼叫 `invoke_subagent` 工具，同時派發多個平行候選 Subagent（如由 `code-architect` 擔任架構候選者，或由多個平行 worker 擔任實現候選者）。

每個 Subagent 收到：
- 任務目標與共用背景資訊
- 專屬的輸出目錄或工作區
- 產出產物與簡短設計理由 (Rationale) 的要求：說明考慮過的替代方案與為何否決其他路徑。

## Phase C: 交叉評審 (Cross-judge)

在所有候選方案完成後，Main Agent 呼叫 `invoke_subagent` 派發評審 Subagent（例如調用 `code-adversary` 進行紅隊壓力測試或獨立評審員）：
- 評審員讀取評分標準 (Rubric) 與各候選方案內容。
- 逐項標準打分，指出各方案的優缺點與潛在風險，並推薦基準方案 (Base) 與理由。

## Phase D: 挑選基準 (Pick Base)

Main Agent 完整檢視所有候選方案與評審員的報告：
- 依據評分標準逐項打分，不依賴模糊感覺。
- 對比 Cross-judge 評審員的推薦。若有分歧，深入分析背後原因與權衡。
- 優先挑選維護者最容易擴展且不破壞不變量 (Invariants) 的方案，偏好乾淨的模組邊界與最小表面積（遵循 Laziness Protocol）。

## Phase E: 嫁接精華 (Graft)

再次檢視未被選為基準的方案，識別其中最值得移植的精華點（通常每個方案有 1-2 個優秀想法）：
- 依據 **redesign-from-first-principles** 原則手工將亮點融入基準架構中，避免機械式複製貼上，確保整體概念一致。
- 記錄嫁接了什麼、來自哪個方案、否決了什麼以及否決的原因。

## Phase F: 驗證產物 (Verify)

依據 **prove-it-works** 原則對最終合成的產物進行全面驗證與測試。若驗證發現問題，回到 Phase A 重新校準或回到 Phase E 補足遺漏的優化。

## 輸出成果 (Outputs)

1. 一份合成後的最終產物。
2. 一份簡明合成決策記錄：標明基準方案、嫁接項目與來源、否決項目與理由、以及最終驗證結果。
