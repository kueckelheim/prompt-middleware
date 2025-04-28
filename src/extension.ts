// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { promises as fs } from "fs";
import path from "path";

async function loadContext() {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error("No workspace is open.");
  }

  const workspaceRoot = workspaceFolders[0].uri.fsPath;
  const filePath = path.join(workspaceRoot, "context", "context.md");
  return await fs.readFile(filePath, "utf-8");
}

const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<any> => {
  stream.progress("Refining your prompt...");

  let contextMarkdown: string;
  try {
    contextMarkdown = await loadContext();
  } catch (error) {
    stream.markdown(
      "Error reading the markdown file. Make sure that the file /context/context.md exists."
    );
    return;
  }

  const refinedPrompt = `
You are a prompt improvement assistant. Your task is to enhance a prompt by applying best practices from prompt engineering, focusing on clarity, specificity, context, and conciseness:

Also make sure to include the following guidelines in your new prompt (specifically mention them in the prompt if applicable):
+++ guidelines start
${contextMarkdown}
+++ guidelines end

Here's the prompt that needs refinement: 
+++ start user prompt
${request.prompt}
+++ end user prompt

Only return the pure refined prompt without any additional text such that the user can copy and paste it directly. Do not include any heading or quotes, just the refined prompt.`;

  const response = await request.model.sendRequest([
    {
      role: vscode.LanguageModelChatMessageRole.User,
      content: refinedPrompt as unknown as vscode.LanguageModelTextPart[],
      name: undefined,
    },
  ]);

  let fullResponseText = ""; // Collect the full response text

  for await (const chunk of response.stream) {
    const chunkText = (chunk as vscode.LanguageModelTextPart).value;
    stream.markdown(chunkText);
    fullResponseText += chunkText;
  }

  stream.button({
    title: "Copy to Clipboard",
    command: "prompt-middleware.copyToClipboard",
    tooltip: "Copies the response to the clipboard",
    arguments: [fullResponseText],
  });
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Register the chat participant and its request handler
  vscode.chat.createChatParticipant("prompt-middleware.refine", handler);

  // Register the command to copy the response to the clipboard
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "prompt-middleware.copyToClipboard",
      async (responseText: string) => {
        await vscode.env.clipboard.writeText(responseText);
        vscode.window.showInformationMessage(
          "Refined prompt copied to clipboard!"
        );
      }
    )
  );

  // Optionally, set some properties for @cat
  // cat.iconPath = vscode.Uri.joinPath(context.extensionUri, "cat.jpeg");
}

// This method is called when your extension is deactivated
export function deactivate() {}
