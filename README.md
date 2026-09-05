# pstack for Antigravity

> **追求深度而非虛浮產能，以真機驗證驅動工程品質。**  
> 本專案已完全移植並重構為 **Google DeepMind Antigravity 原生架構**，支援跨平台（Windows / macOS / Linux）開箱即用。

---

這一個專案移植由lauren(Poteto) from SpaceXAI 在Cursor 完成的plugin,因為原本Pstack架構非常依賴Cursor,所以將其精煉到Google Antigravity內方便使用.如果對原版Lauren的Pstack有興趣請到Cursor Github找尋.
https://x.com/cursor_ai
https://x.com/SpaceXAI
https://x.com/poteto


## 為什麼需要 pstack？

業界目前普遍感受到：AI 正在製造過多缺乏深度的「垃圾代碼（Slop Code）」。許多工具盲目追求生成行數（Lines of Code, LOC）與表面吞吐量，但如果沒有嚴謹的工程品質把關，只會像是僱用了一支製造技術債的隊伍。

**「想走得快，先走得深（If you want to go fast, go deep first）。」**

pstack 的核心理念：
1. **少即是多**：目標不是最大化代碼行數，而是用最少的抽象、最小的改動解決問題，甚至主動刪除死代碼。
2. **無畏的平行化（Fearless Parallelism）**：當你能夠信任單一 Agent 會深入追查根因並嚴格在真實環境驗證成果時，你才能真正放心地平行派發多個 Subagent 協同攻堅。
3. **原生與多模型協同**：結合 Antigravity 的原生子代理體系，架構設計、紅隊挑刺、程式實作、註解除噪各司其職。

---

## 快速開始 (Get Started)

### 1. 專案開箱即用（隨拷隨用）

在 Antigravity 中，pstack 不需要安裝任何第三方套件或外掛。本專案符合 Antigravity 官方自訂義規範，包含：

```text
專案根目錄/
├── .agents/
│   ├── skills/                  # 22 個核心工作流技能
│   ├── agents/                  # 自訂 Subagents（code-adversary, code-architect）
│   └── rules/                   # 核心工程守則（engineering-principles.md）
├── docs/guide/                  # 完整繁體中文實戰指南（含圖解）
├── AGENTS.md                    # 專案代理規範入口（自動載入）
└── README.md
```

**在其他專案中使用**：只需將 `.agents/` 目錄與 `AGENTS.md` 複製到任何目標專案根目錄，Antigravity 就會自動辨識並完整掛載。

### 2. 閱讀實戰手冊

專案內建了完整的繁體中文版實戰手冊：
- [pstack 繁體中文實戰指南](./docs/guide/README.md)（含 10 篇專題手冊與實例架構圖）

### 3. 發起你的第一個任務

在任何需要嚴謹工程品質的任務中，直接以 `/poteto-mode` 起首：

```text
/poteto-mode 匯出功能在重試中途發生時會寫入重複的資料行。先重現問題，修復後在 sample 資料上驗證無重複。
```

---

## 核心工作流：`/poteto-mode`

[`poteto-mode`](./.agents/skills/poteto-mode/SKILL.md) 是整個體系的調度大腦。它會讀取你的需求，自動從 22 套 Playbooks（劇本）中匹配最適方案，並在執行清單中按部就班調用具體技能。

```text
/poteto-mode 這個 PR 有一個細微缺陷：即使閒置時，畫面滾動每 750ms 都會出現漂移。先重現問題，然後修復並驗證。
```

```text
/poteto-mode 我要去休息了。使用 /goal 持續推進，直到遷移檢查完全通過。記錄 decisions.tsv 供早晨審查。
```

### 內建 22 套 Playbooks 劇本一覽

<details>
<summary>點擊展開完整劇本清單與用途</summary>

