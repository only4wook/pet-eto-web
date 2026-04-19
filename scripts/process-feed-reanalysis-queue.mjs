const BASE_URL = process.env.REANALYZE_QUEUE_API_URL || "https://www.peteto.kr/api/reanalyze-queue";
const TOKEN = process.env.REANALYZE_QUEUE_TOKEN;

async function main() {
  if (!TOKEN) {
    throw new Error("REANALYZE_QUEUE_TOKEN is required");
  }
  const batchSize = Number(process.argv[2] || "20");
  const loops = Number(process.argv[3] || "1");

  for (let i = 0; i < loops; i++) {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ batchSize }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error || `queue process failed (${res.status})`);
    console.log(`loop ${i + 1}/${loops}:`, json);
    if (!json?.processed) break;
  }
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
