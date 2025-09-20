# 🧠 Git Commit Message & Branch 命名風格指南

## ✅ 為什麼要統一命名？

統一的命名風格可以讓團隊合作時：

- 更容易閱讀 Git 歷史
- 更快了解每次修改的目的
- 更有效管理分支與任務追蹤

---

## 🗂️ Branch 命名規則

### 🧱 分支類型前綴

| 前綴       | 用途                           |
|------------|--------------------------------|
| `feature/` | 新功能開發                     |
| `fix/`     | 修復 bug                        |
| `refactor/`| 程式碼重構（不改行為）         |
| `docs/`    | 文件內容修改                   |
| `test/`    | 測試程式相關                   |
| `chore/`   | 雜項、工具、設定檔             |
| `hotfix/`  | 緊急修補用（部署相關）         |

### 📛 命名格式建議

```
<type>/<簡短描述（小寫，dash 分隔）>
```

### 🔧 範例

- `feature/input-box`
- `feature/jump-logic`
- `fix/score-reset`
- `refactor/audio-system`
- `docs/readme-update`
- `test/button-click-handler`
- `chore/update-eslint-config`

---

## 📝 Git Commit Message 規則

### ⛓ 結構格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

---

### 1️⃣ Header（必要）

| 欄位    | 說明                         |
|---------|------------------------------|
| `type`  | 提交類型（請見下方類別表）   |
| `scope` | 影響範圍（模組或檔案名稱）   |
| `subject` | 簡潔描述（50 字內，不加句號）|

#### 🔤 常見 type 類別

| type       | 說明                              |
|------------|-----------------------------------|
| `feat`     | 新功能                             |
| `fix`      | 修 bug                             |
| `docs`     | 文件修改                           |
| `style`    | 排版格式，不影響功能               |
| `refactor` | 重構（不新增功能、修 bug）         |
| `perf`     | 效能優化                           |
| `test`     | 測試相關                           |
| `chore`    | 工具、設定相關                     |
| `revert`   | 撤銷某次 commit                    |

#### 🧾 Header 範例

```
feat(game): add jump mechanic
fix(score): reset score after player dies
refactor(audio): extract BGM logic into module
```

---

### 2️⃣ Body（可選但建議）

詳細說明：
- 做了什麼（What）
- 為什麼做（Why）
- 怎麼做的（How）

可多行，每行不超過 72 字。

---

### 3️⃣ Footer（可選）

- 任務編號：`Closes #123`
- BREAKING CHANGE 說明

#### 🧾 Footer 範例

```
Closes #456
BREAKING CHANGE: score system was redesigned, please reset local data
```

---

## 🧪 Commit 實際範例

```
feat(player): add dash movement

Implemented dash using shift key.
Cooldown logic added to prevent spamming.
Also tweaked animation timing to match speed.

Closes #42
```

---

## ✅ 總結簡表

| 目的     | 分支範例              | Commit 範例                                |
|----------|-----------------------|--------------------------------------------|
| 新增功能 | `feature/attack-system` | `feat(attack): implement basic combo logic` |
| 修 bug   | `fix/hp-display`      | `fix(ui): HP not updating after damage`    |
| 重構     | `refactor/enemy-ai`   | `refactor(ai): simplify decision tree`     |
| 文件更新 | `docs/setup-guide`    | `docs(readme): update installation guide`  |
| 測試     | `test/collision-check`| `test(physics): add collision test`        |
| 工具設定 | `chore/linter`        | `chore(config): update eslint rules`       |
