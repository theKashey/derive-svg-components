# derive-svg-components

Derive React components from SVG base

---

## Usage

There is no need to install or "use" this package. It's a CLI tool you can `npx` or `dlx`

```bash
npx derive-svg-components react source-folder
```

That is all

- all `svg` files will be scanned
- necessary React Components (typescript) derived
  - necessity is defined by the file modification date

## Naming convention

This tool has the aim at simplicity

- if there `svg` in the folder name
  - replace by `react`.
  - `src/icons/svg/add.svg` -> `src/icons/react/add.svg`
- else take the last folder
  - replace by `react-{name}`.
  - `src/icons/add.svg` -> `src/react-icons/add.svg`
- customization?
  - might be you need API, not CLI?

## Gaps

- no SVGO
- no style transformation to prevent collisions

# Licence

MIT
