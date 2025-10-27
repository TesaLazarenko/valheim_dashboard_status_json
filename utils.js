export function formatDateIso(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return iso;
  }
}

export function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (isNaN(diff)) return "unknown";
  const sec = Math.floor(diff / 1000);
  if (sec < 5) return "just now";
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const days = Math.floor(hr / 24);
  return `${days}d ago`;
}

export function parseKeywords(k) {
  if (!k) return {};
  const parts = k.split(",");
  const out = {};
  parts.forEach((p) => {
    if (!p) return;
    const [key, val] = p.split("=");
    out[key] = val ?? "";
  });
  return out;
}

export function responsePlaceholder() {
  return {
    last_status_update: null,
    error: null,
    server_name: null,
    server_type: null,
    platform: null,
    player_count: null,
    password_protected: null,
    vac_enabled: null,
    port: null,
    steam_id: null,
    keywords: null,
    game_id: null,
    players: null,
  }
}