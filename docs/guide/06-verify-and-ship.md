# 實機驗證、形式驗證與交付流程

「代碼能通過編譯」絕不等於「功能正確無誤」。核心守則中的 **Prove It Works（真機驗證原則）** 強制 Agent 在回報成功前，必須在真實產物上進行檢驗。而你的職責，是讓產物處於「可被客觀檢驗」的狀態。本章將帶你掌握定義驗證條件、自動產生實機與形式驗證技能、檢驗效能數據，並安全推動 PR 直至合併的完整流程。

![原型飛機在真實測試跑道上飛行，工程師手持碼表計時，機器人錄影並逐項打勾，終端機顯示驗證通過並截獲證據。](./images/verification.jpg)

---

## 1. 在開頭陳述可檢驗的完成條件

在第一個 Prompt 中明確定義什麼叫做「完成」：

```text
/poteto-mode 為此指令加上 json 輸出。原有文字輸出保持 byte-identical，輸出的 JSON 能正確解析，兩者都在 sample 專案上運行確認。回傳真實執行證據。
```

這為 Agent 樹立了三項客觀檢查，而非憑感覺敷衍。當 Agent 回覆時，必須附上**實際執行的命令與終端輸出**。

各類變更的檢驗對應方式：
- **CLI 工具**：執行真實指令並比對 exit code 與 stdout/stderr。
- **UI 介面**：在運行中的應用中實際走過改動流程並截圖。
- **Parser/遷移**：重播已儲存的真實輸入資料。
- **效能改動**：透過 [`benchmark-checklist`](../../.agents/skills/benchmark-checklist/SKILL.md) 檢驗限制因子、調優對等性與多輪交錯中位數，展示改動前後的 Profiling 數據對比。
- **資料庫/儲存**：寫入後立即進行 Read-back 回讀驗證。

若面對一段你不完全放心的局部修改，可調用 [`blast-radius`](../../.agents/skills/blast-radius/SKILL.md)：它會評估潛在的爆炸半徑，並用具體代碼證明關鍵路徑的安全。

---

## 2. 生成專案專屬的實機驗證技能

要讓 Agent 能夠自主驅動應用，專案需要一套標準的操控介面。若專案尚未建立，執行：

```text
/create-verification-skill
```

[`create-verification-skill`](../../.agents/skills/create-verification-skill/SKILL.md) 會主動探索專案：
1. 檢測應用如何在本地從空白資料目錄啟動至**實際可操作狀態（Usable）**與健康檢查（Doctor）。
2. 找出驅動方式（優先使用現有測試套件，或透過 HTTP、瀏覽器 CDP、PTY 操控）。
3. 定義何種產物可做為證據（截圖、資料庫查詢、紀錄檔）。
4. 在 `.agents/skills/verify-<app>/` 生成完整的操作手冊與功能地圖（Feature Map）。
5. 在交付前親自跑通一次完整的啟動、驅動與清理流程（並確保清理步驟不會誤刪證據）；若驗證失敗則不予交付。

從此之後，「在應用中驗證此行為」成為任何 Agent 都能在該專案執行的標準步驟。

---

## 3. 維護驗證技能與防範代碼漂移

隨著產品迭代，Feature Map 可能會發生過期或漂移。此時可運行：

```text
/maintain-verification-skill
```

[`maintain-verification-skill`](../../.agents/skills/maintain-verification-skill/SKILL.md) 會平行比對原始碼與功能地圖，並重新驅動各個功能。它僅產出三種明確結果：
- **`clean`**：功能與地圖完全一致，無需更動。
- **`changed`**：地圖或驗證腳本需要更新，產出修復變更。
- **`blocked`**：應用本身出現回歸缺陷。它會**如實回報產品 Bug**，絕不為了讓驗證通過而修改測試標準掩耳盜鈴。

---

## 4. 高風險邏輯的形式驗證 (Formal Verification)

常規測試只能檢查「人想得到的案例」；對於並發競態（Race Conditions）、分散式重試、複雜狀態機或關鍵資料不變量，你可以生成專屬的形式驗證技能：

```text
/create-formal-verification-skill
```

[`create-formal-verification-skill`](../../.agents/skills/create-formal-verification-skill/SKILL.md) 會：
1. 鎖定儲存庫中「出錯代價最高、且一般測試最難觸及」的核心承諾。
2. 依問題性質選配最低成本的驗證工具（事件時序預設首選 **TLA+**，代碼層級選用 SMT 驗證器或自動生成輸入之屬性測試）。
3. 驗證模型在刻意破壞的代碼變體上**確實會報錯並給出反例（Able to fail）**。
4. 留下記錄涵蓋檔案與 Sync Commit 的專案驗證技能。日後當受保護代碼經過多次修改，只需執行 [`/maintain-formal-verification-skill`](../../.agents/skills/maintain-formal-verification-skill/SKILL.md)，即可將模型與最新代碼重新對齊，並嚴格區分「模型漂移」與「真實代碼 Bug」。

---

## 5. 建立清晰的 PR (Opening a PR)

```text
/poteto-mode 開啟 PR。按邏輯拆分為小提交，在描述中附上驗證證據。
```

[開啟 PR 劇本](../../.agents/skills/poteto-mode/playbooks/opening-a-pr.md) 會在獨立 worktree 中將工作 Rebase 為條理分明的小提交、淨化 Diff、以一分鐘簡報格式（`Why` / `What changed` / `Scope` / `Tradeoffs` / `Blast Radius` / `Verification`）撰寫精煉描述，並回傳 PR 連結。5 個職責單一的小 PR 永遠優於 1 個龐大臃腫的 PR。

---

## 6. 自動化監護 PR 直至 Merge-ready (Babysit)

PR 建立後通常需要面對衝突、CI 失敗與 Code Review 意見。你可以放心地交給 [Babysit 劇本](../../.agents/skills/poteto-mode/playbooks/babysit.md)：

```text
/poteto-mode 監護這個 PR，直到全部綠燈。
```

Babysit 使用內建的 PR 監控機制（在 Windows 環境下已全面支援 Node/pwsh 腳本），依序處理阻礙：
1. 優先解掉 Git 衝突。
2. 嚴格審查 Review 評論：真實問題立即修復，雜訊挑剔則在討論串中附上反證進行澄清。
3. 修復 CI 失敗，並將所有修復打包為單次推播，避免反覆觸發 CI 構建排隊。
4. **達到可合併狀態即停步**：它永遠不會擅自執行合併，因為合併權始終保留在人類手中。

---

下一章：[夜間自主運行、進度同步與決策審計](./07-overnight.md)
