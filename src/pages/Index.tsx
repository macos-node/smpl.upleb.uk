import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, Radio, Upload, Play, Pause, Download, Copy, Check } from 'lucide-react';
import RelayStats from '@/components/RelayStats';

// ── Animated title ──────────────────────────────────────────────
const TITLE_ANIM_CSS = `@keyframes titleLetterIn{from{transform:translateX(-80px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes titleSuffixIn{from{opacity:0}to{opacity:1}}`;
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function lerpRgb(a: [number, number, number], b: [number, number, number], t: number): string {
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}
function AnimatedTitle({ accent, rest = '', from: f, to: t, suffixRgba, fontSize = 'clamp(36px, 7.5vw, 51px)' }: { accent: string; rest?: string; from: string; to: string; suffixRgba: string; fontSize?: string }) {
  const ac = accent.split(''), rc = rest.split('');
  const total = ac.length + rc.length;
  const dur = 350, stagger = total > 1 ? (1200 - dur) / (total - 1) : 0;
  const fromRgb = hexToRgb(f);
  const toRgb = hexToRgb(t);
  const aLen = ac.length;
  return (
    <>
      <style>{TITLE_ANIM_CSS}</style>
      <h1 className="font-bold tracking-tight" style={{ fontSize }}>
        {ac.map((ch, i) => {
          const start = lerpRgb(fromRgb, toRgb, aLen > 0 ? i / aLen : 0);
          const end   = lerpRgb(fromRgb, toRgb, aLen > 0 ? (i + 1) / aLen : 1);
          return (
            <span key={i} className="inline-block"
              style={{ background: `linear-gradient(to right,${start},${end})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: `titleLetterIn ${dur}ms cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${Math.round(i * stagger)}ms` }}
            >{ch === ' ' ? ' ' : ch}</span>
          );
        })}
        {rc.map((ch, i) => (
          <span key={i + ac.length} className="inline-block"
            style={{ color: suffixRgba, animation: `titleSuffixIn 600ms cubic-bezier(0.22,1,0.36,1) both`, animationDelay: `${Math.round((ac.length + i) * stagger)}ms` }}
          >{ch === ' ' ? ' ' : ch}</span>
        ))}
      </h1>
    </>
  );
}

const NstartHand = () => (
  <a href="https://nstart.me/en" target="_blank" rel="noopener noreferrer" className="hover:opacity-75 transition-opacity shrink-0">
    <svg className="h-[92px] w-auto" fill="#fbbf24" viewBox="0 0 210 282">
      <path fillRule="evenodd" clipRule="evenodd" d="M57.143 98.9848C58.6367 95.1177 62.1322 93.1733 65.8719 92.1713C74.9767 89.7317 81.3757 95.1838 85.1202 100.138C87.0353 102.672 88.5381 105.402 89.6797 107.666C90.3271 108.95 90.784 109.916 91.1512 110.693C91.5296 111.493 91.8127 112.092 92.1107 112.628L92.3791 113.112L92.5365 113.642C92.9678 115.095 93.7096 117.176 94.4929 118.735C94.6234 118.994 94.7454 119.22 94.8568 119.411C96.2962 119.978 97.4576 121.196 97.8887 122.805C98.6106 125.499 97.0117 128.268 94.3176 128.99C90.8191 129.928 88.423 127.512 87.7439 126.76C86.7757 125.688 86.0213 124.371 85.4685 123.271C84.4243 121.194 83.5514 118.773 83.0054 117.015C82.6598 116.345 82.2327 115.455 81.797 114.546C81.4081 113.735 81.0122 112.91 80.6612 112.214C79.6317 110.173 78.4453 108.058 77.0622 106.228C74.2102 102.455 71.5767 101.099 68.4861 101.928C67.2891 102.248 66.763 102.551 66.5602 102.706C66.5455 102.953 66.5618 103.751 67.1654 105.569C67.7276 107.262 68.5363 109.136 69.5419 111.467C69.899 112.294 70.281 113.18 70.6855 114.135C72.1619 117.62 73.7875 121.713 75.0216 126.318C75.7971 129.213 76.5206 132.737 77.2684 136.379C77.6581 138.278 78.0544 140.208 78.468 142.098C79.7244 147.838 81.2286 153.692 83.4154 159.022C87.7563 169.603 94.3593 177.289 106.433 178.342L106.529 178.351L106.625 178.363C109.419 178.714 112.697 177.918 115.701 177.112C118.395 176.391 121.165 177.989 121.887 180.684C122.608 183.378 121.01 186.147 118.316 186.869L118.166 186.909C115.421 187.645 110.401 188.991 105.464 188.396C88.154 186.849 79.1418 175.217 74.0708 162.856C71.5471 156.704 69.8952 150.17 68.6012 144.257C68.1109 142.017 67.6816 139.921 67.2802 137.961C66.5822 134.553 65.9686 131.557 65.2653 128.932C64.212 125.001 62.7989 121.412 61.3851 118.074C61.0692 117.329 60.7434 116.574 60.4177 115.82C59.3548 113.359 58.2928 110.9 57.5795 108.751C56.6874 106.064 55.8077 102.442 57.143 98.9848ZM66.4502 102.814C66.4467 102.813 66.46 102.792 66.5009 102.755C66.4742 102.797 66.4537 102.815 66.4502 102.814Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M110.765 100.588C105.447 106.291 101.312 115.759 99.3897 122.479C98.6226 125.16 95.8269 126.712 93.1453 125.945C90.4637 125.178 88.9117 122.383 89.6788 119.701C91.8059 112.265 96.5106 101.065 103.377 93.7002C106.832 89.9939 111.303 86.7601 116.731 86.0659C122.387 85.3426 127.938 87.5088 133.082 92.3049L133.115 92.3362L133.148 92.3681C137.351 96.4319 138.339 102.566 138.148 108.032C137.949 113.717 136.446 119.945 134.287 125.595C132.132 131.235 129.187 136.66 125.845 140.636C124.178 142.619 122.255 144.43 120.101 145.672C117.93 146.924 115.206 147.765 112.252 147.16C109.337 146.564 106.744 145.387 104.783 143.392C102.786 141.361 101.852 138.897 101.552 136.487C101 132.048 102.548 127.175 103.955 123.382C106.452 116.654 109.786 109.569 110.805 107.805C112.2 105.389 115.288 104.562 117.704 105.956C120.119 107.351 120.947 110.439 119.552 112.855C118.921 113.948 115.814 120.46 113.425 126.896C111.989 130.765 111.361 133.516 111.576 135.241C111.659 135.914 111.844 136.167 111.986 136.311C112.162 136.491 112.72 136.941 114.239 137.257C114.319 137.249 114.575 137.199 115.057 136.921C115.849 136.465 116.9 135.58 118.113 134.136C120.532 131.258 122.973 126.908 124.852 121.99C126.726 117.084 127.904 111.973 128.054 107.679C128.21 103.204 127.233 100.723 126.154 99.6553C122.606 96.3623 119.932 95.8391 118.012 96.0847C115.858 96.3602 113.401 97.7603 110.765 100.588Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M148.576 99.5765C147.378 97.8131 145.202 95.6384 142.159 94.4817C138.745 93.1841 134.64 93.342 130.601 96.0088C128.274 97.5456 127.633 100.678 129.17 103.006C130.706 105.333 133.839 105.975 136.167 104.438C136.898 103.955 137.405 103.832 137.696 103.801C137.992 103.769 138.272 103.81 138.57 103.923C139.285 104.195 139.945 104.834 140.233 105.27L140.315 105.394L140.404 105.513C141.425 106.878 142.178 109.533 142.032 113.653C141.891 117.623 140.936 122.239 139.41 126.752C137.884 131.261 135.869 135.427 133.77 138.525C132.722 140.073 131.721 141.252 130.838 142.06C129.92 142.9 129.36 143.128 129.206 143.17C128.698 143.306 128.451 143.278 128.388 143.266C128.367 143.248 128.329 143.21 128.274 143.135C127.88 142.603 127.203 140.925 127.411 137.461C127.578 134.677 125.456 132.285 122.672 132.118C119.888 131.951 117.495 134.072 117.329 136.857C117.058 141.364 117.724 145.861 120.157 149.146C121.436 150.873 123.188 152.225 125.367 152.905C127.514 153.575 129.73 153.486 131.82 152.926C134.105 152.314 136.064 150.968 137.656 149.512C139.282 148.024 140.782 146.184 142.133 144.189C144.835 140.2 147.221 135.181 148.977 129.989C150.733 124.799 151.942 119.195 152.126 114.011C152.302 109.023 151.557 103.642 148.576 99.5765Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M186.841 91.1686C185.772 91.5973 185.168 92.2069 184.973 92.544C183.264 95.5056 179.325 100.324 175.48 104.794C171.507 109.414 167.22 114.13 164.478 117.072C162.576 119.112 159.38 119.224 157.34 117.322C155.3 115.42 155.188 112.224 157.09 110.184C159.763 107.317 163.956 102.703 167.822 98.2078C171.818 93.5623 175.079 89.4804 176.226 87.4938C177.817 84.7382 180.464 82.8432 183.083 81.7933C185.71 80.7403 188.941 80.2834 192.028 81.1664C195.357 82.1186 198.189 84.5703 199.383 88.482C200.486 92.0952 200.034 96.4116 198.408 101.218C192.231 119.477 179.621 133.86 174.895 138.051C173.698 139.112 172.27 141.273 170.323 145.956C168.418 150.541 166.292 156.814 163.351 165.509C160.041 175.292 152.771 183.982 144.169 188.607C135.418 193.311 124.606 194.032 115.772 186.268C113.677 184.427 113.471 181.236 115.312 179.141C117.153 177.046 120.344 176.84 122.439 178.681C127.282 182.937 133.283 182.991 139.386 179.71C145.636 176.35 151.258 169.738 153.783 162.273L153.849 162.079C156.711 153.619 158.943 147.019 160.996 142.08C163.023 137.203 165.165 133.179 168.193 130.494C171.917 127.192 183.347 114.22 188.84 97.9817C190.131 94.1642 189.957 92.1976 189.722 91.4309C189.582 90.972 189.465 90.9385 189.263 90.8808L189.25 90.8772C188.798 90.7479 187.902 90.7432 186.841 91.1686Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M87.4391 172.66C90.1332 171.938 92.9024 173.537 93.6243 176.231C94.4031 179.138 94.2478 183.011 93.9724 186.046C93.6772 189.298 93.1456 192.495 92.737 194.492C92.1778 197.225 89.5094 198.987 86.7768 198.427C84.0443 197.868 82.2825 195.2 82.8416 192.467C83.1876 190.777 83.6573 187.954 83.9133 185.133C84.1891 182.095 84.1349 179.841 83.868 178.845C83.1462 176.151 84.745 173.382 87.4391 172.66Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M137.693 185.612C139.544 187.699 139.352 190.891 137.266 192.742C133.64 195.957 128.811 202.842 126.912 207.176C125.793 209.731 122.814 210.895 120.26 209.775C117.705 208.656 116.541 205.678 117.661 203.123C120.087 197.584 125.741 189.462 130.564 185.184C132.651 183.334 135.843 183.525 137.693 185.612Z"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M143.142 106.629C143.189 103.84 145.487 101.617 148.275 101.663C152.563 101.733 158.532 103.631 162.187 109.36C165.863 115.122 166.352 123.427 162.604 134.507C160.305 141.303 157.71 146.407 154.909 150.066C152.117 153.714 148.909 156.189 145.365 157.139C137.608 159.218 131.981 153.53 130.512 148.048C129.79 145.354 131.389 142.585 134.083 141.863C136.777 141.141 139.546 142.74 140.268 145.434C140.76 147.269 141.972 147.592 142.751 147.383C143.476 147.189 144.96 146.446 146.888 143.927C148.807 141.42 150.959 137.41 153.036 131.27C156.29 121.652 155.029 116.919 153.672 114.793C152.294 112.633 149.948 111.792 148.109 111.762C145.32 111.716 143.096 109.418 143.142 106.629Z"/>
    </svg>
  </a>
);

// ── NIP-07 Nostr login ────────────────────────────────────────────────────────
declare global { interface Window { nostr?: { getPublicKey(): Promise<string>; signEvent(e: object): Promise<object> } } }
function useNostrLogin() {
  const [pubkey, setPubkey] = useState<string | null>(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('nostr_pk');
      if (p) { localStorage.setItem('nostr_pubkey', p); return p; }
      return localStorage.getItem('nostr_pubkey');
    } catch { return null; }
  });
  useEffect(() => { if (new URLSearchParams(window.location.search).get('nostr_pk')) window.history.replaceState({}, '', window.location.pathname); }, []);
  const login = async () => {
    if (typeof window !== 'undefined' && window.nostr) {
      try { const pk = await window.nostr.getPublicKey(); if (pk) { setPubkey(pk); localStorage.setItem('nostr_pubkey', pk); } } catch {}
      return;
    }
    const cb = `${window.location.origin}${window.location.pathname}?nostr_pk={signature}`;
    window.location.href = `nostrsigner:getpubkey?compressionType=none&returnType=signature&type=get_public_key&callbackUrl=${encodeURIComponent(cb)}`;
  };
  const logout = () => { setPubkey(null); try { localStorage.removeItem('nostr_pubkey'); } catch {} };
  return { pubkey, login, logout };
}
// Light-weight kind:0 lookup so the nav login button can show the user's
// avatar + display name. Lazy: only opens a socket once `pubkey` is set.
function useUserProfile(pubkey: string | null) {
  const [profile, setProfile] = useState<{ name?: string; display_name?: string; picture?: string } | null>(null);
  useEffect(() => {
    if (!pubkey) { setProfile(null); return; }
    setProfile(null);
    const relays = ['wss://relay.fizx.uk', 'wss://nos.lol'];
    const sockets: WebSocket[] = [];
    let latestTs = 0;
    relays.forEach(url => {
      let ws: WebSocket;
      try { ws = new WebSocket(url); } catch { return; }
      sockets.push(ws);
      const subId = `prof-${Math.random().toString(36).slice(2, 8)}`;
      ws.onopen = () => { try { ws.send(JSON.stringify(['REQ', subId, { kinds: [0], authors: [pubkey], limit: 1 }])); } catch { /* ignore */ } };
      ws.onmessage = (e) => {
        try {
          const m = JSON.parse(e.data as string);
          if (!Array.isArray(m)) return;
          if (m[0] === 'EVENT' && m[1] === subId) {
            const ev = m[2];
            if (ev?.created_at > latestTs) {
              latestTs = ev.created_at;
              try {
                const p = JSON.parse(ev.content);
                if (p && typeof p === 'object') setProfile(p);
              } catch { /* malformed metadata */ }
            }
          } else if (m[0] === 'EOSE') {
            try { ws.close(); } catch { /* ignore */ }
          }
        } catch { /* malformed frame */ }
      };
    });
    return () => { sockets.forEach(s => { try { s.close(); } catch { /* ignore */ } }); };
  }, [pubkey]);
  return profile;
}

function NostrLogin() {
  const { pubkey, login, logout } = useNostrLogin();
  const profile = useUserProfile(pubkey);
  if (pubkey) {
    const label = profile?.display_name || profile?.name || `${pubkey.slice(0, 8)}…`;
    return (
      <button onClick={logout} title={`Signed in as ${label} — click to log out`} className="font-mono text-[11px] px-1.5 py-1 border border-primary/30 text-primary/70 hover:text-primary hover:border-primary/60 transition-colors flex items-center gap-1.5 w-full justify-center whitespace-nowrap">
        {profile?.picture ? (
          <span className="w-4 h-4 rounded-full shrink-0 bg-muted bg-cover bg-center ring-1 ring-primary/30" style={{ backgroundImage: `url(${JSON.stringify(profile.picture)})` }} aria-hidden />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
        )}
        <span className="hidden sm:inline max-w-[7rem] truncate">{label}</span>
        <span className="text-muted-foreground/50 ml-0.5">×</span>
      </button>
    );
  }
  return (
    <button onClick={login} className="font-mono text-[11px] px-2 py-1 border border-border text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors flex items-center gap-1.5 w-full justify-center whitespace-nowrap">
      <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      <span className="hidden sm:inline">Log in with Nostr</span>
    </button>
  );
}

// ── 21-bar ────────────────────────────────────────────────────────────────────
const SQUARE_COUNT = 21;
const SQUARE_DIM = '#161e2e';
const CORAL:   [number, number, number] = [255, 120,  73];
const AMBER:   [number, number, number] = [255, 179,  71];
function lerpHex(a: [number, number, number], b: [number, number, number], t: number) {
  return `rgb(${Math.round(a[0]+(b[0]-a[0])*t)},${Math.round(a[1]+(b[1]-a[1])*t)},${Math.round(a[2]+(b[2]-a[2])*t)})`;
}
const SQUARE_COLORS = Array.from({ length: SQUARE_COUNT }, (_, i) => {
  const t = i < 10 ? i / 10 : (SQUARE_COUNT - 1 - i) / 10;
  return lerpHex(CORAL, AMBER, t);
});

// ── Audio feed via native WebSocket ──────────────────────────────────────────
const RELAY_URL = 'wss://relay.fizx.uk';
const AUDIO_EXTS = /\.(mp3|ogg|wav|flac|m4a|aac|opus|weba)(\?.*)?$/i;
const AUDIO_MIME = /^audio\//i;

interface AudioSample {
  id: string;
  pubkey: string;
  created_at: number;
  url: string;
  title: string;
  size?: number;
  format?: string;
}

const MIME_TO_FORMAT: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/mp3':  'mp3',
  'audio/ogg':  'ogg',
  'audio/wav':  'wav',
  'audio/x-wav':'wav',
  'audio/flac': 'flac',
  'audio/x-flac':'flac',
  'audio/mp4':  'm4a',
  'audio/aac':  'aac',
  'audio/opus': 'opus',
  'audio/webm': 'weba',
};

function deriveFormat(mime: string | undefined, url: string): string | undefined {
  const m = (mime ?? '').toLowerCase();
  if (m && MIME_TO_FORMAT[m]) return MIME_TO_FORMAT[m];
  const ext = url.toLowerCase().split('?')[0].split('.').pop();
  if (ext && /^(mp3|ogg|wav|flac|m4a|aac|opus|weba)$/.test(ext)) return ext;
  return undefined;
}

function formatDuration(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '—';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function useAudioMeta(url: string, initialSize?: number) {
  const [size, setSize] = useState<number | null>(initialSize ?? null);
  const [duration, setDuration] = useState<number | null>(null);
  const [sampleRate, setSampleRate] = useState<number | null>(null);
  const probedRef = useRef(false);

  // Size via HEAD if not provided in event tag
  useEffect(() => {
    if (initialSize != null) return;
    let cancelled = false;
    fetch(url, { method: 'HEAD' })
      .then(res => {
        if (cancelled) return;
        const len = res.headers.get('content-length');
        if (len) setSize(parseInt(len, 10));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [url, initialSize]);

  // Duration via hidden audio element loadedmetadata (loads only ~32KB of headers)
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';
    audio.src = url;
    const onMeta = () => setDuration(audio.duration);
    audio.addEventListener('loadedmetadata', onMeta);
    return () => {
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.src = '';
    };
  }, [url]);

  // Sample rate: lazy — only on first play (downloads + decodes the full file once)
  const probeSampleRate = useCallback(async () => {
    if (probedRef.current || sampleRate !== null) return;
    probedRef.current = true;
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const buf = await res.arrayBuffer();
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      const audioBuf = await ctx.decodeAudioData(buf);
      setSampleRate(audioBuf.sampleRate);
      ctx.close();
    } catch {
      probedRef.current = false; // allow retry
    }
  }, [url, sampleRate]);

  return { size, duration, sampleRate, probeSampleRate };
}

function useAudioFeed() {
  const [samples, setSamples]   = useState<AudioSample[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError]     = useState(false);

  useEffect(() => {
    let closed = false;
    let ws: WebSocket;
    try { ws = new WebSocket(RELAY_URL); } catch { setLoading(false); setError(true); return; }

    const timer = setTimeout(() => { if (!closed) { setLoading(false); setError(true); } }, 8000);

    ws.onopen = () => {
      ws.send(JSON.stringify(['REQ', 'sonic', {
        kinds: [1, 1063],
        limit: 100,
        since: Math.floor(Date.now() / 1000) - 86400 * 90,
      }]));
    };

    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data as string);
        if (msg[0] === 'EOSE') { clearTimeout(timer); setLoading(false); return; }
        if (msg[0] !== 'EVENT') return;
        const e = msg[2] as { id: string; kind: number; pubkey: string; created_at: number; content: string; tags: string[][] };
        let url = '', title = '';
        let size: number | undefined;
        let mime = '';
        if (e.kind === 1063) {
          const urlTag  = e.tags.find(t => t[0] === 'url');
          const mTag    = e.tags.find(t => t[0] === 'm');
          const altTag  = e.tags.find(t => t[0] === 'alt') ?? e.tags.find(t => t[0] === 'title');
          const sizeTag = e.tags.find(t => t[0] === 'size');
          url = urlTag?.[1] ?? '';
          mime = mTag?.[1] ?? '';
          title = altTag?.[1] ?? url.split('/').pop()?.replace(/\?.*/, '') ?? 'untitled';
          if (mime && !AUDIO_MIME.test(mime)) return;
          if (!mime && !AUDIO_EXTS.test(url)) return;
          const parsedSize = sizeTag ? parseInt(sizeTag[1], 10) : NaN;
          if (Number.isFinite(parsedSize) && parsedSize > 0) size = parsedSize;
        } else {
          url = e.content.split(/\s+/).find(w => AUDIO_EXTS.test(w)) ?? '';
          if (!url) return;
          title = e.content.replace(url, '').trim().slice(0, 80) || url.split('/').pop() || 'untitled';
        }
        if (!url) return;
        const format = deriveFormat(mime, url);
        setSamples(prev => {
          if (prev.find(s => s.id === e.id)) return prev;
          return [{ id: e.id, pubkey: e.pubkey, created_at: e.created_at, url, title, size, format }, ...prev]
            .sort((a, b) => b.created_at - a.created_at).slice(0, 50);
        });
      } catch {}
    };

    ws.onerror = () => { if (!closed) { clearTimeout(timer); setLoading(false); setError(true); } };
    ws.onclose = () => { clearTimeout(timer); };

    return () => { closed = true; ws.close(); };
  }, []);

  return { samples, isLoading, isError };
}

// ── Publish audio note ────────────────────────────────────────────────────────
async function publishAudio(pubkey: string, url: string, title: string, mime: string): Promise<boolean> {
  if (!window.nostr) return false;
  try {
    const tags: string[][] = [['url', url], ['m', mime || 'audio/mpeg']];
    if (title) tags.push(['alt', title]);
    const template = { kind: 1063, created_at: Math.floor(Date.now() / 1000), tags, content: title || url };
    const signed = await window.nostr.signEvent(template) as object;
    const ws = new WebSocket(RELAY_URL);
    await new Promise<void>((res, rej) => {
      ws.onopen = () => ws.send(JSON.stringify(['EVENT', signed]));
      ws.onmessage = () => { ws.close(); res(); };
      ws.onerror = rej;
      setTimeout(() => { ws.close(); rej(); }, 5000);
    });
    return true;
  } catch { return false; }
}

// ── Waveform ──────────────────────────────────────────────────────────────────
function Waveform({ audioRef, playing }: { audioRef: React.RefObject<HTMLAudioElement>; playing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waRef = useRef<{ actx: AudioContext; analyser: AnalyserNode } | null>(null);
  const rafRef = useRef(0);
  const failedRef = useRef(false);

  const drawIdle = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(52,211,153,0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  }, []);

  useEffect(() => { drawIdle(); }, [drawIdle]);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      drawIdle();
      return;
    }
    if (failedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!waRef.current) {
        const actx = new AudioContext();
        const source = actx.createMediaElementSource(audio);
        const analyser = actx.createAnalyser();
        analyser.fftSize = 64;
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);
        analyser.connect(actx.destination);
        waRef.current = { actx, analyser };
      }
      if (waRef.current.actx.state === 'suspended') waRef.current.actx.resume();
    } catch {
      failedRef.current = true;
      return;
    }

    const { analyser } = waRef.current;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(data);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d')!;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      const barW = W / data.length;
      data.forEach((val, i) => {
        const t = i / (data.length - 1);
        const r = Math.round(52  + (167 - 52)  * t);
        const g = Math.round(211 + (139 - 211) * t);
        const b = Math.round(153 + (250 - 153) * t);
        const h = Math.max(2, (val / 255) * H);
        ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
        ctx.fillRect(i * barW, H - h, Math.max(barW - 1, 1), h);
      });
    };
    draw();

    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, audioRef, drawIdle]);

  return <canvas ref={canvasRef} width={320} height={40} className="w-full h-10" />;
}

// ── SampleCard ────────────────────────────────────────────────────────────────
function SampleCard({ sample }: { sample: AudioSample }) {
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const filename = sample.url.split('/').pop()?.replace(/\?.*/, '') ?? 'audio';
  const { size, duration, sampleRate, probeSampleRate } = useAudioMeta(sample.url, sample.size);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play().then(() => { setPlaying(true); probeSampleRate(); }).catch(() => {}); }
  };

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://njump.me/${sample.id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="bg-card border border-border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-mono text-foreground truncate">{sample.title}</p>
          <p className="text-[10px] font-mono text-muted-foreground/50 mt-0.5">
            {sample.pubkey.slice(0, 8)}… · {new Date(sample.created_at * 1000).toLocaleDateString()}
            {sample.format && ` · ${sample.format}`}
            {duration != null && ` · ${formatDuration(duration)}`}
            {size != null && ` · ${formatBytes(size)}`}
            {sampleRate != null && ` · ${(sampleRate / 1000).toFixed(1)} kHz`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={copyShare} title="Copy note link" className="text-muted-foreground hover:text-primary transition-colors">
            {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <a href={sample.url} download={filename} className="text-muted-foreground hover:text-primary transition-colors" title="Download">
            <Download className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <Waveform audioRef={audioRef} playing={playing} />

      <audio ref={audioRef} src={sample.url} preload="none" crossOrigin="anonymous"
        onEnded={() => setPlaying(false)} onError={() => setPlaying(false)} />

      <button onClick={toggle}
        className="w-full flex items-center justify-center gap-2 border border-border py-2 text-xs font-mono text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors">
        {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        {playing ? 'pause' : 'play'}
      </button>
    </div>
  );
}

// ── UploadArea ────────────────────────────────────────────────────────────────
const NOSTR_BUILD_URL = 'https://nostr.build/api/v2/nip96/upload';

async function sha256Hex(buf: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function nip98AuthHeader(url: string, method: string, payloadHash?: string): Promise<string> {
  const tags: string[][] = [['u', url], ['method', method]];
  if (payloadHash) tags.push(['payload', payloadHash]);
  const template = { kind: 27235, created_at: Math.floor(Date.now() / 1000), tags, content: '' };
  const signed = await window.nostr!.signEvent(template) as object;
  return 'Nostr ' + btoa(JSON.stringify(signed));
}

async function uploadToNostrBuild(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const hash = await sha256Hex(buf);
  const auth = await nip98AuthHeader(NOSTR_BUILD_URL, 'POST', hash);
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(NOSTR_BUILD_URL, { method: 'POST', headers: { Authorization: auth }, body: form });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`upload failed: ${res.status} ${text.slice(0, 100)}`);
  }
  const json = await res.json();
  const fileUrl = json?.nip94_event?.tags?.find((t: string[]) => t[0] === 'url')?.[1] ?? json?.data?.[0]?.url ?? json?.url;
  if (!fileUrl) throw new Error('no url in response');
  return fileUrl as string;
}

function UploadArea({ pubkey }: { pubkey: string }) {
  const [mode, setMode]   = useState<'url' | 'file'>('url');
  const [url, setUrl]     = useState('');
  const [title, setTitle] = useState('');
  const [mime, setMime]   = useState('audio/mpeg');
  const [file, setFile]   = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'busy' | 'ok' | 'err'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      setMime(f.type || 'audio/mpeg');
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('busy');
    try {
      let finalUrl = url.trim();
      let finalMime = mime;
      if (mode === 'file') {
        if (!file) { setStatus('idle'); return; }
        setStatus('uploading');
        finalUrl = await uploadToNostrBuild(file);
        finalMime = file.type || mime;
        setStatus('busy');
      }
      if (!finalUrl) { setStatus('idle'); return; }
      const ok = await publishAudio(pubkey, finalUrl, title.trim(), finalMime);
      setStatus(ok ? 'ok' : 'err');
      if (ok) { setUrl(''); setTitle(''); setFile(null); if (fileRef.current) fileRef.current.value = ''; }
    } catch {
      setStatus('err');
    }
    setTimeout(() => setStatus('idle'), 3000);
  };

  const busy = status === 'uploading' || status === 'busy';
  const canSubmit = mode === 'url' ? !!url.trim() : !!file;

  return (
    <form onSubmit={submit} className="bg-card border border-border p-4 space-y-3">
      {/* Mode toggle */}
      <div className="flex border border-border">
        {(['url', 'file'] as const).map(m => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`flex-1 py-1.5 text-xs font-mono transition-colors ${mode === m ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            {m === 'url' ? 'paste url' : 'local file'}
          </button>
        ))}
      </div>

      {mode === 'url' ? (
        <input type="url" value={url} onChange={e => setUrl(e.target.value)}
          placeholder="Audio URL (https://…mp3)"
          className="w-full bg-transparent border border-border px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 transition-colors" />
      ) : (
        <div
          className="border border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="audio/*" onChange={onFileChange} className="hidden" />
          <div className="px-3 py-6 text-center">
            {file ? (
              <p className="text-sm font-mono text-foreground truncate">{file.name}</p>
            ) : (
              <>
                <Upload className="h-4 w-4 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-xs font-mono text-muted-foreground/60">Click to choose an audio file</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="flex-1 bg-transparent border border-border px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/60 transition-colors" />
        {mode === 'url' && (
          <select value={mime} onChange={e => setMime(e.target.value)}
            className="bg-card border border-border px-3 py-2 text-xs font-mono text-muted-foreground outline-none focus:border-primary/60 transition-colors">
            <option value="audio/mpeg">mp3</option>
            <option value="audio/ogg">ogg</option>
            <option value="audio/wav">wav</option>
            <option value="audio/flac">flac</option>
            <option value="audio/mp4">m4a</option>
            <option value="audio/opus">opus</option>
          </select>
        )}
      </div>

      <button type="submit" disabled={!canSubmit || busy}
        className="w-full font-mono text-xs py-2 border border-primary/50 text-primary hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
        <Upload className="h-3 w-3" />
        {status === 'uploading' ? 'uploading…' : status === 'busy' ? 'publishing…' : status === 'ok' ? 'published ✓' : status === 'err' ? 'failed ✗' : 'publish to nostr'}
      </button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Index() {
  const { pubkey } = useNostrLogin();
  const { samples, isLoading, isError } = useAudioFeed();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => (t < SQUARE_COUNT ? t + 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Nav */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <a href="https://upleb.uk" className="font-mono text-[11px] sm:text-[12px] text-muted-foreground/50 hover:text-primary transition-colors shrink-0">upleb</a>
          {(() => {
            const SUBS = ['blst','glmps','npub','pls','smpl'] as const;
            const cur = SUBS.find((s) => window.location.hostname === `${s}.upleb.uk`);
            return <>
              {cur && <span className="font-mono text-[11px] sm:text-[12px] text-primary whitespace-nowrap shrink-0 cursor-default">{cur}</span>}
              <div className="flex-1 flex justify-center items-center gap-x-3 overflow-x-auto">
                {SUBS.filter((s) => s !== cur).map((sub) => (
                  <a key={sub} href={`https://${sub}.upleb.uk`} className="text-muted-foreground/60 hover:text-primary transition-colors whitespace-nowrap text-[11px] sm:text-[12px] font-mono">{sub}</a>
                ))}
              </div>
            </>;
          })()}
          <div className="shrink-0 flex justify-end w-[34px] sm:w-[160px]"><NostrLogin /></div>
        </div>
      </nav>

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 space-y-10">

        {/* Hero */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <AnimatedTitle accent="smpl" rest="" from="#FF7849" to="#FFB347" suffixRgba="rgba(255,120,73,0.2)" />
            <NstartHand />
          </div>
          <div className="flex items-center gap-[3px]">
            {SQUARE_COLORS.map((litColor, i) => (
              <div key={i} className="flex-1 h-[2px] transition-colors duration-300"
                style={{ backgroundColor: i < tick ? litColor : SQUARE_DIM }} />
            ))}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="h-[2px] bg-primary/50 shrink-0" style={{ width: 'calc((100% - 60px) / 21)' }} />
            <p className="text-sm text-muted-foreground">Share short audio samples on Nostr — publish a URL, play, download, collaborate.{' '}
              <span className="inline-block rounded-full bg-accent text-accent-foreground font-mono text-[10px] px-2 py-0.5 align-middle">
                kind 1063
              </span>
            </p>
          </div>
          <RelayStats
            className="mt-1"
            urls={[RELAY_URL]}
            filter={{ kinds: [1, 1063], limit: 100, since: Math.floor(Date.now() / 1000) - 86400 * 90 }}
          />
        </div>

        {/* Upload */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[2px] bg-primary/50 shrink-0" style={{ width: 'calc((100% - 60px) / 21)' }} />
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Publish Sample</h2>
          </div>
          {pubkey ? (
            <UploadArea pubkey={pubkey} />
          ) : (
            <div className="border border-dashed border-border/60 p-8 text-center">
              <p className="text-xs font-mono text-muted-foreground/60">
                Log in with Nostr to publish samples
              </p>
            </div>
          )}
        </section>

        {/* Feed */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[2px] bg-primary/50 shrink-0" style={{ width: 'calc((100% - 60px) / 21)' }} />
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Samples
            </h2>
            {!isLoading && samples.length > 0 && (
              <span className="text-[9px] font-mono text-muted-foreground/50">{samples.length}</span>
            )}
            {isLoading && <Radio className="w-3 h-3 text-primary animate-pulse" />}
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 py-12 justify-center">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span className="text-xs font-mono text-muted-foreground">Connecting to relay…</span>
            </div>
          )}
          {isError && (
            <p className="text-xs font-mono text-red-400/60 py-8 text-center">
              Could not load samples — relay may be unreachable.
            </p>
          )}
          {!isLoading && !isError && samples.length === 0 && (
            <p className="text-xs font-mono text-muted-foreground/50 py-12 text-center">
              No audio samples found yet. Be the first to publish one.
            </p>
          )}
          {samples.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {samples.map(s => <SampleCard key={s.id} sample={s} />)}
            </div>
          )}
        </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4">
        <p className="text-center text-xs font-mono text-primary/60">✦ built with claude</p>
      </footer>

    </div>
  );
}
