import { useMemo } from "react";

export function formatDateIso(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch (e) {
    return iso;
  }
}

// Format a duration in seconds to "Xm Ys" (only minutes/seconds for small enough times)
export function humanDuration(seconds) {
  if (typeof seconds !== "number" || isNaN(seconds)) return "—";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  let out = [];
  if (mins > 0) out.push(`${mins}m`);
  out.push(`${secs}s`);
  return out.join(" ");
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

/**
 * Determines the online status of a server based on the last update time.
 *
 * @param {string|Date} lastUpdate - The timestamp of the last update. It can be a date string or a Date object.
 * @return {string|null} Returns "online" if the last update was within the last 2 minutes,
 *                       "offline" if it was more than 2 minutes ago,
 *                       or null if the lastUpdate is invalid.
 */
export function useOnline(lastUpdate) {
  return useMemo(() => {
    // Consider server online if last update within 2 minutes
    const last = new Date(lastUpdate).getTime();
    const now = Date.now();
    if (isNaN(last)) return null;
    const diff = now - last;
    if (diff < 1000 * 60 * 2) return "online";
    return "offline";
  }, [lastUpdate]);
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

// Helper functions to show friendly names for platform and server type
export const PLATFORM_MAP = {
  l: 'Linux',
  w: 'Windows',
  m: 'macOS',
};

export function getPlatformLabel(code) {
  return PLATFORM_MAP[code] || code || "—";
}

export const SERVER_TYPE_MAP = {
  d: 'Dedicated',
  l: 'Local',
  // Add more as needed
};

export function getServerTypeLabel(code) {
  return SERVER_TYPE_MAP[code] || code || "—";
}
