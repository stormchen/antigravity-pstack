---
name: create-formal-verification-skill
description: "為專案生成專屬的形式驗證技能 (Formal Verification Skill)。針對錯誤代價最高且常規測試最難覆蓋的核心邏輯（並發競態、重試、狀態機、解析器、不變量），選配最適驗證工具（如 TLA+、SMT 或屬性驗證）建立可重跑的驗證技能。適用於 /create-formal-verification-skill。"
---

# Create a Formal Verification Skill (建立專案形式驗證技能)

常規單元測試只能檢查「撰寫者想得到的案例」；形式驗證（Formal Verification）則是在明確定義的範圍內檢查「每一個可能案例」：模型中所有可能的事件交錯順序、邊界內的所有輸入組合、或數學上的所有輸入。本技能負責找出儲存庫中「出錯代價最高、且一般測試最難觸及」的核心區域，驗證其關鍵性質（Property / Invariant），並留下一份專案專屬技能（例如 `.agents/skills/formal-verify-<area>/SKILL.md`），讓後續接手的 Agent 在修改代碼時能一鍵檢驗是否破壞了該性質。使用者無須學習形式驗證語言，即可信任結果並據此行動。

## 1. 從代碼庫鎖定目標 (Choose the target from the code)

直接從代碼庫尋找答案，僅在無法觀察時詢問使用者。若使用者已指定模組或 Bug，直接從該處開始。

優質的驗證目標是**代碼對外做出的核心承諾（Promise / Invariant）**：一旦違反會嚴重損害使用者（如資料遺失、重複扣款、死鎖、狀態機卡死、權限逃逸），且常規測試極難湊出觸發條件的場景。**請選擇儲存庫中最關鍵的目標，而非最容易寫驗證的目標。**

## 2. 讓問題決定工具 (Let the question choose the tool)

選擇能以最低成本回答該問題的驗證工具：模型檢測器（Model Checker）、定理證明器（Proof Assistant）、基於 SMT 的驗證器，或屬性測試工具（Property-based Testing）：
- **事件交錯與時序競態（Concurrency / Retries / State Machines）**：檢驗事件是否會以錯誤順序發生，最適合對設計的小型狀態模型進行模型檢測；跨語言預設首選為 **TLA+（TLC / Apalache）**。
- **代碼層級的所有輸入行為（Memory Safety / Overflow / Data Invariants）**：檢驗代碼本身在各種輸入下是否維持不變量，優先選用能直接作用於該語言源碼的驗證器（如 Kani、CBMC、CrossHair、Dafny、Z3 等）。若該語言無現成代碼驗證器，請明確說明，並改用**對真實代碼注入自動生成輸入（Property-based / Fuzzing，如 fast-check、Hypothesis、proptest）**，切勿手寫一個簡化版假函式來測。
- **任意規模下的數學性質**：若有限邊界（Bound）不足以保證安全，才考慮使用定理證明器。

優先選擇專案開發者能在本地安裝並快速執行的工具，並向使用者說明選型理由。

## 3. 高品質形式驗證的七大標準 (What makes it good)

- **忠於真實代碼 (True to the code)**：模型或證明中的每個部分都必須明確對應到可打開檢視的真實源碼檔案與函式。驗證中視為「不可分割的單一步驟（Atomic Step）」，在真實代碼中也必須是不可分割的單一步驟。命名與儲存庫保持一致。
- **具備失敗能力 (Able to fail)**：一個從未失敗過的檢查證明不了任何事。必須在刻意破壞的代碼變體（例如移除某個鎖、刪除一行條件檢查、或對調兩個步驟）上展示該性質檢查會明確報錯失敗（產生反例 Counterexample）。
- **發現 Bug 就如實回報 (Findings stay findings)**：當現有代碼違反了驗證性質時，用代碼領域的語言連同反例步驟如實回報。**嚴禁為了讓檢查通過而削弱性質或修改模型假設**，且除非使用者要求，否則不要擅自修改產品代碼。
- **誠實交代邊界 (Honest about scope)**：明確說明驗證了什麼、在什麼邊界（Bounds）與假設下成立、以及遺漏了什麼。驗證通過僅代表「在該模型或邊界內成立」，不代表整個系統完美無缺。
- **無須懂工具也能讀懂 (Readable without the tool)**：各用一句大白話說明「被驗證的性質」與「違反時的危害」。將反例翻譯為真實代碼術語的簡短步驟序列。
- **低成本一鍵重跑 (Cheap to rerun)**：單一指令、固定的工具版本，且執行時間短到讓下一個 Agent 願意在每次相關修改後都跑一遍。
- **與代碼保持同步紀錄 (Kept in step with the code)**：在技能中記錄每項檢查涵蓋的檔案與函式清單，以及最後一次確認模型與代碼一致的 **同步 Commit SHA (Sync Commit)**。當受保護的代碼在該 Commit 之後發生變更時，後續 Agent 就能一眼看出模型需要重新審視。

## 4. 生成專屬驗證技能 (Generate the verify skill)

在 `.agents/skills/` 下建立專案專屬技能（含標準 YAML Frontmatter `name` 與 `description`）。光靠這份 `SKILL.md`，下一個初次接手的 Agent 必須能夠：
1. 判斷手頭的代碼變更是否觸及受保護區域。
2. 執行單一指令跑完形式驗證。
3. 區分「真實代碼 Bug」與「模型建構誤差」。
4. 在業務邏輯蓄意變更時，正確更新驗證模型。
5. 將涵蓋範圍與 Sync Commit 寫入技能檔，並規定唯有在確認模型完全反映新版代碼後，才能推進 Sync Commit。全部使用真實指令、真實路徑與專案名詞，不留任何占位符（Placeholders）。

## 5. 交付前實機反證 (Prove it before you hand off)

以接手 Agent 的視角親自照著生成的技能完整跑一遍：在真實代碼或對應模型中做一個會破壞該性質的臨時修改（Scratch Break），**驗證技能必須成功捕獲該破壞並產生反例**；接著還原該臨時修改，確認檢查回到初始狀態（通過，或僅報告你準備提交的既有真實缺陷）。未經實機執行與反證測試的技能只是草稿。

## 6. 交付報告 (Hand off)

向使用者回報：你驗證了什麼性質、選用了哪套工具與原因、驗證邊界與假設、以大白話描述檢查發現的結果、如何執行、以及哪些部分不在涵蓋範圍內。同時指引使用者：日後當受保護代碼經過多次合併或重構後，可呼叫 `/maintain-formal-verification-skill` 將形式驗證模型與最新代碼重新對齊。
