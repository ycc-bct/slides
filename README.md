# slides

網頁簡報，固定 16:9 舞台，單一 HTML 檔，除字型外無外部依賴。

## AI 智慧招募自動化

運用 AI 與流程自動化提升招募效率的提案簡報，共 10 頁。

- 線上預覽：https://ycc-bct.github.io/slides/
- 原始檔：[`ai-recruiting-deck.html`](ai-recruiting-deck.html)
- PDF：[`ai-recruiting-deck.pdf`](ai-recruiting-deck.pdf)

### 操作

| 動作 | 方式 |
| --- | --- |
| 翻頁 | 方向鍵、空白鍵、滑鼠滾輪、手機左右滑動 |
| 編輯文字 | 游標移到左上角或按 `E`，點任意文字即可修改 |
| 下載修改後的檔案 | 編輯模式中按 `Ctrl` / `Cmd` + `S` |

### 改樣式

配色與字級集中在 HTML 最上方的 `:root`。`--ai` 與 `--ai-rgb` 是強調色，改這兩個值整份簡報會一起變。

### 重新產生

`ai-recruiting-deck.tpl.html` 是模板，logo 以 `{{BCT}}` 與 `{{INNO}}` 佔位。合成方式：

```bash
python3 -c "
import json, pathlib
logos = json.loads(pathlib.Path('assets/logos.json').read_text())
html = pathlib.Path('ai-recruiting-deck.tpl.html').read_text()
pathlib.Path('ai-recruiting-deck.html').write_text(
    html.replace('{{BCT}}', logos['bct']).replace('{{INNO}}', logos['innodisk_white']))
"
```
