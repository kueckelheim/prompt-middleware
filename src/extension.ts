// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

const handler: vscode.ChatRequestHandler = async (
  request: vscode.ChatRequest,
  context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<any> => {
  // Step 1: Simulate "thinking"
  stream.progress("Refining your prompt...");
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Step 2: Refine the prompt (simple example: prepend extra context)
  const refinedPrompt = `
  Your task is to improve and structure the given user prompt in a way that ensures clear, precise, and actionable responses. Focus on the following:

Clarity: Make sure the intent is obvious and the task is well-defined.

Context: Include relevant background information and constraints.

Details: Add details that will help guide the output toward the desired solution.

Tone: Specify the desired tone or style (e.g., formal, concise, step-by-step).

Examples: Provide examples or scenarios that could clarify the task.

Output format: Mention how you want the answer structured (e.g., code, list, explanation).

Original Prompt:

${request.prompt}

Additional Instructions:
- only return the pure refined prompt without any additional text such that the user can copy and paste it directly
- do not include any heading or quotes, just the refined prompt`;

  const response = await request.model.sendRequest([
    {
      role: vscode.LanguageModelChatMessageRole.User,
      content: refinedPrompt as unknown as vscode.LanguageModelTextPart[],
      name: undefined,
    },
  ]);

  let fullResponseText = ""; // Collect the full response text

  // Step 4: Stream the response
  for await (const chunk of response.stream) {
    const chunkText = (chunk as vscode.LanguageModelTextPart).value;
    stream.markdown(chunkText);
    fullResponseText += chunkText; // Append each chunk to the full response
  }

  stream.button({
    title: "Copy to Clipboard",
    command: "prompt-middleware.copyToClipboard",
    tooltip: "Copies the response to the clipboard",
    arguments: [fullResponseText], // Pass the full response text
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
