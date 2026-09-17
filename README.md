# slides

> **已搬遷**：本 repo 已封存，後續簡報與更新都在私人 repo `BCT-TPE/slide-kit`。

以 [open-slide](https://github.com/1weiho/open-slide) 製作的簡報工作區。每份簡報是 `slides/<id>/index.tsx` 裡的一組 React 頁面，畫布固定 1920 × 1080。

## 線上預覽

| 內容 | 網址 |
| --- | --- |
| 簡報列表 | https://ycc-bct.github.io/slides/ |
| AI 智慧招募自動化 | https://ycc-bct.github.io/slides/s/ai-recruiting |

推送到 `main` 後，GitHub Actions 會自動建置並更新上面的網址。

## 本機開發

```bash
pnpm install
pnpm dev
```

開啟 http://localhost:5173/ 後可以：

- 在右上角 **Design** 即時調整色票、字型與字級，存檔會寫回 `index.tsx` 的 `design` 常數。
- 用 **Inspect** 點選元素留下註解，再請 AI 代理執行 `/apply-comments` 套用。
- 按 **Present** 或 `F` 進入全螢幕，`P` 開啟含講者備註與計時器的簡報者模式。

## 簡報

| 資料夾 | 標題 | 頁數 |
| --- | --- | --- |
| `slides/ai-recruiting` | AI 智慧招募自動化 | 10 |

## PowerPoint 版

給習慣用 PowerPoint 的同事：[`pptx/AI智慧招募自動化.pptx`](pptx/AI智慧招募自動化.pptx)。

- 所有文字、卡片、表格都是原生物件，可以直接點選修改。
- 「常用 › 新增投影片」有四種版面：封面、內容頁、內容頁（含文字區）、結尾。新頁面會自動套用深色背景、標題位置與字型。
- 佈景主題色彩已換成簡報的配色，選顏色時優先用「佈景主題色彩」那一排。
- 中文與英文用微軟正黑體，大數字用 Century Gothic，標籤用 Consolas。這三套字型在裝有 Office 的 Windows 與 Mac 上都有。
- 如果新頁面沒有頁碼，到「插入 › 頁首及頁尾」勾選「投影片編號」。

PPT 版和網頁版是兩份獨立的檔案，改其中一份不會同步到另一份。

重新產生 PPT：

```bash
cd pptx
npm install
npm run build
```

## 目錄

| 路徑 | 用途 |
| --- | --- |
| `slides/<id>/index.tsx` | 簡報本體 |
| `assets/logos/` | 跨簡報共用的 logo，以 `@assets/logos/...` 匯入 |
| `assets/logos/source/` | 客戶提供的原始 logo 檔 |
| `themes/` | 可重複套用的主題說明 |
| `pptx/` | 可編輯的 PowerPoint 版與產生腳本 |
| `legacy/` | 改用 open-slide 前的單檔 HTML 版與 PDF |
| `.agents/skills/` | open-slide 提供給 AI 代理的寫作規範，由 `pnpm sync:skills` 管理 |

## 部署設定

`open-slide.config.ts` 會讀取 `OPEN_SLIDE_BASE` 當作網站路徑。本機預設為 `/`，部署流程設為 `/slides/`。

檢視器使用瀏覽器路由，GitHub Pages 沒有路由改寫，所以部署時會把 `index.html` 複製成 `404.html`，讓直接開啟深層連結也能載入。
