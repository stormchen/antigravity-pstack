# 構建與代碼淨化

所有的構建劇本都貫徹同一個紀律：**說出你觀察到的事實，讓劇本要求證據**。本章將展示常見構建任務的高效 Prompt，以及在提交前保持代碼庫純粹乾淨的必備習慣。

---

## 1. 構建任務的高效 Prompt 範例

針對不同的任務型態，給予精準的約束：

- **缺陷修復 (Bug fix)**：描述現象，嚴格要求先重現。
  ```text
  /poteto-mode 此指令在重試後會產生兩筆重複記錄。先重現問題，再修復並驗證。
  ```
- **功能擴充 (Feature)**：說明新功能，並鎖定既有行為不可退化。
  ```text
  /poteto-mode 新增 --json 旗標。原有純文字輸出保持 byte-identical。驗證這兩種形式。
  ```
- **代碼重構 (Refactoring)**：在搬動架構前錨定行為。
  ```text
  /poteto-mode 將解析邏輯集中到單一模組，零行為變更。先記錄現行輸出，並證明重構後完全一致。
  ```
- **效能修復 (Perf issue)**：陳述具體測量數據，拒絕憑感覺優化。
  ```text
  /poteto-mode 在此 fixture 下啟動耗時 1.8 秒。進行效能剖析（trace），修復測量出的瓶頸，並依 benchmark-checklist 出示優化前後對比。
  ```

劇本會自動補足你沒打出來的關鍵防線：修復前必先重現、實作前鎖定資料結構、重構前固化行為特徵、優化前測量瓶頸並依序套用 7 大效能口訣。

---

## 2. 測試先行：`/tdd` 測試驅動

當缺陷存在明確、低成本的本機測試路徑時，你的指令甚至只需兩個詞：

```text
/tdd implement
```

[`tdd`](../../.agents/skills/tdd/SKILL.md) 會撰寫因預期原因而失敗的最小測試案例，完成修復，然後重新跑通測試（嚴格遵循 **Test Behavior, Not Implementation** 原則）。若編寫測試需要龐大的 Mock 或脆弱的外部環境，它會誠實說明並改採最接近真實執行的檢驗指令——絕不在真實指令更具說服力時強行偽造 Mock。

---

## 3. TypeScript 規範自動載入

[`typescript-best-practices`](../../.agents/skills/typescript-best-practices/SKILL.md) 在你的日常操作中不需要手動輸入指令。當 Agent 讀寫任何 `.ts` 或 `.tsx` 檔案時，該技能會落實核心型別原則：
- 邊界嚴格檢驗（輸入強制使用 `unknown` 與執行期 Schema 解析）。
- 內部純粹強型別，善用辨識聯集（Discriminated Unions）與建構式建模（Constructive Modeling，如 `NonEmpty<T> = [T, ...T[]]`）消除非法狀態。
- Brand 型別強制透過驗證型別守衛（`input is AgentId`）產生，嚴禁使用 `as` 斷言。

---

## 4. 提交前的去贅淨化：`/unslop` 與 `/no-comments`

未經清理的代碼與說明會大幅增加 Code Review 的認知負擔。專案提供兩個專用工具：

### 清除文字贅詞：`/unslop`
PR 描述、Commit 訊息與文件說明容易充斥 AI 常見的空話、矯揉造作的比喻與過度壓縮的符號句。使用 [`unslop`](../../.agents/skills/unslop/SKILL.md) 進行精煉：

```text
/unslop 整理這次的 README 修改，去除贅字，語氣精確客觀。
```

### 清除代碼贅言：`/no-comments`
代碼作者往往會為自己的多餘註解辯護。因此在提交前，派發非原作者的獨立視角來審視註解：

```text
/no-comments 清查這筆 diff 的註解
```

[`no-comments`](../../.agents/skills/no-comments/SKILL.md) 僅保留嚴格白名單內的項目：版權宣告、公開 API 的正式文檔、外部非直覺限制的參考連結。所有「解釋這行代碼在幹嘛」的敘述性註解一律刪除；若註解是在強調「此處千萬不要修改」，它會嘗試將該約束轉化為型別、測試或 Lint 規則，然後**徹底移除該註解**。

> [!IMPORTANT]
> **淨化並非可選的修飾**：充斥著廢話註解與防禦性死代碼的 Diff，是下一個 Bug 滋生的溫床。在建立 PR 前做好清理，是專業工程協作的底線。

---

下一章：[實機驗證、形式驗證與交付流程](./06-verify-and-ship.md)
