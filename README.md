# Valheim Status HTTP Server

This project provides a lightweight HTTP server that serves a `status.json` for monitoring the status of a Valheim game server. It is intended to be used for sharing Valheim server status information publicly.

## Usage

- The HTTP status server is **only enabled when** the environment variable `STATUS_HTTP=true` is set.
- When active, the server exposes an endpoint to display the current `status.json` for Valheim.
- Useful for communities or admins who wish to monitor and share the current state of their public Valheim game server.

## Author

Taras Shabaranskyi <shabaranskij@gmail.com>

## License

[MIT](./LICENSE)
