// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const insertLogs = vscode.commands.registerCommand('logtrace.insertLogs', () => {
		const editor = vscode.window.activeTextEditor;
		const code: string[] = [];
		let count = 1;

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			const text = document.getText(selection);
			const lines = text.split('\n');

			lines.forEach(line => {
				if (line[line.length - 1] === ';') {
					code.push(line);
					code.push(`console.log(${count})`);
					count++;
				} else {
					code.push(line);
				}
			});

			editor.edit(editBuilder => {
				editBuilder.replace(selection, code.join('\n'));
			});
		}
	});

	const removeLogs = vscode.commands.registerCommand('logtrace.removeLogs', () => {
		const editor = vscode.window.activeTextEditor;
		const code: string[] = [];

		if (editor) {
			const document = editor.document;

			const text = document.getText();
			const lines = text.split('\n');
			
			const re = new RegExp(/console.log\(\d+/);
			
			lines.forEach(line => {
				if (!re.test(line)) {
					code.push(line);
				}
			});

			const firstLine = editor.document.lineAt(0);
			const lastLine = editor.document.lineAt(editor.document.lineCount - 1);
			const textRange = new vscode.Range(
				0,
				firstLine.range.start.character,
				editor.document.lineCount - 1,
				lastLine.range.end.character
			);
			editor.edit(editBuilder => {
				editBuilder.replace(textRange, code.join('\n'));
			});
		}
	});

	context.subscriptions.push(insertLogs, removeLogs);
}

// this method is called when your extension is deactivated
export function deactivate() {}
