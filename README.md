# SearchiTunes

A small Angular app that searches the public [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/index.html), previews tracks, browses an artist's songs and albums, and runs a shopping cart flow.

Originally built in 2018 as an Angular 5 learning project. Modernized to **Angular 19** so it runs on current Node.js versions.

## Features

- Search music with debounced queries and 30-second previews
- Artist detail pages with songs and albums tabs
- Shopping cart with add/remove/select/clear actions and checkout simulation
- Hash-based routing (works when hosted as static files)

## Requirements

- Node.js 20+ (tested on Node 26)
- npm 10+

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

- Angular 19 (standalone components, lazy routes)
- Angular Material (theme + feedback components)
- RxJS 7
- Jest for unit testing
- iTunes Search API (no API key required)

## License

MIT
