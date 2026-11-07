---
name: statechart
description: "以 TLC 檢驗系統狀態轉移的 TLA+ 模型（如產品流程、通訊協定或後端服務），並將使用者所見行為繪製為 Mermaid 狀態圖 (statechart)，標出違反規則的狀態與最短觸發路徑。適用於 /statechart，或將 Bug 呈現為狀態轉移路徑。"
---

# Statechart (TLA+ 狀態圖視覺化與反例路徑分析)

狀態圖（Statechart）以「閱讀者（如產品經理、設計師或領域負責人）熟悉的白話詞彙」，直觀呈現系統如何在各個狀態之間移動，讓負責定義行為的決策者無須閱讀形式規格，就能一眼判斷系統行為是否正確。

## 1. 執行方式 (Run)

在儲存庫外部的暫存資料夾（如 `scratch/`）中作業。撰寫 TLA+ 規格檔（`.tla`）與配置檔（`.cfg`），接著執行：

```sh
# macOS / Linux / Git Bash
.agents/skills/statechart/scripts/statechart SPEC.tla [--config FILE] [--view FILE] [--out DIR]

# Windows PowerShell / CMD
.agents\skills\statechart\scripts\statechart.cmd SPEC.tla [--config FILE] [--view FILE] [--out DIR]
```

`scripts/statechart.ts` 為 TypeScript 腳本，支援直接以 Node 22.18+ / 23.6+、Bun 1.1.5+ 或 Deno 2.0+ 執行。首次執行時若未設定 `TLA2TOOLS` 與 `JAVA` 環境變數，會透過 `mise` 自動安裝 TLC (`tla2tools.jar`) 與 Java（需網路連線）。

## 2. 撰寫 TLA+ 規格 (Write the spec)

- **將閱讀者認同的每條業務規則寫成 `INVARIANT`**：規則可以針對畫面狀態、計算結果、儲存值或發出的訊息。若模型中缺少表達該規則所需的變數，直接補上該變數。**嚴禁為了讓檢查通過而削弱規則。**
- **將 `Next` 寫成各個具體動作（Actions）的邏輯或（`\/`）**：例如 `YouPressPlay \/ YouPressStop`。若未拆分為獨立動作名稱，TLC 會把每一步都命名為 `Next`。
- **正確處理終止狀態（End States）以避免假性死鎖**：沒有下一步可走的狀態會違反 `NoDeadlock`（即使它是合法的結束狀態；若已有同名 Invariant/Property，則規則名為 `CHECK_DEADLOCK`）。請在 `Next` 中加入一個僅在合法終止狀態為真且不改變任何變數的動作，例如 `Done == phase \in {"paid", "failed"} /\ UNCHANGED vars`，並在 `step()` 中賦予其白話標籤。

## 3. 定義視圖模組與狀態圖呈現 (Pick the chart)

需要工程判斷的核心工作由你負責：每個狀態與箭頭上的白話文字、階段分組與配色、標題、以及最終給閱讀者的報告。將這些映射邏輯寫入一個視圖模組（View Module，如 `view.mjs`），並透過 `--view` 傳入。

視圖模組透過匯出 `state(vars)` 來決定狀態圖的結構型態：
- **回傳字串（String）→ 平面狀態圖（Flat chart）**：`export const state = (v) => (v.paid ? "已付款" : "付款中");`
- **回傳陣列（Array）→ 階層式父子狀態（Parent states）**：`export const state = (v) => v.main.split(".");`
- **回傳物件（Object）→ 平行區域狀態圖（Parallel regions）**：每個 Key 對應一個平行區域，例如 `export const state = (v) => ({ Playback: v.playback, Volume: v.volume });`

**命名與標籤原則**：
- **狀態標籤（`state`）**：使用閱讀者看得到或在乎的白話狀態（如 `"付款中"` 或 `"持有租約，等待寫入"`），嚴禁在標籤中暴露程式碼變數名稱。在 `vars` 中，TLA+ Sequence 會映射為從 `1` 開始編號的物件（故 `v.pc[1]` 即 `pc[1]`），Set 則映射為陣列。
- **轉移箭頭標籤（`step(action, from, to)`）**：接收 TLC 動作名稱與轉移前後的變數狀態，回傳箭頭上的文字。請以使用者視角描述發生的事件（如 `"按下播放"` 或 `"連線失敗"`），不要寫出代碼函式名或 TLA+ Action 名稱。在圖上起訖相同且代表同一使用者體感的兩個動作可回傳相同標籤，合併為單一箭頭。
- **條件標註**：當某一步驟僅在特定條件下發生時，在標籤末尾以方括號附上白話條件，如 `"按下播放 [當檔案載入中]"`。在平行區域圖（Regions chart）中，腳本會自動將其他區域的條件標註在箭頭上（如 `[when Offline]`），若你手動寫上括號會覆蓋自動標註，因此平行區域圖中請勿手動為其他區域寫括號條件。若決定走向的變數未顯示在狀態標籤上，直接將結果寫進步驟標籤（如 `"讀取名單失敗"`）。
- **分組與配色（`group`、`colors`、`title`）**：
  - `group(vars)` 回傳階段名稱；若同一個圖表狀態背後的模型狀態屬於不同分組，該狀態不著色。
  - `colors` 將每個分組名稱映射至主題色（`blue`, `orange`, `purple`, `yellow`, `teal`, `tan`, `pink`）。
  - `title` 為顯示在圖表頂端的標題字串。