| 劇本名稱 (Playbook) | 適用情境 |
|---|---|
| [唯讀調查 (Investigation)](./.agents/skills/poteto-mode/playbooks/investigation.md) | 純粹理解與探索。X 如何運作？當初為何這樣設計？確認邏輯邊界。 |
| [缺陷修復 (Bug fix)](./.agents/skills/poteto-mode/playbooks/bug-fix.md) | 重現缺陷、定位根因，並以真實執行環境數據證明修復。 |
| [效能修復 (Perf issue)](./.agents/skills/poteto-mode/playbooks/perf-issue.md) | 針對實測慢速進行 Profiling，修復瓶頸並比對前後數據。 |
| [指標爬坡 (Hillclimb)](./.agents/skills/poteto-mode/playbooks/hillclimb.md) | 科學化指標調優：凍結測試 Harness，循環嘗試單一假說，每次進步獨立提交。 |
| [運行期鑑識 (Runtime forensics)](./.agents/skills/poteto-mode/playbooks/runtime-forensics.md) | 診斷線上或本機即時症狀（記憶體洩漏、CPU 飆高、畫面閃爍）。 |
| [追蹤檔案鑑識 (Trace forensics)](./.agents/skills/poteto-mode/playbooks/trace-forensics.md) | 分析 Profiling 產物（cpuprofile、trace、heap snapshot 等）。 |
| [新功能擴充 (Feature)](./.agents/skills/poteto-mode/playbooks/feature.md) | 擴充或變更行為，基於明確資料型別草圖構建。 |
| [重構 (Refactoring)](./.agents/skills/poteto-mode/playbooks/refactoring.md) | 結構或架構調整，嚴格保證外部行為零回歸。 |
| [原型驗證 (Prototype)](./.agents/skills/poteto-mode/playbooks/prototype.md) | 拋棄式草圖，以最低成本進行架構決策或消除經驗分歧。 |
| [視覺對齊 (Visual parity)](./.agents/skills/poteto-mode/playbooks/visual-parity.md) | 兩個介面實現之間追求像素級（Pixel-exact）的視覺一致性。 |
| [技能開發 (Authoring a skill)](./.agents/skills/poteto-mode/playbooks/authoring-a-skill.md) | 遵循高標準規範編寫或修改專案 `SKILL.md`。 |
| [技能評估 (Eval)](./.agents/skills/poteto-mode/playbooks/eval.md) | 以雙盲測試檢驗提示詞或技能修改對 Agent 行為的影響。 |
| [PR 監護 (Babysit)](./.agents/skills/poteto-mode/playbooks/babysit.md) | 推進 PR 至 Merge-ready：批次解衝突、澄清與修復 Review 意見、跑通 CI。 |
| [堆疊交付 (Shipping)](./.agents/skills/poteto-mode/playbooks/shipping.md) | 獨立驗證綠燈堆疊，自底向上逐步合併至主幹。 |
| [自主運行 (Autonomous run)](./.agents/skills/poteto-mode/playbooks/autonomous-run.md) | 離席長時運作，具備明確完成條件與逃生脫退機制。 |
| [大型編排 (Orchestrate)](./.agents/skills/poteto-mode/playbooks/orchestrate.md) | 跨日、多層次的大型專案編排，調度子代理艦隊協同。 |
| [全自主飛行 (Autopilot-full)](./.agents/skills/poteto-mode/playbooks/autopilot-full.md) | 自主推進獨立 PR 佇列至合併，嚴格由獨立驗證 Agent 簽核。 |
| [堆疊飛行 (Autopilot-stack)](./.agents/skills/poteto-mode/playbooks/autopilot-stack.md) | 推進多項變更並整理為線性堆疊，留待早晨人工審閱後合併。 |
| [會話接續 (Session pickup)](./.agents/skills/poteto-mode/playbooks/session-pickup.md) | 接手先前 Agent 留下的工作，依循決策日誌繼續，不重做已完成事項。 |
| [安全暫停 (Pause safely)](./.agents/skills/poteto-mode/playbooks/pause-safely.md) | 妥善封存目前狀態與復工點，便於日後無縫復原。 |
| [多階段計劃 (Multi-phase plan)](./.agents/skills/poteto-mode/playbooks/multi-phase-plan.md) | 跨越多個階段或 PR 堆疊的結構化工作計劃。 |
| [工作區清理 (Worktree cleanup)](./.agents/skills/poteto-mode/playbooks/worktree-cleanup.md) | 依合併狀態與未提交修改，安全釋放 Worktree 磁碟空間。 |

</details>

---

## 核心技能庫 (Skills)

本專案經過深度審查與清理，去除了無效與平台綁定模組，保留並最佳化了 22 個核心技能：

