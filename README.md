# prompt-middleware

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/kueckelheim.prompt-middleware)](https://marketplace.visualstudio.com/items?itemName=kueckelheim.prompt-middleware)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/kueckelheim.prompt-middleware)](https://marketplace.visualstudio.com/items?itemName=kueckelheim.prompt-middleware)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/kueckelheim.prompt-middleware)](https://marketplace.visualstudio.com/items?itemName=kueckelheim.prompt-middleware)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

`prompt-middleware` is a lightweight VS Code extension that helps you refine prompts in Copilot Chat using consistent, project-specific guidelines.

![](./assets/demo.gif)

---

## ✨ Features

- Define prompt and code style guidelines in version-controlled Markdown files.
- Auto-refine Copilot prompts by typing `@refine [your prompt]` in Ask mode.
- Automatically attaches your guidelines to the refined prompt as context.
- Clears previous messages for a clean, focused chat session.

---

## 🛠️ Setup

1. Add these two files to your project:
   - `/context/prompt-guidelines.md`
   - `/context/code-guidelines.md`
2. Open GitHub Copilot Chat in VS Code.
3. Switch to **Ask mode**.
4. Type a message like:  
   `@refine create a function to validate email input`
5. The extension will:
   - Rewrite your prompt based on your guidelines.
   - Reset the chat with the improved prompt prefilled.
   - Attach your `code-guidelines.md` as context.

[→ See examples](./context)

---

## 💡 Why use it?

- Avoid repeating your tone, style, or tech stack in every prompt.
- Enforce consistent standards across a project or team.
- Speed up your workflow with reusable, editable guidelines.

---

## 📦 Install

[Install from the VS Code Marketplace →](https://marketplace.visualstudio.com/items?itemName=kueckelheim.prompt-middleware)

---

## ⚙️ Extension Settings

This extension has no configuration options at the moment.

---

## 📋 Requirements

Your project must include:

- `/context/prompt-guidelines.md`
- `/context/code-guidelines.md`

---

## 📄 License

**prompt-middleware** © 2025 by Erik Nogueira Kückelheim  
Licensed under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)

---

## 🤝 Contributing

Contributions are welcome!

If you'd like to improve this extension, follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-feature`)
3. Make your changes
4. Commit and push (`git commit -am 'Add my feature' && git push origin feature/my-feature`)
5. Open a pull request

Please keep changes focused and include a short explanation of what you did. Feel free to open an issue if you want to discuss a feature or bug first.