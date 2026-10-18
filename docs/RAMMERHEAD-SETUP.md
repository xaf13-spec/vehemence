# Vehemence Browser setup

The Browser tab is a custom Vehemence interface. It requires a separately hosted Rammerhead service because the Next.js/Vercel app is not a persistent Node.js proxy server.

## Configure the service

1. Deploy your own instance of the MIT-licensed upstream project: https://github.com/binary-person/rammerhead
2. Use the upstream project's configuration guidance to set a strong server password and appropriate session retention settings. Do not expose an unprotected public proxy. This integration creates sessions through Vehemence's server routes, so the request IP differs from the browser's IP; with upstream `restrictSessionToIP: true`, sessions may fail when opened. If you choose to set `restrictSessionToIP: false` in your own instance, understand that session IDs become bearer secrets: keep them private, use HTTPS and a strong server password, and never share a session URL.
3. Add a server-side environment variable to the Vehemence deployment:
   - Name: `RAMMERHEAD_URL`
   - Value: the HTTPS origin of your own Rammerhead service, without a path (for example, `https://browser-service.example.com`)
4. Redeploy Vehemence so the server routes can read the new environment variable.

Do not use a public demo as your personal backend. The server operator may be able to access requests and session data. Keep session IDs private and do not enter sensitive credentials unless you control and trust the service.

## License

Rammerhead is MIT-licensed. If its source is copied or modified, retain the upstream copyright and license notice. The Vehemence Browser UI is a separate integration layer and does not bundle the Rammerhead source code.
