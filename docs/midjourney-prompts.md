# Midjourney プロンプト集

アプリで使う画像を Midjourney で作るためのプロンプトです。
作った画像は `public/images/` に、下に書いたファイル名で保存してください。画像を置くと自動で表示され、置かない間は今のグラデーション表示のままです。

> パラメータの `--niji 6` は日本アニメ調のモデルです。新しいバージョンが出ている場合は数字を最新にしてください。

---

## 共通スタイル（全背景の末尾に付ける）

絵のタッチを揃えるため、背景のプロンプトには最後にこれを付けます。

```
hand-painted Japanese anime background art, soft watercolor and gouache texture, muted pastel palette, gentle diffused light, calm and nostalgic atmosphere, no people, no text, no watermark
```

以下のプロンプトでは `[STYLE]` と書いてある部分がこれです。

---

## 1. メイン背景（優先度：高）

ファイル名：`bg-main.png`

```
A quiet stone path leading to a small Japanese shrine at dusk, a red torii gate and stone lanterns, a few cherry blossom trees, distant layered mountains, lavender and indigo sky with soft clouds, open calm space in the center, [STYLE] --ar 16:9 --niji 6
```

- 画面中央には文字のカードが重なるので、中央が落ち着いた絵を選んでください。
- 上に暗いフィルターを重ねて文字を読みやすくしているので、少し明るめの絵でも大丈夫です。

---

## 2. 結果画面のテーマ背景（10種類・優先度：中）

Claude がその人の性格に合うテーマを1つ選び、結果を表示するときに背景がこの絵に切り替わります。

| ファイル名 | テーマ名（画面表示） | 合う人 |
|---|---|---|
| `theme-sakura.png` | Sakura Breeze | やさしい・上品 |
| `theme-ocean.png` | Ocean Calm | 穏やか・自由・海好き |
| `theme-forest.png` | Forest Spirit | 自然・動物好き・やさしい |
| `theme-sunrise.png` | Golden Sunrise | 明るい・元気 |
| `theme-starry-night.png` | Starry Night | 夢見がち・ミステリアス |
| `theme-flame.png` | Festival Flame | 強い・勇敢・スポーツ |
| `theme-moon.png` | Moonlit Garden | 落ち着き・賢い |
| `theme-autumn.png` | Autumn Maple | あたたかい・家族思い |
| `theme-snow.png` | Silent Snow | 純粋・静か |
| `theme-neon.png` | Neon Dream | ゲーム・テック・アニメ好き |

**sakura**
```
A tunnel of blooming cherry blossom trees along a quiet river in spring, petals drifting in the air, soft pink and cream tones, [STYLE] --ar 16:9 --niji 6
```

**ocean**
```
A calm seaside town in Japan at twilight, gentle waves, a small torii gate standing in shallow water, soft blue and teal tones, [STYLE] --ar 16:9 --niji 6
```

**forest**
```
A misty ancient cedar forest with moss-covered stones and soft sunbeams, a small wooden shrine, deep green and jade tones, [STYLE] --ar 16:9 --niji 6
```

**sunrise**
```
Sunrise over Mount Fuji and terraced rice fields, light morning mist, warm gold and peach tones, [STYLE] --ar 16:9 --niji 6
```

**starry-night**
```
A countryside hill under a starry night sky with the Milky Way, a lone tree and fireflies, deep indigo and violet tones, [STYLE] --ar 16:9 --niji 6
```

**flame**
```
A summer festival evening by a river, rows of glowing red paper lanterns, fireworks far in the distance, warm crimson and amber tones, peaceful mood, [STYLE] --ar 16:9 --niji 6
```

**moon**
```
A quiet Japanese garden with a pond under a full moon, a stone bridge, moonlight reflecting on the water, silver and pale blue tones, [STYLE] --ar 16:9 --niji 6
```

**autumn**
```
A valley of red and orange maple trees with a wooden bridge over a stream, leaves gently falling, warm amber tones, [STYLE] --ar 16:9 --niji 6
```

**snow**
```
A small snowy mountain village in the evening, warm glowing windows, gentle snowfall, pale blue and white tones, [STYLE] --ar 16:9 --niji 6
```

**neon**
```
A narrow Tokyo side street at night after rain, soft neon lights with no readable text reflecting on wet pavement, vending machines, cyan and magenta tones, quiet and calm, [STYLE] --ar 16:9 --niji 6
```

---

## 3. 白柴キャラクター（4ポーズ・優先度：高）

### Step A：キャラの基本デザインを決める

まずこれでキャラを作り、気に入った1枚を決めます。

```
Character design of a cute white Shiba Inu mascot, chibi anime style, round fluffy body, cream-white fur, a small vermillion red neck scarf, big friendly eyes, soft cel shading, clean outlines, full body, front view, isolated on a plain white background --ar 1:1 --niji 6
```

### Step B：同じキャラでポーズ違いを作る

Step A で選んだ画像の URL を `--cref` の後ろに入れると、同じ見た目のキャラで作れます。
（Midjourney の新しいバージョンでは、この機能が「Omni Reference（`--oref`）」という名前になっている場合があります）

| ファイル名 | 表示される場所 |
|---|---|
| `shiba-hello.png` | タイトル横（手を振って出迎え） |
| `shiba-thinking.png` | 変換中（考え中） |
| `shiba-stamp.png` | 結果のハンコの横（ハンコを持ってお祝い） |
| `shiba-sad.png` | エラーのとき（しょんぼり） |

**hello**
```
The same white Shiba Inu mascot waving one paw happily, big smile, chibi anime style, full body, isolated on a plain white background --cref [Step AのURL] --ar 1:1 --niji 6
```

**thinking**
```
The same white Shiba Inu mascot holding a calligraphy brush, head tilted, thoughtful expression, chibi anime style, full body, isolated on a plain white background --cref [Step AのURL] --ar 1:1 --niji 6
```

**stamp**
```
The same white Shiba Inu mascot proudly holding up a big red hanko seal stamp with both paws, joyful expression, small sparkles around, chibi anime style, full body, isolated on a plain white background --cref [Step AのURL] --ar 1:1 --niji 6
```

**sad**
```
The same white Shiba Inu mascot sitting with ears down, apologetic expression, a small sweat drop, chibi anime style, full body, isolated on a plain white background --cref [Step AのURL] --ar 1:1 --niji 6
```

> **背景を透明にする作業が必要です。** Midjourney の画像は背景が白いので、背景削除ツール（remove.bg、Canva など）で背景を消して PNG で保存してください。白い背景のままだと、カードの上に白い四角が出てしまいます。

---

## 4. 小道具

**和紙（ハンコの下の紙）**：`washi.png`（優先度：低）

```
Seamless texture of traditional Japanese washi paper, off-white with subtle visible fibers, flat even lighting, top-down view --tile --ar 1:1
```

- `--tile` を付けると、つなぎ目なく並べられる模様になります。背景削除は不要です。

**桜の枝（カード左上の飾り）**：`deco-branch.png`（優先度：低）

```
A single cherry blossom branch with a few pink flowers, anime illustration style, soft pastel colors, isolated on a plain white background --ar 3:2 --niji 6
```

- 枝の根元が左下、花が右上に伸びる向きがきれいに収まります。背景削除が必要です。
