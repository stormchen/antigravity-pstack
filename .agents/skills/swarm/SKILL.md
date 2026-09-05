---
name: swarm
description: "大規模平行工作者派發與結果彙整。利用 Antigravity 原生 invoke_subagent 調度多個平行 Subagent 進行全域覆蓋、競賽、壓力測試或大規模探勘，由 Main Agent 聚合並產出統一報告。"
---

# Swarm (大規模平行集群)

透過 Antigravity 原生 `invoke_subagent` 工具同時派發 N 個平行 Worker Subagent。各 Worker 可以分別負責獨立的切片 (Slices)、針對同一任務進行平行競賽 (Race)，或兼具兩者。Main Agent 負責等待、聚合結果並產出統一的摘要報告。

## 執行流程

1. 定義規格 (Frame)
2. 平行派發 (Fan out)
3. 聚合結果 (Aggregate)
4. 匯總報告 (Report)

## Phase A: 定義規格 (Frame)

1. 明確宣告完成條件 (Done Predicate) 與 Swarm 必須回傳的產物或報告格式。
2. 決定架構形態：
   - **切片覆蓋 (Partition into slices)**：每個 Worker 負責專屬的模組或功能範圍。
   - **平行競賽 (Race)**：多個 Worker 接收相同需求，比對最快或最佳解法。
   - **混合模式 (Mixed)**：劃分切片並在各切片內進行方案比較。
3. 確定平行數量 N：根據任務複雜度與切割粒度設定。
4. 設定輸出隔離：為每個需要寫入的 Worker 指定獨立的輸出目錄或工作區，避免共用狀態衝突。

## Phase B: 平行派發 (Fan out)

Main Agent 呼叫 `invoke_subagent` 工具，在一次操作中同時派發所有 N 個 Worker Subagent。

每個 Worker 的 Brief 必須自成體系且資訊完整：
- 包含目標、範圍、具體切片或競賽條件。
- 明確指出驗證方式與回報標準（如 `PASS`、`ISSUES` 或 `BLOCKED` 並附上具體證據）。

若某個 Worker 出現異常或中斷，Main Agent 以 N-1 繼續推進並在彙整報告中明確記錄。

## Phase C: 聚合結果 (Aggregate)

讀取所有已完成 Worker 的回傳成果：
- 針對切片覆蓋任務：確認每個必要切片均有明確結論。
- 針對競賽任務：依據事先宣告的規則（如首個通過、全面排名或最佳挑選）篩選結果。
- 提取各 Worker 發現的關鍵問題與證據，避免直接貼上未經整理的原始輸出。

## Phase D: 匯總報告 (Report)

在對話中呈現象徵收斂結果的結構化報告：
- 總覽表格（各 Worker 狀態、切片名稱、結論）。
- 關鍵問題與證據條列。
- 遺漏覆蓋或異常退出說明（如有）。
