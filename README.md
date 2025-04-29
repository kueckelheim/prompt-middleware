# prompt-middleware

`prompt-middleware` is a simple Visual Studio Code extension that provides a chat participant in Copilot's Ask mode. It helps you refine prompts using maintainable context from `/context/prompt-guidelines.md` and `/context/code-guidelines.md`.

![](./assets/demo.gif)

## How it works

- Create the `/context/prompt-guidelines.md` file and define your prompt guidelines (see [example](/context/prompt-guidelines.md) to get started).
- Create the `/context/code-guidelines.md` file and define your coding guidelines (see [example](/context/code-guidelines.md) to get started).
- Open the GitHub Copilot chat in VS Code.
- Switch to Ask mode.
- Type @refine [your prompt] and send the message.
- The extension improves your prompt using your guidelines.
- It clears the chat history and inserts the refined prompt into a new chat input.
- It also attaches your code-guidelines.md file as context.
- You can edit the refined prompt or press Enter to run it — either in Ask mode or Edit mode to apply changes directly in your editor.

## Why

With `prompt-middleware`, you can define your own prompt and code guidelines once — and reuse them automatically. This avoids repeating your tone, style, or tech stack every time. Your guidelines live in version-controlled files you can update over time.

## Use cases

- **Project-Specific Context**: Automatically include project-specific details like coding standards, libraries, or frameworks.
- **Team Collaboration**: Standardize prompts across a team to maintain consistency in communication with AI tools.
- **Faster workflow**: Refine prompts with a single command instead of rewriting.

## Installation

You can install the `prompt-middleware` extension directly from the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items/?itemName=kueckelheim.prompt-middleware)

## Requirements

Your project should include these two files:

- `/context/prompt-guidelines.md`
- `/context/code-guidelines.md`

See [example](/context/code-guidelines.md) to get started.

## Extension Settings

This extension does not currently contribute any settings.

## Release Notes

TBD

## License

prompt-middleware © 2025 by Erik Nogueira Kückelheim is licensed under Creative Commons Attribution-NonCommercial 4.0 International
