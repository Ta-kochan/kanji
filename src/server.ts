import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const client = new Anthropic();

app.use(express.json());
app.use(express.static(join(__dirname, "../public")));

interface ConvertRequest {
  name: string;
}

interface ConvertResponse {
  kanji: string;
  reading: string;
  explanation: string;
}

app.post("/api/convert", async (req, res) => {
  const { name } = req.body as ConvertRequest;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    res.status(400).json({ error: "名前を入力してください。" });
    return;
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `英語の名前「${name.trim()}」を日本語の漢字表記に変換してください。

以下のJSON形式で回答してください（他のテキストは不要です）：
{
  "kanji": "漢字表記（例：太郎、花子）",
  "reading": "よみがな（ひらがな）",
  "explanation": "漢字の意味や選択理由の簡単な説明（日本語で2〜3文）"
}

ルール：
- 音の響きが似た漢字を使い、良い意味を持つ字を選んでください
- 名前らしい自然な漢字の組み合わせにしてください
- 複数の候補がある場合は最も一般的・好まれるものを1つ選んでください
- JSONのみ返してください`,
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("APIからの応答が無効です。");
    }

    const rawText = textBlock.text.trim();
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSONの解析に失敗しました。");
    }

    const result = JSON.parse(jsonMatch[0]) as ConvertResponse;

    if (!result.kanji || !result.reading || !result.explanation) {
      throw new Error("応答のフォーマットが正しくありません。");
    }

    res.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "変換に失敗しました。";
    res.status(500).json({ error: message });
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
