const BACKEND = "https://pe-counsel-waitlist.wild-paper-7d0a.workers.dev";

export async function onRequestPost(context) {
  const { request } = context;
  const res = await fetch(BACKEND + "/", {
    method: "POST",
    body: await request.arrayBuffer(),
    headers: { "Content-Type": "application/json" },
  });
  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}