| 技能名稱 | 核心職責 | 調用範例 |
|---|---|---|
| [`poteto-mode`](./.agents/skills/poteto-mode/SKILL.md) | 核心總調度大腦，自動匹配劇本並編排執行 | `/poteto-mode <目標與驗證標準>` |
| [`how`](./.agents/skills/how/SKILL.md) | 深入梳理現有代碼執行期流程與關鍵型別，支援架構批判 | `/how 這套快取機制如何運作？` |
| [`why`](./.agents/skills/why/SKILL.md) | 像偵探一樣挖掘 Git 歷史與 Issue，探尋架構背後的原因 | `/why 當初為何設定 5 秒超時？` |
| [`teach`](./.agents/skills/teach/SKILL.md) | 結合 how 與 why，以圖表與直白論點說服你變更的合理性 | `/teach 說服我此 PR 修復了根因` |
| [`recall`](./.agents/skills/recall/SKILL.md) | 快速整理近期對話進度、變更脈絡與待辦事項 | `/recall 整理上週關於 parser 的進展` |
| [`architect`](./.agents/skills/architect/SKILL.md) | 調度架構師子代理設計型別與邊界契約，防範過早寫碼 | `/architect 在動手前先設計匯入介面` |
| [`arena`](./.agents/skills/arena/SKILL.md) | 多方案平行競技場，多個 Agent 獨立實現並交叉打分嫁接 | `/arena 對這段資料結構設計進行競技` |
| [`swarm`](./.agents/skills/swarm/SKILL.md) | 大規模平行派發矩陣工作者，適用於套件覆蓋或賽馬測試 | `/swarm 獨立檢查 packages/ 下所有套件` |
| [`interrogate`](./.agents/skills/interrogate/SKILL.md) | 調度紅隊審查員對變更進行嚴苛挑刺，區分有效漏洞與噪音 | `/interrogate 審查分支，尋找邊界漏洞` |
| [`tdd`](./.agents/skills/tdd/SKILL.md) | 測試驅動開發：編寫最小失敗測試 -> 修復 -> 重新跑通 | `/tdd implement` |
| [`blast-radius`](./.agents/skills/blast-radius/SKILL.md) | 評估小改動的潛在爆炸半徑，並用真實代碼證明安全 | `/blast-radius 評估此改動的連帶影響` |
| [`unslop`](./.agents/skills/unslop/SKILL.md) | 去除 PR 描述、Commit 與文件中的 AI 贅字與空話 | `/unslop 整理這次的更新說明` |
| [`no-comments`](./.agents/skills/no-comments/SKILL.md) | 派發獨立視角清除代碼中的多餘廢話註解，轉化為型別約束 | `/no-comments 淨化此 diff 的註解` |
| [`technical-writing`](./.agents/skills/technical-writing/SKILL.md) | 遵循 Diátaxis 架構與 Google 開發者規範的嚴格技術寫作 | `/technical-writing 審查設計文件` |
| [`create-verification-skill`](./.agents/skills/create-verification-skill/SKILL.md) | 為專案自動探勘並建立專屬的端到端實機驗證技能與地圖 | `/create-verification-skill` |
| [`maintain-verification-skill`](./.agents/skills/maintain-verification-skill/SKILL.md) | 定期審查功能地圖漂移，回報應用回歸缺陷並修復驗證腳本 | `/maintain-verification-skill` |
| [`show-me-your-work`](./.agents/skills/show-me-your-work/SKILL.md) | 記錄可被審計的決策軌跡（`decisions.tsv`），支援隔日審查 | `/show-me-your-work 匯報昨晚決策` |
| [`figure-it-out`](./.agents/skills/figure-it-out/SKILL.md) | 無單一對應時的通用探索劇本，規劃執行階段與假說循環 | `/figure-it-out 解決大型遷移` |
| [`automate-me`](./.agents/skills/automate-me/SKILL.md) | 挖掘你的歷史對話習慣，為你客製專屬的個人工作流模式 | `/automate-me` |
| [`reflect`](./.agents/skills/reflect/SKILL.md) | 會話復盤：分析踩坑經歷並提煉為持久的工程資產與規範 | `/reflect 提煉這次任務的教訓` |
| [`bro`](./.agents/skills/bro/SKILL.md) | 將充滿生硬術語的回覆翻譯為白話大白話 | `/bro` |
| [`typescript-best-practices`](./.agents/skills/typescript-best-practices/SKILL.md) | 碰觸 TS/TSX 檔案時自動載入，規範邊界解析與辨識聯集 | 自動啟動，無須手動輸入 |

---

## 專屬原生 Subagents

在 Antigravity 體系下，專案在 [`.agents/agents/`](./.agents/agents/) 配置了兩位專門角色：

1. **[`code-adversary`](./.agents/agents/code-adversary.md)（紅隊審查員與極端邊界獵人）**：
   - 質疑所有不必要的新增抽象與包裝層級。
   - 尋找 Race Conditions、記憶體洩漏、未處理的邊界例外。
   - 強制落實「先做減法再做加法（Subtract Before You Add）」與「極簡主義（Laziness Protocol）」。
2. **[`code-architect`](./.agents/agents/code-architect.md)（系統架構與介面設計師）**：
   - 規劃強型別 Interface/API 契約，定義深層介面（Deep Interfaces）。
   - 明確劃分模組邊界，確保內部低耦合與對外高內聚。

---

## 核心工程原則 (Principles)

本專案已將原本分散的 21 個原則目錄淬煉為單一權威規範：[`.agents/rules/engineering-principles.md`](./.agents/rules/engineering-principles.md)，並在根目錄 [`AGENTS.md`](./AGENTS.md) 聲明。

每次對話中，你可以隨時以原則名稱直接向 Agent 下達糾偏指令：
- `落實 Subtract Before You Add。先刪除無用代碼再設計新邊界。`
- `遵守 Prove It Works。給我看真實執行產物，不要拿編譯通過充數。`
- `套用 Separate Before Serializing Shared State。以獨立 Worktree 消除共享。`

---

## 跨平台與 Windows 支援

本專案已徹底解除對 Linux/macOS Shell 的硬性綁定：
- **決策記錄器**：提供 `log.mjs` 與 `log.ps1`，相容 Windows PowerShell 與 Node.js。
- **PR 監護**：提供 `watch-pr.cmd` 與跨平台 TypeScript `bootstrap.ts`，原生支援 Windows 命令列環境。
- **Worktree 審計**：全面採用 Node.js 跨平台腳本 `worktree-audit.mjs` 執行空間檢驗。

---

## 授權

MIT License
