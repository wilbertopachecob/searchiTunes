# AGENTS

## Project Purpose
SearchiTunes is an Angular 19 app that searches iTunes music, previews songs, browses artists, and supports a purchasable cart workflow.

## Local Workflow
- Install dependencies with `npm install`.
- Start local development with `npm start`.
- Run type checks with `npm run typecheck`.
- Run unit tests with `npm test` (Jest).
- Create production build with `npm run build`.

## Engineering Rules
- Keep components standalone and prefer lazy routes.
- Reuse `ItunesDataService` for iTunes HTTP access (avoid duplicate mapping logic in components).
- Keep cart logic centralized in `ShoppingService`.
- Add concise JSDoc for public methods and non-obvious transformations.
- Prefer small, composable templates and avoid deeply nested markup.

## Testing Expectations
- Add or update Jest tests for any business logic change.
- Prioritize service-level tests for domain logic and mapping.
- Add component tests when UI actions trigger behavior (for example add-to-cart interactions).

## CI Expectations
- CI must pass for typecheck, build, and Jest tests before merge.
