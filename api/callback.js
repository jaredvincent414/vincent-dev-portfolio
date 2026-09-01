// Step 2: trade the code GitHub sent back for an access token, then hand that
// token to the Decap window that opened this popup.
//
// Decap's handshake is a specific three-step exchange, and it only completes if
// this page follows it exactly:
//   1. this popup posts "authorizing:github" to its opener
//   2. the opener answers, which tells us its origin
//   3. this popup posts the token back to that origin
// Answering with "*" in step 3 would broadcast a repo-scoped token to whatever
// page happened to open us, so the reply goes to the verified origin only.

const readCookie = (header, name) => {
  for (const part of (header || "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
};

// Closes the popup with a message Decap understands as a failure, so a rejected
// login surfaces in the UI instead of hanging on a spinner.
const fail = (res, message) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(400).send(`<!doctype html><meta charset="utf-8"><script>
    window.opener && window.opener.postMessage(
      "authorization:github:error:" + ${JSON.stringify(JSON.stringify({ message }))},
      "*"
    );
    document.write(${JSON.stringify(message)});
  </script>`);
};

export default async function handler(req, res) {
  const clientId = process.env.CMS_GITHUB_CLIENT_ID;
  const clientSecret = process.env.CMS_GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    fail(res, "CMS_GITHUB_CLIENT_ID / CMS_GITHUB_CLIENT_SECRET are not set.");
    return;
  }

  const { code, state } = req.query;
  const expected = readCookie(req.headers.cookie, "cms_oauth_state");

  // Without this check, anyone could feed you a code of their choosing and log
  // your editor into an account that is not yours.
  if (!code || !state || !expected || state !== expected) {
    fail(res, "OAuth state did not match. Start the login again from /admin.");
    return;
  }

  // One use only.
  res.setHeader(
    "Set-Cookie",
    "cms_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0"
  );

  let token;
  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });
    const data = await response.json();
    // GitHub reports failures with 200 and an `error` field, so status is not
    // enough to tell success from failure here.
    if (data.error || !data.access_token) {
      fail(res, `GitHub refused the token exchange: ${data.error_description || data.error || "no token returned"}`);
      return;
    }
    token = data.access_token;
  } catch (error) {
    fail(res, `Could not reach GitHub: ${error.message}`);
    return;
  }

  // JSON.stringify twice: once to build Decap's payload, once to embed that
  // string as a JS literal. `<` is escaped so a token can never close this
  // script tag early.
  const payload = JSON.stringify(
    JSON.stringify({ token, provider: "github" })
  ).replace(/</g, "\\u003c");

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(`<!doctype html>
<meta charset="utf-8" />
<title>Signing in…</title>
<p>Signing in…</p>
<script>
  (function () {
    var payload = ${payload};
    function receive(message) {
      // Step 3 — reply only to the window that answered, at its own origin.
      if (message.source !== window.opener) return;
      window.removeEventListener("message", receive, false);
      window.opener.postMessage(
        "authorization:github:success:" + payload,
        message.origin
      );
      window.close();
    }
    window.addEventListener("message", receive, false);
    // Step 1 — we do not know the opener's origin until it answers.
    window.opener && window.opener.postMessage("authorizing:github", "*");
  })();
</script>`);
}
