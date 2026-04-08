# Port Monitor

A minimal macOS menu bar app that shows all active TCP listening ports in a native-style HUD popup.


## Requirements

- macOS
- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io)

## Getting started

```bash
pnpm install
pnpm start
```

## Build

Produces a `.dmg` installer via [electron-builder](https://www.electron.build):

```bash
pnpm build
```

## Project structure

| File | Role |
|------|------|
| `main.js` | Electron main process — creates the tray icon, manages the popup window, and runs `lsof` to collect port data |
| `preload.js` | Context bridge — exposes `getPorts`, `onRefresh`, and `quit` to the renderer via `window.api` |
| `index.html` | Renderer — displays the port list and wires up the refresh/quit buttons |
| `styles.css` | All UI styles — macOS HUD vibrancy theme with system blue accents |
