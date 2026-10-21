# 自訂你的工作模式與結構化防呆

`poteto-mode` 只是其中一種高效協作風格。底層的 Playbook、動態路由與 Subagent 調度機制，完全能夠換上屬於你個人或團隊的風格。本章將介紹如何自動挖掘個人習慣、根除重複錯誤、沉澱會話經驗、開發專屬技能，並進行嚴謹的技能盲測。

---

## 1. 透過 `/automate-me` 萃取專屬模式

你不需要親自撰寫描述，因為 [`automate-me`](../../.agents/skills/automate-me/SKILL.md) 能直接從你的對話歷史中萃取習慣：

```text
/automate-me
```

它會分析你最近與 Agent 的對話記錄，識別你在回覆風格、委派傾向、驗證嚴格度與程式碼品味上的重複特徵，向你確認核心偏好，接著在 `.agents/skills/<你的名稱>-mode/SKILL.md` 生成專屬模式草案。

當你的工作習慣有所演進時，隨時可進行增量更新：

```text
/automate-me 根據上次編輯以來的歷史，增量更新我的專屬模式技能
```

---

## 2. 透過 `/correct` 從結構上根除重複錯誤

當你發現自己在此儲存庫中反覆糾正 Agent 犯下同類錯誤時，不要只是在對話中罵它或再加一行沒有約束力的文字叮嚀，直接執行：

```text
/correct
```

[`correct`](../../.agents/skills/correct/SKILL.md) 會盤點近期 Commits、Reverts 與規範檔，找出重複發生兩次以上的錯誤類別，並依**由高至低的有效層級**徹底封死錯誤路徑：
1. **架構消除**：讓狀態只有唯一擁有者、任務只有唯一做法、隱藏內部模組使非法匯入無法編譯。
2. **型別與 Linter 強制**：用強型別讓非法狀態寫不出來；或新增報錯訊息直接點名正確替代方案的 Linter。
3. **行為測試**：修正脆弱測試，確保外部行為損壞時必定失敗。
4. **最後才是文件規則**：並在規範檔中維護「規則 ↔ 自動化執行機制」對照表，確保每一項教訓都有真實機制把關。

---

## 3. 透過 `/reflect` 沉澱會話經驗

在一場花費過多時間或遭遇挫折的任務結束後，立即運行：

```text
/reflect 這次任務花費了太多時間。分析我們踩到了什麼坑，沉澱為未來的執行規則。
```

[`reflect`](../../.agents/skills/reflect/SKILL.md) 會派發多個平行審查 Subagent 通讀軌跡，提煉出避免重蹈覆轍的具體建言，並整理為 `Accepted`、`Rejected` 與 `Backlog`。經你批准的項目將轉化為專案 Rules 或技能的精進，讓踩坑經驗成為持久的工程資產。

---

## 4. 開發聚焦的專屬技能 (Authoring a Skill)

當專案需要固化特定業務流程時：

```text
/poteto-mode 撰寫一個在目前專案中驗證資料庫遷移的技能
```

這會匹配 [編寫或修改技能劇本 (Authoring a skill)](../../.agents/skills/poteto-mode/playbooks/authoring-a-skill.md)。面向 Agent 的說明文件標準遠高於普通說明，劇本會自動校驗 YAML frontmatter、路徑連結完整性與反模式檢測。

> [!NOTE]
> 若該技能涉及啟動、驅動與檢驗本機應用，請優先使用專門的 [`create-verification-skill`](../../.agents/skills/create-verification-skill/SKILL.md)；若涉及並發競態或狀態機不變量的數學證明，請使用 [`create-formal-verification-skill`](../../.agents/skills/create-formal-verification-skill/SKILL.md)。

---

## 5. 遵守專業技術寫作規範：`/technical-writing`

對於文件中包含的 RFC、說明文檔或 PR 描述，調用 [`technical-writing`](../../.agents/skills/technical-writing/SKILL.md)：

```text
/technical-writing 審查此 README 的變更
```

它遵循結構化技術寫作標準（Diátaxis 框架、Google 開發者指南風格）：消除歧義、每句只傳達一個清晰概念、釐清主詞動作，使即使疲倦的工程師也能一次讀懂。

---

## 6. 雙盲測試技能變更 (Eval Playbook)

技能檔案的改動會影響未來的每一次會話，因此必須如同科學實驗般進行驗證：

```text
/poteto-mode 對此技能的改動執行 Eval 評估劇本。對兩個版本使用相同任務，保持候選者盲測。
```

[Eval 劇本](../../.agents/skills/poteto-mode/playbooks/eval.md) 針對「觀察者效應」而設計：得知自己在受測的 Agent 行為會出現偏差。因此候選者 Agent 會在隔離目錄中接收看似日常的真實任務（絕不出現 eval 或 candidate 字眼），最後由客觀評審對成果給出評分。

---

下一章：[常用提示範本與常見避坑](./10-recipes-and-pitfalls.md)
