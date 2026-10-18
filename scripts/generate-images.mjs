// Generates every image the app uses with OpenAI's image model and saves
// them into public/images/. Files that already exist are skipped, so you can
// re-run it safely, delete one file to redo just that one, or use --force.
//
//   npm run images                 # make all missing images
//   npm run images -- --only shiba # only names containing "shiba"
//   npm run images -- --force      # redo even if the file exists
//   npm run images -- --list       # just show what would be made
//
// Needs OPENAI_API_KEY in .env. The Shiba poses are made from the first Shiba
// image (shiba-hello.png) so the character looks the same in every pose.

import "dotenv/config";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/images");
const API = "https://api.openai.com/v1/images";
const MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";
const QUALITY = process.env.OPENAI_IMAGE_QUALITY || "medium"; // low | medium | high

const BG_STYLE =
  "Hand-painted Japanese anime film background art, soft watercolor and gouache texture, " +
  "muted pastel palette, gentle diffused light, calm and nostalgic atmosphere. " +
  "No people, no text, no logos, no watermark. Keep the center of the image uncluttered.";

const SHIBA_STYLE =
  "Cute white Shiba Inu mascot, chibi anime style, round fluffy body, cream-white fur, " +
  "a small vermillion red neck scarf, big friendly eyes, soft cel shading, clean outlines, " +
  "full body, centered, fully transparent background, no floor, no shadow.";

const IMAGES = [
  // Backgrounds -------------------------------------------------------------
  bg("bg-main.png",
    "A quiet stone path leading to a small Japanese shrine at dusk, a red torii gate and stone lanterns, " +
    "a few cherry blossom trees, distant layered mountains, lavender and indigo sky with soft clouds."),
  bg("theme-sakura.png",
    "A tunnel of blooming cherry blossom trees along a quiet river in spring, petals drifting in the air, soft pink and cream tones."),
  bg("theme-ocean.png",
    "A calm seaside town in Japan at twilight, gentle waves, a small torii gate standing in shallow water, soft blue and teal tones."),
  bg("theme-forest.png",
    "A misty ancient cedar forest with moss-covered stones and soft sunbeams, a small wooden shrine, deep green and jade tones."),
  bg("theme-sunrise.png",
    "Sunrise over Mount Fuji and terraced rice fields, light morning mist, warm gold and peach tones."),
  bg("theme-starry-night.png",
    "A countryside hill under a starry night sky with the Milky Way, a lone tree and fireflies, deep indigo and violet tones."),
  bg("theme-flame.png",
    "A summer festival evening by a river, rows of glowing red paper lanterns, fireworks far in the distance, warm crimson and amber tones, peaceful mood."),
  bg("theme-moon.png",
    "A quiet Japanese garden with a pond under a full moon, a stone bridge, moonlight reflecting on the water, silver and pale blue tones."),
  bg("theme-autumn.png",
    "A valley of red and orange maple trees with a wooden bridge over a stream, leaves gently falling, warm amber tones."),
  bg("theme-snow.png",
    "A small snowy mountain village in the evening, warm glowing windows, gentle snowfall, pale blue and white tones."),
  bg("theme-neon.png",
    "A narrow Tokyo side street at night after rain, soft neon lights with no readable text reflecting on wet pavement, " +
    "vending machines, cyan and magenta tones, quiet and calm."),

  // Shiba mascot (hello first; the others reference it) ---------------------
  sprite("shiba-hello.png", `${SHIBA_STYLE} Waving one paw happily with a big smile.`),
  sprite("shiba-thinking.png", "Same character: holding a Japanese calligraphy brush, head tilted, thoughtful expression.", "shiba-hello.png"),
  sprite("shiba-stamp.png", "Same character: proudly holding up a big red hanko seal stamp with both paws, joyful, a few small sparkles around.", "shiba-hello.png"),
  sprite("shiba-sad.png", "Same character: sitting with ears down, apologetic expression, a small sweat drop.", "shiba-hello.png"),

  // Props -------------------------------------------------------------------
  {
    file: "washi.png", size: "1024x1024",
    prompt: "Seamless tileable texture of traditional Japanese washi paper, off-white with subtle visible fibers, " +
      "flat even lighting, top-down view, no objects, no text.",
  },
  {
    file: "deco-branch.png", size: "1536x1024", background: "transparent",
    prompt: "A single cherry blossom branch with a few pink flowers, anime illustration style, soft pastel colors, " +
      "the branch starts at the bottom-left and reaches toward the top-right, isolated, fully transparent background.",
  },
];

function bg(file, scene) {
  return { file, size: "1536x1024", prompt: `${scene} ${BG_STYLE}` };
}
function sprite(file, prompt, ref) {
  return { file, size: "1024x1024", background: "transparent", prompt: ref ? `${prompt} ${SHIBA_STYLE}` : prompt, ref };
}

// --------------------------------------------------------------------------

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const jobs = IMAGES.filter((img) => !only || img.file.includes(only));

if (flag("--list")) {
  for (const img of jobs) console.log(`${img.file}  (${img.size}${img.ref ? `, from ${img.ref}` : ""})`);
  process.exit(0);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is not set. Add it to the .env file.");
  process.exit(1);
}

const exists = (p) => access(p).then(() => true, () => false);

async function generate(img) {
  const headers = { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` };
  let res;

  if (img.ref) {
    // Edit endpoint: pass the reference image so the character stays consistent.
    const refPath = join(OUT_DIR, img.ref);
    if (!(await exists(refPath))) throw new Error(`reference ${img.ref} is missing; make it first`);
    const form = new FormData();
    form.append("model", MODEL);
    form.append("prompt", img.prompt);
    form.append("size", img.size);
    form.append("quality", QUALITY);
    if (img.background) form.append("background", img.background);
    form.append("image[]", new Blob([await readFile(refPath)], { type: "image/png" }), img.ref);
    res = await fetch(`${API}/edits`, { method: "POST", headers, body: form });
  } else {
    res = await fetch(`${API}/generations`, {
      method: "POST",
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt: img.prompt,
        size: img.size,
        quality: QUALITY,
        output_format: "png",
        ...(img.background ? { background: img.background } : {}),
      }),
    });
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text.slice(0, 400)}`);
  }
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("no image data in the response");
  return Buffer.from(b64, "base64");
}

await mkdir(OUT_DIR, { recursive: true });
let made = 0, skipped = 0, failed = 0;

for (const img of jobs) {
  const out = join(OUT_DIR, img.file);
  if (!flag("--force") && (await exists(out))) {
    console.log(`skip  ${img.file} (already exists)`);
    skipped++;
    continue;
  }
  process.stdout.write(`make  ${img.file} ... `);
  try {
    const png = await generate(img);
    await writeFile(out, png);
    console.log(`done (${Math.round(png.length / 1024)} KB)`);
    made++;
  } catch (err) {
    console.log(`FAILED\n      ${err.message}`);
    failed++;
  }
}

console.log(`\n${made} made, ${skipped} skipped, ${failed} failed. Images are in public/images/.`);
if (failed) process.exit(1);
