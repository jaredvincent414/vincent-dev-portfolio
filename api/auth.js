// Step 1 of GitHub's OAuth dance: send the editor to GitHub to authorise.
//
// This exists because the OAuth token exchange needs a client secret, and a
// secret cannot live in a static site. It holds no state of its own — the CSRF
// token rides in a short-lived HttpOnly cookie rather than in a session store.

import crypto from "node:crypto";

export default function handler(req, res) {
  const clientId = process.env.CMS_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send("CMS_GITHUB_CLIENT_ID is not set in this environment.");
    return;
  }

  // Bound to the request host so preview deployments authorise against
  // themselves rather than redirecting into production.
  const origin = `https://${req.headers.host}`;
  const state = crypto.randomBytes(16).toString("hex");

  // Read back in /api/callback to prove the response belongs to this request.
  // Lax (not Strict) because the browser arrives here redirected from github.com,
  // and a Strict cookie would not be sent on that navigation.
  res.setHeader(
    "Set-Cookie",
    `cms_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`
  );

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${origin}/api/callback`);
  // `repo` rather than `public_repo`: narrower scopes cannot commit if the
  // repository is ever made private.
  url.searchParams.set("scope", "repo");
  url.searchParams.set("state", state);

  res.redirect(302, url.toString());
}
