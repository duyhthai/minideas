# Minideas

Ideas, illustrated: short card stacks that explain tech ideas and review books, in English and Vietnamese. Live at **[minideas.com](https://minideas.com)**.

[![Minideas: big ideas from tech and from books, each in a few pictures](https://minideas.com/og/en/home.png)](https://minideas.com)

**Want to write for Minideas?** You don't need to code: write a draft anywhere and send its link through the site's [Suggest or send an article](https://minideas.com/en/suggest/) page. If you use GitHub, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Run it

The site is static. A Node build script turns the content in `src/` into pages, pencil-sketch drawings and link-preview images in `dist/`. It needs Node 22.

```sh
npm install
npm run dev      # builds, serves http://localhost:4321 and rebuilds when src/ changes
npm run build    # one-off build into dist/
```

To add an explainer or a book review, see [docs/adding-content.md](docs/adding-content.md). [CLAUDE.md](CLAUDE.md) explains how everything is organised.

## License

Code: [MIT](LICENSE). Writing and drawings: CC BY-NC 4.0, with some exceptions (book photos, quotes, the logo). See [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
