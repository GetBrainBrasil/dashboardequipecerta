// /api/xlsx.ts
export const config = { runtime: "nodejs18.x" };

export default async function handler(req, res) {
  try {
    const url = (req.query.url as string) || "";
    if (!url) return res.status(400).send("Missing ?url=");

    const upstream = await fetch(url, { redirect: "follow" });
    if (!upstream.ok) {
      return res.status(502).send(`Upstream error: ${upstream.status}`);
    }
    const ab = await upstream.arrayBuffer();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(Buffer.from(ab));
  } catch (e:any) {
    res.status(500).send("Proxy error: " + e.message);
  }
}
