# 專案 Agent 開發與審查規範 (AGENTS.md)

本專案遵循 Antigravity 原生架構與 pstack 精煉原則體系。所有 Agent 與 Subagent 在本工作區運作時，必須嚴格遵守以下規範：

## 1. 核心工程守則 (Core Engineering Principles)
完整原則定義請參閱 [`.agents/rules/engineering-principles.md`](.agents/rules/engineering-principles.md)。
- **Laziness Protocol & Subtract Before You Add**：偏向刪除、減少抽象層級，先做減法再做加法。
- **Boundary Discipline & Deep Interface**：邊界嚴格檢驗，內部純粹強型別；以深層介面隱藏複雜度。
- **Prove It Works & Fix Root Causes**：以真實執行證據為準，追查根因，拒絕症狀補丁。
- **Guard the Context Window**：重度搜尋與大量檔案檢索委派 Subagent，保持主線清晰。

## 2. 多角色協作模式 (Subagent Roles)
專案內建專門 Subagents（定義於 `.agents/agents/`）：
- `code-adversary`：紅隊審查員與極端邊界獵人。專門挑選 Race Conditions、記憶體洩漏與邊界例外。
- `code-architect`：系統架構與介面設計師。負責介面契約、型別草圖與模組解耦。
- 調度方式：主 Agent 透過 `invoke_subagent` 派發並主導最終收斂與裁決。

## 3. 語言與溝通標準
- 所有回覆、思考過程及任務清單，一律使用中文（應用產物使用繁體中文）。
- 拒絕空泛客套與陳腔濫調（遵循 `unslop` 原則），專注具體事實、檔案路徑與客觀證據。
