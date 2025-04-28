// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<any> => {
  // Chat request handler implementation goes here
  stream.progress("Picking the right topic to teach...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  stream.markdown("# Done! \n");
};

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Register the chat participant and its request handler
  const cat = vscode.chat.createChatParticipant("prompt.middleware", handler);

  // Optionally, set some properties for @cat
  // cat.iconPath = vscode.Uri.joinPath(context.extensionUri, "cat.jpeg");
}

// This method is called when your extension is deactivated
export function deactivate() {}
