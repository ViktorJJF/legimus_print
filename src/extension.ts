import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Initial legimus print");
  let disposable = vscode.commands.registerCommand(
    "extension.printVariable",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No editor is active");
        return;
      }

      // Check if the language of the current file is Python
      if (editor.document.languageId !== "python") {
        vscode.window.showInformationMessage(
          "This command is only available for Python files"
        );
        return;
      }

      const document = editor.document;
      const selections = editor.selections; // Get all selections

      await editor.edit(
        (editBuilder) => {
          selections.forEach((selection) => {
            const text = document.getText(selection);
            const line = selection.active.line;
            const newPosition = new vscode.Position(line + 1, 0);
            editBuilder.insert(newPosition, `print("🐛 ${text}", ${text})\n`);
          });
        },
        { undoStopBefore: true, undoStopAfter: false }
      );

      // Set a second undo stop after the text insertion
      editor.edit(() => {}, { undoStopBefore: false, undoStopAfter: true });
    }
  );

  const separator = `print("****************************************")\n`;

  const separatorJS = `console.log("****************************************");\n`;

  let printSeparatorDisposable = vscode.commands.registerCommand(
    "extension.printSeparator",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No editor is active");
        return;
      }

      // Check if the language of the current file is Python
      if (editor.document.languageId !== "python") {
        vscode.window.showInformationMessage(
          "This command is only available for Python files"
        );
        return;
      }

      const line = editor.selection.active.line;
      const newPosition = new vscode.Position(line + 1, 0);

      editor.edit((editBuilder) => {
        editBuilder.insert(newPosition, separator);
      });
    }
  );

  let printCombinedDisposable = vscode.commands.registerCommand(
    "extension.printVariableWithSeparator",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No editor is active");
        return;
      }

      // Check if the language of the current file is Python
      if (editor.document.languageId !== "python") {
        vscode.window.showInformationMessage(
          "This command is only available for Python files"
        );
        return;
      }

      const selections = editor.selections;
      await editor.edit(
        (editBuilder) => {
          selections.forEach((selection) => {
            const text = editor.document.getText(selection);
            const line = selection.end.line;
            const newPosition = new vscode.Position(line + 1, 0);

            // Insert separator, variable print statement, and another separator, each on new lines
            editBuilder.insert(
              newPosition,
              `${separator}print("🐛 ${text}", ${text})\n${separator}`
            );
          });
        },
        { undoStopBefore: true, undoStopAfter: false }
      );

      // Set a second undo stop after the text insertion
      editor.edit(() => {}, { undoStopBefore: false, undoStopAfter: true });
    }
  );

  let printCombinedDisposableJS = vscode.commands.registerCommand(
    "extension.consoleLogVariableWithSeparator",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No editor is active");
        return;
      }

      // Check if the language of the current file is JavaScript, TypeScript, or Vue
      const validLanguages = ["javascript", "typescript", "vue"];
      if (!validLanguages.includes(editor.document.languageId)) {
        vscode.window.showInformationMessage(
          "This command is only available for JavaScript, TypeScript, and Vue files"
        );
        return;
      }

      const selections = editor.selections;
      await editor.edit(
        (editBuilder) => {
          selections.forEach((selection) => {
            const text = editor.document.getText(selection);
            const line = selection.end.line;
            const newPosition = new vscode.Position(line + 1, 0);

            // Insert separator, variable print statement, and another separator, each on new lines
            editBuilder.insert(
              newPosition,
              `${separatorJS}console.log('🦎 ${text}', ${text})\n${separatorJS}`
            );
          });
        },
        { undoStopBefore: true, undoStopAfter: false }
      );

      // Set a second undo stop after the text insertion
      editor.edit(() => {}, { undoStopBefore: false, undoStopAfter: true });
    }
  );

  context.subscriptions.push(printCombinedDisposable);
  context.subscriptions.push(disposable, printSeparatorDisposable);
  context.subscriptions.push(disposable, printCombinedDisposableJS);
  context.subscriptions.push(disposable);
}

export function deactivate() {}
