# Contributing to Minideas

<img src="brand/minideas-icon.svg" alt="" width="64" align="right">

Thanks for helping! Minideas is a bilingual (English / Vietnamese) site of illustrated explainers and book reviews. You can write in English, Vietnamese or both: a page in one language appears on that language's site, and we can translate it later.

## Ways to help

| | What | How |
| --- | --- | --- |
| ✏️ | **Fix something:** a typo, awkward Vietnamese or English, a broken link, a drawing that looks wrong | Open an issue, or send the fix as a pull request |
| 💡 | **Suggest a topic** | Open an issue, or use the [Suggest or send an article](https://minideas.com/en/suggest/) page |
| 🧩 | **Write a tech explainer:** a short illustrated stack on one idea | [Without GitHub](#writing-without-github) or [with GitHub](#writing-with-github) |
| 📚 | **Write a book review**, in your own structure and voice (a rating is fine if you want one) | [Without GitHub](#writing-without-github) or [with GitHub](#writing-with-github) |

## Writing without GitHub

No code needed. Write your draft anywhere (Google Docs, a blog, a note), then send its link through the [Suggest or send an article](https://minideas.com/en/suggest/) page. Minideas turns it into a card stack and gets back to you if you leave your email.

## Writing with GitHub

**Start with [docs/adding-content.md](docs/adding-content.md).** It walks through adding an explainer or a book review, with examples to copy. [CLAUDE.md](CLAUDE.md) goes deeper into how the site is built; it is written for AI coding assistants but works for people too.

You need [Node 22](https://nodejs.org/), [git](https://git-scm.com/) and a GitHub account. No accounts or keys for the site's services: the build works offline with what's in the repo.

<details>
<summary><b>First time: make your copy</b> (once)</summary>

1. On GitHub, click **Fork** on this repo to make your own copy.
2. Download your copy and install what the build uses:

   ```sh
   git clone https://github.com/<your-name>/minideas.git
   cd minideas
   git remote add upstream https://github.com/duyhthai/minideas.git
   git fetch upstream
   git checkout -b dev upstream/dev
   npm install
   ```

</details>

### Each article or fix

1. **Start a branch** from the latest **`dev`**:

   ```sh
   git checkout dev
   git pull upstream dev
   git checkout -b my-topic
   ```

2. **Preview it:** run `npm run dev` and open <http://localhost:4321>. The first build takes about 40 seconds; after that, every save rebuilds in a second and reloads the page.
3. **Make your change.**

   > [!TIP]
   > There are no tests: the build is the check. It stops with a list of problems (a missing panel or label, a photo that isn't there, a drawing that outputs `NaN`).

4. **Look at your pages** in light and dark mode, on a wide and a narrow window.
5. **Send it** to your copy on GitHub:

   ```sh
   git add -A
   git commit -m "Add an explainer on QR payments"
   git push -u origin my-topic
   ```

6. **Open a pull request** from your branch into **`dev`**.

   > [!IMPORTANT]
   > Target `dev`, not `main`. Every change to `main` goes live on minideas.com, so only the owner merges into it.

## Guidelines

### 🧩 Explainers

Read "Writing explainers" and "Vietnamese text" in [CLAUDE.md](CLAUDE.md) first. In short:

- ✅ Write for a general curious reader; each idea builds on the last
- ✅ Show a concrete scene rather than a list of definitions
- ✅ Introduce jargon once, in plain words first
- ✅ "Go deeper" links that open without an account
- 🚫 Vendor product lists

### 📚 Book reviews

- ✅ Your own writing
- ✅ Photos you took or have the right to use, with a caption in each language you write
- 🚫 Reviews pasted from other sites
- The reviews from Sâu Sách, Duy's old book site, stay as he wrote them; typo reports are welcome.

## License

Code contributions are under the MIT License. Writing and drawings are published under CC BY-NC 4.0, and you keep the copyright to your own reviews. See [LICENSE-CONTENT.md](LICENSE-CONTENT.md).
