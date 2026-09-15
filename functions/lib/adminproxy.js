const BACKEND = "https://pe-counsel-waitlist.wild-paper-7d0a.workers.dev";

const pass = ["cookie", "content-type", "authorization", "user-agent", "accept"];

export async function proxyAdmin(context) {
  const { request } = context;
  const url = new URL(request.url);
  const target = new URL(url.pathname + url.search, BACKEND);
  const headers = {};
  for (const h of pass) {
    const v = request.headers.get(h);
    if (v) headers[h] = v;
  }
  let body;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
  }
  const res = await fetch(target.toString(), {
    method: request.method,
    headers: headers,
    body: body || undefined,
  });
  const out = new Response(await res.text(), {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
      "Cache-Control": "no-store",
    },
  });
  const setCookie = res.headers.get("Set-Cookie");
  if (setCookie) out.headers.append("Set-Cookie", setCookie);
  return out;
}