- `state()`、`group()` 與 `step()` 必須為純函式（僅依賴傳入參數）。圖表不會繪製停留在同一狀態標籤內的自環步驟；若閱讀者必須看到該步驟，請細分狀態標籤。

**控制圖表複雜度（目標 ≤ 20 條箭頭）**：
過於擁擠的狀態圖難以閱讀。優先從 `state()` 回傳較粗粒度的標籤（將行為相同的數值合併、省略閱讀者不需關心的中間飛行狀態），但**必須完整保留 Bug 路徑上的每個狀態與每個錯誤標記**：
- 切勿將全錯狀態（`breaks`）與正常狀態合併成部分出錯（`mayBreak`），以免掩蓋規則何時必然違反。
- 切勿將違反不同規則的兩個狀態合併。
- 若圖表依然過於擁擠，可讓 `step()` 對閱讀者不需關注的步驟（如每個狀態都有的重設動作）回傳 `null` 予以隱藏，但須遵守四條鐵律：
  1. 確保每個圖表狀態都能從起始狀態沿著箭頭抵達。
  2. 凡是在模型中有出邊的圖表狀態，至少保留一條出邊箭頭。
  3. 同一條箭頭背後的所有步驟要嘛全部隱藏，要嘛全部保留（只藏一部分會導致顯示條件失真）。
  4. 在交付報告中明確交代圖表隱藏了哪些步驟。

## 4. 解讀檢查報告 (Read the report)

- **違規標記**：在狀態圖中，所有背後模型狀態皆違反規則的狀態會標上 `breaks` 樣式；僅部分模型狀態違反規則時則標上 `mayBreak`。圖例（Legend）會列出各標記對應的規則名稱；若同時違反兩條規則，請在交付說明中指出哪個狀態違反哪條規則。
- **探索深度與狀態上限**：TLC 在遇到違規狀態後仍會繼續往下探索，因此圖表能顯示 Bug 發生後的後續狀態。為防止無限狀態模型永不結束，請保持常數（Constants）精簡或加上 `CONSTRAINT`。首次發現違規後，後續重跑每次以 100,000 個相異狀態為上限；未檢查完的規則會列在報告的 `"Rules not checked"` 下。
- **檔案產出**：`tlc.out` 為原始配置的完整 TLC 輸出；`report.md` 包含狀態統計與每條違規規則的最短反例路徑；`chart.mmd` 為產生的 Mermaid 狀態圖（當原始配置狀態數超過 500 個時，`chart.mmd` 僅繪製通往違規規則的路徑；若超過 500 狀態且無規則違規，則僅輸出 `report.md`）。

## 5. 展示狀態圖與交付實機複驗 (Show & Hand off)

1. **直接展示 Mermaid 狀態圖**：將產生的 `chart.mmd` 以 `mermaid` 程式碼區塊呈現給使用者（或在 Artifact 中直接渲染）。若使用者要求輸出 SVG 圖片或圖表過大難以閱讀，可依循 `references/render.md` 使用 `pele` 渲染。
2. **交付決策報告**：向負責決策的人員提供狀態圖與 Mermaid 原始碼，針對每一個發現的 Bug 附上簡明一行摘要：違反的規則名稱、閱讀者定義的規則白話句、以及報告中編號的最短觸發路徑；同時交代模型省略了哪些邊界，並附上可重現該產物的完整指令。
3. **真實代碼重放驗證（Replay against real code）**：當模型描述的是現有代碼時，**必須將每一條 Bug 路徑在真實代碼上逐步重放**（寫成自動化測試或實機重現步驟，一個 Action 對應一步操作）。如果在真實代碼上無法重現該 Bug，請先假定是模型寫錯了，直到你能證明模型無誤為止。
