// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { promises as fs } from "fs";
import path from "path";

const loadContext = async (rootPath: string, fileName: string) => {
  const filePath = path.join(rootPath, "context", fileName);
  return await fs.readFile(filePath, "utf-8");
};

const attachCodeGuidelinesAsContext = async (root: vscode.Uri) => {
  const fileUri = vscode.Uri.joinPath(root, "context", "code-guidelines.md");

  await vscode.commands.executeCommand(
    "github.copilot.chat.attachFile",
    fileUri
  );

  await vscode.commands.executeCommand("workbench.action.chat.focusInput");
};

const clearChatInputAndPasteRefinedPrompt = async (refinedPrompt: string) => {
  await vscode.commands.executeCommand("workbench.action.chat.undoEdits");
  await vscode.commands.executeCommand("editor.action.selectAll");
  await vscode.commands.executeCommand("deleteLeft");
  // Write text to clipboard
  await vscode.env.clipboard.writeText(refinedPrompt);

  // Focus on the chat input field (you may need to adjust this if Copilot has a specific focus command)
  await vscode.commands.executeCommand("workbench.action.focusActivityBar");

  // Simulate a keypress action to paste the text from the clipboard into the chat input field
  await vscode.commands.executeCommand("editor.action.clipboardPasteAction");

  await vscode.commands.executeCommand("workbench.action.focusActivityBar");

  await vscode.commands.executeCommand("workbench.action.chat.clearHistory");
};

const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  _: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  __: vscode.CancellationToken
): Promise<any> => {
  stream.progress("Refining your prompt...");

  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    throw new Error("No workspace is open.");
  }
  const workspaceRoot = workspaceFolders![0].uri;

  let promptGuidelines: string;
  try {
    promptGuidelines = await loadContext(
      workspaceRoot.fsPath,
      "prompt-guidelines.md"
    );
  } catch (error) {
    stream.markdown(
      "Error reading the markdown file. Make sure that the file /context/prompt-guidelines.md exists."
    );
    return;
  }
  let codeGuidelines: string;
  try {
    codeGuidelines = await loadContext(
      workspaceRoot.fsPath,
      "code-guidelines.md"
    );
  } catch (error) {
    stream.markdown(
      "Error reading the markdown file. Make sure that the file /context/code-guidelines.md exists."
    );
    return;
  }

  const refinedPrompt = `
You are a prompt improvement assistant. Your task is to enhance a prompt by applying the following prompt guidelines in your new prompt:
+++ prompt guidelines start
${promptGuidelines}
+++ prompt guidelines end

Also make sure to include the following code guidelines in your new prompt (specifically mention them in the prompt if applicable):
+++ guidelines start
${codeGuidelines}
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

  let fullResponseText = "";

  for await (const chunk of response.stream) {
    const chunkText = (chunk as vscode.LanguageModelTextPart).value;
    fullResponseText += chunkText;
  }

  await clearChatInputAndPasteRefinedPrompt(fullResponseText);

  await attachCodeGuidelinesAsContext(workspaceRoot);
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Register the chat participant and its request handler
  const refine = vscode.chat.createChatParticipant(
    "prompt-middleware.refine",
    handler
  );

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

  refine.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    "assets",
    "refine.png"
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
