---
name: architect
description: "架構設計與介面契約草圖。在編寫代碼前調用 code-architect 設計型別、函式簽名與模組邊界，並可透過 code-adversary 進行抗壓審查，最後由 Main Agent 實現代碼。"
---

# Architect (系統架構設計)

實現之前先設計。先從呼叫端視角 (Caller-First) 繪製型別、函式簽名、類別結構與模組邊界，使用 `not implemented` stub 與虛擬代碼。調用 Antigravity 原生 `code-architect` Subagent 產生架構草圖，並可透過 `code-adversary` 進行邊界與對抗審查，最後由 Main Agent 依據確認的架構填入具體實現。

## 執行流程

1. 建立背景脈絡 (Ground)
2. 架構草圖設計 (Sketch)
3. 確認共識 (Agree)
4. 依約實現 (Implement)
5. 廢棄與重構 (Scrap when wrong)

## Phase A: 建立背景脈絡 (Ground the problem)

建立對新代碼所觸及的所有子系統的真實心智模型：
- 執行 `how` 技能梳理相關子系統的架構與執行流程。
- 若設計涉及重新劃分系統所有權或分層，同時執行 `why` 技能理解現有架構的背景脈絡與約束。

## Phase B: 架構草圖設計 (Sketch)

Main Agent 呼叫 `invoke_subagent` 工具，派發給 `code-architect` Subagent（或搭配 `arena` 機制進行多角度架構探索）：
- 提示詞使用 `references/runner-prompt.md`。
- 每個候選設計產生符合 `references/rationale-template.md` 規範的設計包：優先撰寫呼叫方使用範例，接著導出型別草圖、函式簽名、模組拓撲圖與設計理由。
- 遵循 **exhaust-the-design-space** 原則，要求提供至少兩種不同結構的可能路徑進行比較。
- 對照 `references/design-red-flags.md` 排除淺層模組、資訊洩漏、時間解耦不良、穿透式方法、所有權分裂、同一任務多種做法、內部細節可被外部匯入與手動同步清單。
- **防禦後續 Agent 犯錯**：假設下一位維護者是只看當前開啟檔案、直接複製最近範例、並走最短編譯通過路徑的 AI Agent。優先選擇「從單一檔案看起來正確的寫法，在整個儲存庫中也必然正確」的架構設計。
- 偏好「深層介面 (Deep Interface)」：以最小且乾淨的公開介面隱藏內部複雜度。

可視需要調用 `code-adversary` Subagent 對架構草圖進行對抗性審查（`interrogate`），在寫代碼前預先找出架構死角與競態風險。

## Phase C: 確認共識 (Agree)

- **預設流程**：Main Agent 整合設計後直接進入實現階段。
- **檢查點模式 (Checkpoint)**：若使用者明確要求「/architect with checkpoint」或「設計完先給我看」，則在對話中呈現架構設計草圖並暫停等待使用者確認。

## Phase D: 依約實現 (Implement against the sketch)

以確認的架構草圖作為契約，將 `not implemented` stub 替換為實際邏輯：
- 若實現過程中發現需要偏離草圖（例如缺少參數或型別不符），必須明確檢視是否為需求遺漏或架構設計瑕疵，主動調整而非草率堆疊。

## Phase E: 廢棄與重構 (Scrap when the architecture is wrong)

若實現過程持續出現架構無法吸收的摩擦與壞味道，應果斷廢棄錯誤架構並重構，嚴禁在錯誤的骨架上堆砌補丁（遵循 **redesign-from-first-principles** 與 **fix-root-causes** 原則）：
- 警訊：跨模組重複出現相似的融通代碼、大量非預期的特例分支、型別頻繁使用 `any` 或強制轉型、呼叫方必須了解內部細節才能使用。
- 重構步驟：重新釐清問題脈絡，先做減法 (**subtract-before-you-add**)，回到 Phase B 重新設計。

## 輸出成果 (Outputs)

1. 先寫出呼叫端使用範例，再導出型別與介面定義。
2. 針對小型改動提供單一檔案的型別與函式簽名；針對大型架構提供模組對應圖與介面定義。
3. 附帶設計決策與取捨記錄 (Rationale & Tradeoffs)。
