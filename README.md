# Minideas

Ideas, illustrated: short card stacks that explain tech ideas and review books, in English and Vietnamese. Live at **https://minideas.com**.

The site is static. A Node build script turns the content in `src/` into pages, pencil-sketch drawings and link-preview images in `dist/`.

## Run it

Needs Node 22.

```sh
npm install
npm run dev      # builds, serves http://localhost:4321 and rebuilds when src/ changes
npm run build    # one-off build into dist/
```

To add an explainer or a book review, see [docs/adding-content.md](docs/adding-content.md). [CLAUDE.md](CLAUDE.md) explains how everything is organised.

## Contributing

Fixes, explainers and your own book reviews are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Code: [MIT](LICENSE). Writing and drawings: CC BY-NC 4.0, with some exceptions (book photos, quotes, the logo). See [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
