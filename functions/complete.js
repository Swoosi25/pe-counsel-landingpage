const BACKEND = "https://pe-counsel-waitlist.wild-paper-7d0a.workers.dev";

export async function onRequestPost(context) {
  const { request } = context;
  const res = await fetch(BACKEND + "/complete", {
    method: "POST",
    body: await request.arrayBuffer(),
    headers: {
      "Content-Type": request.headers.get("Content-Type") || "application/x-www-form-urlencoded",
    },
  });
  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "text/html; charset=utf-8",
    },
  });
}