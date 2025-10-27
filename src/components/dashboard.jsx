import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  formatDateIso,
  relativeTime,
  parseKeywords,
  responsePlaceholder,
  humanDuration,
  useOnline,
  getPlatformLabel,
  getServerTypeLabel,
} from "../utils/utils";

function fetchServerStatus() {
  return fetch("/api/server-status")
    .then((r) => {
      if (!r.ok) throw new Error("Network response was not ok");
      return r.json();
    });
}

export default function ValheimServerDashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["server-status"],
    queryFn: fetchServerStatus,
    refetchInterval: 5_000,
    placeholderData: responsePlaceholder(),
  });

  const parsedKeywords = useMemo(() => parseKeywords(data?.keywords), [data?.keywords]);
  const status = useOnline(data.last_status_update);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">

        {/* Loading/error banner */}
        {isLoading && (
          <div className="mb-4 p-3 rounded bg-blue-100 text-blue-800 text-sm text-center">
            Loading server status&hellip;
          </div>
        )}
        {isError && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-sm text-center">
            Failed to fetch server status.
          </div>
        )}

        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{data.server_name} — Server Dashboard</h1>
            <p className="text-sm text-gray-500">Game ID: {data.game_id} • Steam
              ID: {data.steam_id}</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                status === 'online'
                  ? 'bg-green-100 text-green-800'
                  : status === 'offline'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              {status.toUpperCase()}
            </span>

            <div className="text-right text-sm">
              <div className="text-gray-600">Last update</div>
              <div className="font-medium">{formatDateIso(data.last_status_update)}</div>
              <div className="text-xs text-gray-400">{relativeTime(data.last_status_update)}</div>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Info card */}
          <section className="md:col-span-2">
            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h2 className="text-lg font-medium mb-4">Server Info</h2>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <dt className="text-xs text-gray-500">Server name</dt>
                  <dd className="font-medium">{data.server_name}</dd>
                </div>

                <div>
                  <dt className="text-xs text-gray-500">Port</dt>
                  <dd className="font-medium">{data.port}</dd>
                </div>

                <div>
                  <dt className="text-xs text-gray-500">Platform</dt>
                  <dd className="font-medium">{getPlatformLabel(data.platform)}</dd>
                </div>

                <div>
                  <dt className="text-xs text-gray-500">Server type</dt>
                  <dd className="font-medium">{getServerTypeLabel(data.server_type)}</dd>
                </div>

                <div>
                  <dt className="text-xs text-gray-500">Players</dt>
                  <dd className="font-medium">{data.player_count}</dd>
                </div>

                <div>
                  <dt className="text-xs text-gray-500">Password protected</dt>
                  <dd className="font-medium">{data.password_protected ? "Yes" : "No"}</dd>
                </div>

                <div>
                  <dt className="text-xs text-gray-500">VAC</dt>
                  <dd className="font-medium">{data.vac_enabled ? "Enabled" : "Disabled"}</dd>
                </div>

                <div>
                  <dt className="text-xs text-gray-500">Error</dt>
                  <dd className="font-medium text-red-600">{data.error ?? "—"}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <h3 className="text-sm text-gray-600 mb-2">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(parsedKeywords).length === 0 &&
                    <span className="text-sm text-gray-400">No keywords</span>}
                  {Object.entries(parsedKeywords).map(([k, v]) => (
                    <div key={k} className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">
                      {k}: {v || "(empty)"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside>
            <div className="bg-white shadow-sm rounded-2xl p-5">
              <h2 className="text-lg font-medium mb-4">Players</h2>
              {data.players && data.players.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-500 border-b">
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Duration</th>
                    <th className="py-2">Score</th>
                  </tr>
                  </thead>
                  <tbody>
                  {data.players.map((p, idx) => (
                    <tr key={idx} className="odd:bg-gray-50">
                      <td className="py-2">
                        {p.name && p.name.trim() ? p.name :
                          <span className="text-gray-400 italic">(unnamed)</span>}
                      </td>
                      <td className="py-2">
                        {typeof p.duration === "number"
                          ? humanDuration(p.duration)
                          : <span className="text-gray-400">—</span>}
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-sm text-gray-500">No players connected.</div>
              )}
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}