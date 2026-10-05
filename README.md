# smpl.upleb.uk

> Share short audio samples on Nostr.

**Live**: <https://smpl.upleb.uk>

## Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- Tailwind CSS
- [nostr-tools](https://github.com/nbd-wtf/nostr-tools)
- lucide-react

## Nostr

- **Login**: NIP-07 (browser extension) + NIP-55 (Amber callback URI)
- `kind:1063` — NIP-94 file metadata
- `kind:27235` — NIP-98 HTTP auth for uploads

Uploads via nostr.build NIP-96. NIP-05 tagging in upload form. Compact / full sample list views.

## Develop

```bash
npm install
npm run dev
```

## Build + deploy

```bash
./deploy.sh
```

Builds, then rsyncs `dist/` to the webroot. The script names the server by an
SSH host alias (`upleb.uk` in `~/.ssh/config`), which carries the user, port and
key.

Server addresses and the nginx / SSL / DNS notes for the wider deployment live in the local `code_gh/macos-node/CLAUDE.md` (not pushed; this README is the public-facing summary).

---

_Sister repo on the other side: <https://github.com/adjmx/smpl.fizx.uk>_
