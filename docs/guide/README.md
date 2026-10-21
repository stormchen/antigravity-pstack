# pstack 實戰指南 (Antigravity 原生版)

當你不再微觀管理 Agent，而是專注於**定義目標**與**驗證標準**時，pstack 才能發揮最強戰力。你只需要描述「想要什麼」以及「如何證明已完成」，`/poteto-mode` 便會自動匹配適當的 Playbook 劇本，在需要時精準調度各個 Skill，並提供真實客觀的執行證據。本指南將透過真實 Prompt 協助你建立高效率的協同開發習慣。

---

## 指南目錄

1. [專案環境配置與啟用](./01-setup.md)：了解 Antigravity 標準目錄規範、開箱即用設定與模型繼承。
2. [透過 `/poteto-mode` 路由任務](./02-poteto-mode.md)：給定目標，觀察它是如何自動判定任務類型並套用 Playbook。
3. [變更前深入理解代碼](./03-understand.md)：在動手改動前，善用 `/how`、`/why`、`/teach` 與 `/recall`。
4. [架構設計與多方案競爭](./04-design.md)：在代碼定型前，調用 `/architect`、`/arena`、`/swarm` 與 `/interrogate`。
5. [構建與代碼淨化](./05-build-and-clean.md)：建構劇本、`/tdd` 測試先行、`/unslop` 去除 AI 贅詞與 `/no-comments` 代碼除噪。
6. [實機驗證、形式驗證與交付流程](./06-verify-and-ship.md)：在真實應用上驗證行為、建立 TLA+ 形式驗證、檢驗效能基準 (`/benchmark-checklist`)，並推進 PR 至安全合併。
7. [夜間自主運行、進度同步與決策審計](./07-overnight.md)：無人值守的隔夜協約、離席進度與決策看板 (`/ketchup`)、可審計的決策日誌 (`/show-me-your-work`) 與大型任務編排。
8. [核心工程守則架構](./08-principles.md)：24 項工程原則如何精煉為 Rules，並在任務中即時糾偏。
9. [自訂你的工作模式與結構化防呆](./09-make-it-yours.md)：使用 `/automate-me` 萃取專屬模式、`/correct` 根除重複錯誤、`/reflect` 經驗沉澱與技能盲測。
10. [常用提示範本與常見避坑](./10-recipes-and-pitfalls.md)：含 `/sharpen`、`/in-your-own-words`、`/ketchup` 等高頻實用 Prompts 與最容易踩中的反模式。

建議初次閱讀時依序瀏覽各章節；後續可將各頁面作為獨立查閱的手冊。

---

## 核心心法：一句話掌握協同要訣

用你自己的話，提供 Agent **明確的目標**與**可被檢驗的產出標準**：

```text
/poteto-mode 匯出功能在重試中途發生時會寫入重複的資料行。先進行重現（repro），修復後在 sample 資料上驗證無重複。
```

你不需要主動列舉要使用哪些 Skill 或 Playbook。「先重現」加上「可檢驗的成果」已經具備 `/poteto-mode` 所需的全部路由信號。它會自動匹配「缺陷修復 (Bug fix)」劇本，將步驟拆解至任務清單，並在每一步精準調用相應工具。

---

下一章：[專案環境配置與啟用](./01-setup.md)
