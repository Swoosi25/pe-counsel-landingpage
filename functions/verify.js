const BACKEND = "https://pe-counsel-waitlist.wild-paper-7d0a.workers.dev";

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const backend = new URL(url.pathname + url.search, BACKEND);
  const res = await fetch(backend.toString(), {
    method: "GET",
    headers: { "User-Agent": request.headers.get("User-Agent") || "" },
  });
  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "text/html; charset=utf-8",
    },
  });
}