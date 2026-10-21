# 專案環境配置與啟用

在 Antigravity 中，pstack 體系已經深度原生化。你不需要安裝第三方外掛，也不需要複雜的配置對話。只需確保專案根目錄具備標準結構，就能開箱即用。

---

## 1. 專案目錄結構與隨拷即用

Antigravity 具備自動化的工作區發現機制（Workspace Discovery）。若要在當前專案或任何新專案中啟用 pstack，只需要確保專案根目錄包含以下結構：

```text
目標專案根目錄/
├── .agents/
│   ├── skills/                  # 29 個核心工作流技能（隨選載入）
│   │   ├── architect/
│   │   ├── arena/
│   │   ├── ketchup/
│   │   ├── poteto-mode/
│   │   ├── sharpen/
│   │   ├── tdd/
│   │   └── ...
│   ├── agents/                  # 自訂 Subagents 角色定義
│   │   ├── code-adversary.md    # 紅隊審查員與極端邊界獵人
│   │   └── code-architect.md    # 系統架構與介面設計師
│   └── rules/                   # 24 項核心工程守則
│       └── engineering-principles.md
└── AGENTS.md                    # 專案規範與守則入口（自動載入）
```

只要將這套目錄結構複製到任何專案的根目錄下，Antigravity 開啟該專案後就會自動辨識並完整啟用全部能力。

---

## 2. 模型設定與原生 Subagent 繼承

原版 Cursor 仰賴自訂的外部模型名稱配置；而在 Antigravity 中，Subagent 完全原生整合：

- **模型繼承 (`inherit`)**：預設情況下，所有透過 `invoke_subagent` 啟動的子代理（包括 `code-adversary`、`code-architect` 與背景審查員）都會繼承主對話的當前模型設定。
- **階層模型調度**：在需要輕量搜尋或重度推理時，主 Agent 可依需求調度 `flash`（快速輕量）或 `pro`（深度思考與架構驗證）。

這意味著你不需要手動維護脆弱的模型映射規則或跨廠商 API 金鑰，環境將自動維持一致的智慧水平與上下文。

---

## 3. 生成專屬的應用驗證與形式驗證技能

在首次運行大型任務前，建議為專案建立自動化驗證防線：

### A. 端到端實機驗證技能
若專案缺乏自動化驅動與驗證應用行為的方式，直接執行：

```text
/create-verification-skill
```

[`create-verification-skill`](../../.agents/skills/create-verification-skill/SKILL.md) 會主動探索專案的啟動方式（確保從空白目錄達實際可操作狀態 Usable）、本機服務驅動介面（如 HTTP、CLI、PTY 或瀏覽器）與結果檢驗標準，並在 `.agents/skills/verify-<app>/` 生成專屬驗證技能與功能地圖（Feature Map）。

### B. 關鍵邏輯的形式驗證技能 (Formal Verification)
若專案包含並發競態、重試機制、複雜狀態機或高代價資料不變量，可執行：

```text
/create-formal-verification-skill
```

[`create-formal-verification-skill`](../../.agents/skills/create-formal-verification-skill/SKILL.md) 會鎖定出錯代價最高的核心區域，選配 TLA+、SMT 驗證器或屬性測試工具建立數學級窮舉檢查，留下一鍵可重跑的形式驗證技能。

---

## 4. 運行你的第一個任務

挑選一個實際但規模適中的任務，像向資深同事提需求一樣描述：

```text
/poteto-mode 為此指令新增一個 --json 旗標。原有純文字輸出必須保持 byte-identical。兩者都進行驗證。
```

觀察任務清單（Todo List）的動態展開：
1. 第一步永遠是閱讀並鎖定核心守則（原則約束）。
2. 接續展開與「功能開發 (Feature)」匹配的具體執行步驟。
3. 若 `/poteto-mode` 判定某步驟無需執行，該步驟會標註 `skip: <原因>`，維持透明可查的決策鏈。
4. `/poteto-mode` 具有會話黏性（Sticky），在該對話中會持續保持嚴格驗證風格，直到你切換任務。

---

下一章：[透過 `/poteto-mode` 路由任務](./02-poteto-mode.md)
