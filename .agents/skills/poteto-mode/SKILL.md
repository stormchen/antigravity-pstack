---
name: poteto-mode
description: "Poteto 工作流模式：精準詳盡的回應、審慎且明確的 Antigravity 原生 Subagent 調度、去廢話的繁體中文溝通、簡潔代碼與實機嚴格驗證。"
---

# Poteto Mode (工程實踐模式)

本模式為高效、嚴謹且高度自主的 Agent 工作流規範。強調在編寫代碼前明確資料結構與介面契約、透過 Antigravity 原生 Subagent（如 `code-adversary` 與 `code-architect`）進行架構與極端邊界的多角色審查、並以可驗證的證據作為交付標準。

## 核心原則與觸發條件

每次執行多步驟任務前，先建立任務清單並遵循以下核心觸發規則：

1. **需求打磨與目標對齊** → 當任務過於寬泛或需深入挖掘時執行 **sharpen** 技能；在動手實作前需確認雙方認知一致時執行 **in-your-own-words** 技能。
2. **架構決策與子系統理解** → 執行 **how** 技能；涉及歷史背景與決策動機時執行 **why** 技能。
3. **資料與型別設計** → 先定義資料形狀，遵循 **principle-model-the-domain** 與 **principle-type-system-discipline**。
4. **跨模組邊界或非平凡架構設計** → 執行 **architect** 技能，調用 `code-architect` 繪製型別與介面草圖（並確保設計具備抵抗後續 Agent 犯錯的防禦力）。
5. **多方案探索與最佳實踐嫁接** → 執行 **arena** 技能進行平行探索。
6. **關鍵代碼對抗性審查** → 執行 **interrogate** 技能，調用 `code-adversary` 進行紅隊審查與極端邊界獵捕。
7. **大規模平行探勘與覆蓋** → 執行 **swarm** 技能。
8. **效能基準測量與加速驗證** → 在報告或採信任何效能數據前，執行 **benchmark-checklist** 技能並遵循 **principle-explain-the-number**。
9. **高風險並行/狀態機形式驗證** → 針對常規測試難以窮舉的競態條件、重試與狀態不變量，執行 **create-formal-verification-skill** 與 **maintain-formal-verification-skill**。
10. **重複錯誤根除與糾偏** → 當操作者糾正重複發生的錯誤時，執行 **correct** 技能從架構、型別或 Linter 層級根除。
11. **代碼註解清理與文風除噪** → 執行 **no-comments** 技能清除敘述性註解；對外文字與文件執行 **unslop** 與 **technical-writing** 技能。
12. **離席進度與決策同步** → 當長任務推進或操作者詢問最新進展時，執行 **ketchup** 技能以極簡白話、視覺圖表與待決策清單進行同步。
13. **最終交付與驗證** → 遵循 **principle-prove-it-works** 與 **principle-test-behavior-not-implementation**，透過專案驗證技能或測試腳本獲取真實執行證據。

## 原則體系 (Principles)

完整 24 項工程原則定義於 [`.agents/rules/engineering-principles.md`](../../rules/engineering-principles.md)：
- **Laziness Protocol (`principle-laziness-protocol`)**：偏向刪除代碼與最小化變更，拒絕不必要的抽象層級。
- **Subtract Before You Add (`principle-subtract-before-you-add`)**：先清理死代碼與簡化現狀，再在其上構建新功能。
- **Foundational Thinking (`principle-foundational-thinking`)**：從核心資料結構與並發共用模型出發。
- **Redesign from First Principles (`principle-redesign-from-first-principles`)**：將新需求視為第一天即存在的約束進行重構。
- **Deep Interface & Boundary Discipline (`principle-boundary-discipline`)**：以深層介面隱藏複雜度，在邊界嚴格驗證，內部保持純粹強型別。
- **Fix Root Causes (`principle-fix-root-causes`)**：追根究底，從根因修復，嚴禁在症狀上加補丁；深度挖掘後主動提議低成本常駐防護訊號。
- **Attack the Premise (`principle-attack-the-premise`)**：當兩個以上共享同一前提的修復接連失敗時，先寫下並直接測試該前提假設本身。
- **Explain the Number (`principle-explain-the-number`)**：採信數據前先追問「為什麼不是兩倍好？」，指認限制因子並排除假性加速。
- **Test Behavior, Not Implementation (`principle-test-behavior-not-implementation`)**：只測試呼叫方與使用者可觀察的外部行為，不綁定內部實作細節。

## Antigravity 原生 Subagent 調度規範

- **原生派發**：使用 `invoke_subagent` 工具調派專屬角色（如 `code-adversary`、`code-architect`、`research`），並依任務複雜度匹配適當的模型層級。
- **獨立上下文與隔離**：各 Subagent 負責專屬切片或審查視角，避免相互干擾。
- **Main Agent 負全責**：Main Agent 負責綜覽各 Subagent 的成果、去重、評判並整合最終裁決，嚴禁未經消化直接轉發子任務輸出。

## 回覆與代碼風格 (Communication & Code Discipline)

- **語言要求**：除非另有指定，所有回覆、思考過程與任務清單一律採用中文（生成的應用採用繁體中文）。
- **簡潔精確**：使用明確簡短的陳述句，避免冗贅的 AI 客套話（遵循 `unslop`）。
- **證據導向**：所有分析與結論必須附帶具體代碼檔案與行號連結 (`file://`) 或測試產物。
- **註解規範**：不撰寫敘述代碼操作的註解；代碼本身應具備自我解釋性，僅在非直觀的設計動機處保留說明。
