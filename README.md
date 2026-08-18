# SearchiTunes

A small Angular app that searches the public [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html), previews tracks, browses an artist's songs and albums, and runs a shopping cart flow.

Originally built in 2018 as a learning project. Modernized to run on current Node.js and Angular releases.

## Features

- Search music with debounced queries and 30-second previews
- Artist detail pages with songs and albums tabs
- Shopping cart with add/remove/select/clear actions and checkout simulation
- Hash-based routing (works when hosted as static files)

## Requirements

Supported Node.js and npm versions are declared in `package.json` (`engines`). Use `.nvmrc` with nvm, fnm, or asdf. `npm install` fails on an unsupported Node.js version (`engine-strict` in `.npmrc`).

## Development

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Build

```bash
npm run build
```

Output is written to `dist/searchi-tunes/`.

## Tech stack

- Angular (standalone components, lazy routes)
- Angular Material (theme + feedback components)
- RxJS
- Jest for unit testing
- iTunes Search API (no API key required)

## License

MIT
